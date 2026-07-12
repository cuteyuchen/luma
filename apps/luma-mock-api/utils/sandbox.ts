import type { AdminAccountKey, MockAccount } from '../domain/auth'
import type { MockSystemState } from '../domain/system'
import process from 'node:process'
import { exportMockAccounts, importMockAccounts, resetMockAccounts } from '../domain/auth'
import { exportMockRolePermissions, importMockRolePermissions, resetMockRolePermissions } from '../domain/permission'
import {
  exportMockSystemState,
  importMockSystemState,
  resetMockDictionaries,
  resetMockSystemMenus,
  resetMockSystemOrganizations,
  resetMockSystemRoles,
  resetMockSystemUsers,
} from '../domain/system'
import { ApiError } from './http'

export interface AdminSystemConfig {
  appName: string
  colorPrimary: string
  layout: 'mixed-nav' | 'sidebar' | 'top-nav'
  tabbarEnable: boolean
  transitionEnable: boolean
}

interface DomainSnapshot {
  accounts: Record<AdminAccountKey, MockAccount>
  permissions: Record<string, string[]>
  system: MockSystemState
}

export interface Sandbox {
  config: AdminSystemConfig
  createdAt: number
  id: string
  lastAccessedAt: number
  snapshot: DomainSnapshot
}

const initialConfig: AdminSystemConfig = {
  appName: 'Luma Admin',
  colorPrimary: '#1677ff',
  layout: 'mixed-nav',
  tabbarEnable: true,
  transitionEnable: true,
}

function capture(): DomainSnapshot {
  return {
    accounts: exportMockAccounts(),
    permissions: exportMockRolePermissions(),
    system: exportMockSystemState(),
  }
}

function restore(snapshot: DomainSnapshot): void {
  importMockAccounts(snapshot.accounts)
  importMockRolePermissions(snapshot.permissions)
  importMockSystemState(snapshot.system)
}

function resetGlobals(): DomainSnapshot {
  resetMockRolePermissions()
  resetMockAccounts()
  resetMockSystemUsers()
  resetMockSystemRoles()
  resetMockSystemMenus()
  resetMockSystemOrganizations()
  resetMockDictionaries()
  return capture()
}

const seed = resetGlobals()
const sandboxes = new Map<string, Sandbox>()
const idleTtlMs = Number(process.env.MOCK_SANDBOX_TTL_MS || 8 * 60 * 60 * 1000)
const maxSandboxes = Number(process.env.MOCK_MAX_SANDBOXES || 500)
let domainQueue: Promise<unknown> = Promise.resolve()

function clone<T>(value: T): T {
  return structuredClone(value)
}

function enqueue<T>(action: () => Promise<T> | T): Promise<T> {
  const result = domainQueue.then(action, action)
  domainQueue = result.then(() => undefined, () => undefined)
  return result
}

export function createSandbox(id: string): Sandbox {
  cleanupSandboxes()
  if (sandboxes.size >= maxSandboxes) {
    const oldest = [...sandboxes.values()].sort((a, b) => a.lastAccessedAt - b.lastAccessedAt)[0]
    if (oldest)
      sandboxes.delete(oldest.id)
  }

  const now = Date.now()
  const sandbox: Sandbox = {
    config: clone(initialConfig),
    createdAt: now,
    id,
    lastAccessedAt: now,
    snapshot: clone(seed),
  }
  sandboxes.set(id, sandbox)
  return sandbox
}

export function getSandbox(id: string): Sandbox {
  const sandbox = sandboxes.get(id)
  if (!sandbox || Date.now() - sandbox.lastAccessedAt > idleTtlMs) {
    sandboxes.delete(id)
    throw new ApiError('演示会话已失效', 401, 'AUTH_EXPIRED')
  }
  sandbox.lastAccessedAt = Date.now()
  return sandbox
}

export function deleteSandbox(id: string): void {
  sandboxes.delete(id)
}

export function resetSandbox(id: string): void {
  const sandbox = getSandbox(id)
  sandbox.snapshot = clone(seed)
  sandbox.config = clone(initialConfig)
}

export function cleanupSandboxes(): void {
  const now = Date.now()
  sandboxes.forEach((sandbox, id) => {
    if (now - sandbox.lastAccessedAt > idleTtlMs)
      sandboxes.delete(id)
  })
}

export function withSandbox<T>(id: string, action: (sandbox: Sandbox) => Promise<T> | T): Promise<T> {
  return enqueue(async () => {
    const sandbox = getSandbox(id)
    restore(sandbox.snapshot)
    const result = await action(sandbox)
    sandbox.snapshot = capture()
    sandbox.lastAccessedAt = Date.now()
    return result
  })
}

const cleanupTimer = setInterval(cleanupSandboxes, 10 * 60 * 1000)
cleanupTimer.unref?.()
