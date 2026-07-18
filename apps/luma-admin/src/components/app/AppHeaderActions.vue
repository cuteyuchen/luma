<script setup lang="ts">
import type { ResolvedThemeMode } from '@luma/core/theme'
import { LumaIcon } from '@luma/icons-vue'
import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
} from 'element-plus'
import { computed } from 'vue'

/***********************属性定义*********************/
const props = withDefaults(defineProps<{
  cockpitUrl: string
  resolvedThemeMode: ResolvedThemeMode
  userName?: string
}>(), {
  userName: '管理员',
})

const emit = defineEmits<{
  logout: []
  openProfile: []
  openSettings: []
  toggleTheme: [event: MouseEvent]
}>()

/***********************显示状态*********************/
const themeToggleTitle = computed(() => props.resolvedThemeMode === 'dark' ? '切换浅色模式' : '切换深色模式')
const userInitial = computed(() => props.userName.trim().slice(0, 1).toUpperCase() || '管')

/***********************事件处理*********************/
function handleToggleTheme(event: MouseEvent): void {
  emit('toggleTheme', event)
}

function handleOpenSettings(): void {
  emit('openSettings')
}

function handleOpenProfile(): void {
  emit('openProfile')
}

function handleLogout(): void {
  emit('logout')
}

function handleMobileMenuCommand(command: unknown): void {
  if (command === 'cockpit') {
    window.open(props.cockpitUrl, '_blank', 'noopener,noreferrer')
  }
  else if (command === 'settings') {
    handleOpenSettings()
  }
  else if (command === 'profile') {
    handleOpenProfile()
  }
  else if (command === 'logout') {
    handleLogout()
  }
}
</script>

<template>
  <div class="luma-admin-header-actions">
    <ElButton
      circle
      text
      :title="themeToggleTitle"
      :aria-label="themeToggleTitle"
      data-action="toggle-theme"
      @click="handleToggleTheme"
    >
      <LumaIcon name="app:theme" :size="16" />
    </ElButton>

    <ElButton
      v-authority="'cockpit:view'"
      class="luma-admin-header-actions__desktop-only"
      circle
      :href="props.cockpitUrl"
      rel="noopener noreferrer"
      tag="a"
      target="_blank"
      text
      title="驾驶舱"
      aria-label="进入驾驶舱"
      data-action="open-cockpit"
    >
      <LumaIcon name="app:cockpit" :size="16" />
    </ElButton>

    <ElButton
      class="luma-admin-header-actions__desktop-only"
      circle
      text
      title="偏好设置"
      aria-label="偏好设置"
      data-action="open-settings"
      @click="handleOpenSettings"
    >
      <LumaIcon name="app:settings" :size="16" />
    </ElButton>

    <span class="luma-admin-header-actions__divider luma-admin-header-actions__desktop-only" aria-hidden="true" />

    <button
      class="luma-admin-header-actions__user luma-admin-header-actions__desktop-only"
      type="button"
      title="个人中心"
      aria-label="进入个人中心"
      data-action="open-profile"
      @click="handleOpenProfile"
    >
      <span class="luma-admin-header-actions__avatar" aria-hidden="true">{{ userInitial }}</span>
      <span class="luma-admin-header-actions__name">{{ userName }}</span>
    </button>

    <ElButton
      class="luma-admin-header-actions__desktop-only"
      circle
      text
      title="退出登录"
      aria-label="退出登录"
      data-action="logout"
      @click="handleLogout"
    >
      <LumaIcon name="app:logout" :size="16" />
    </ElButton>

    <ElDropdown
      class="luma-admin-header-actions__mobile-menu"
      placement="bottom-end"
      popper-class="luma-admin-header-actions__mobile-dropdown"
      :teleported="true"
      trigger="click"
      @command="handleMobileMenuCommand"
    >
      <button
        class="luma-admin-header-actions__mobile-trigger"
        type="button"
        title="账户与更多操作"
        aria-label="账户与更多操作"
        aria-haspopup="menu"
        data-action="open-mobile-account-menu"
      >
        <span class="luma-admin-header-actions__avatar" aria-hidden="true">{{ userInitial }}</span>
      </button>

      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem
            v-authority="'cockpit:view'"
            command="cockpit"
            data-action="open-cockpit-mobile"
          >
            <LumaIcon name="app:cockpit" :size="16" />
            <span>驾驶舱</span>
          </ElDropdownItem>
          <ElDropdownItem command="settings" data-action="open-settings-mobile">
            <LumaIcon name="app:settings" :size="16" />
            <span>偏好设置</span>
          </ElDropdownItem>
          <ElDropdownItem command="profile" data-action="open-profile-mobile">
            <LumaIcon name="app:user" :size="16" />
            <span>个人中心</span>
          </ElDropdownItem>
          <ElDropdownItem
            class="luma-admin-header-actions__mobile-danger"
            command="logout"
            data-action="logout-mobile"
            divided
          >
            <LumaIcon name="app:logout" :size="16" />
            <span>退出登录</span>
          </ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>
</template>

<style scoped lang="scss">
.luma-admin-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.luma-admin-header-actions :deep(.el-button) {
  width: 44px;
  height: 44px;
  margin: 0;
}

.luma-admin-header-actions__user {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 8px;
  border: 0;
  border-radius: var(--luma-radius-small);
  color: var(--el-text-color-regular);
  cursor: pointer;
  background: transparent;
  font-size: calc(var(--luma-font-size-base, 14px) - 1px);
  font-weight: 600;
  white-space: nowrap;
}

.luma-admin-header-actions__user:hover {
  color: var(--el-text-color-primary);
  background: var(--el-fill-color-light);
}

.luma-admin-header-actions__user:focus-visible {
  outline: 2px solid var(--el-color-primary);
  outline-offset: 2px;
}

.luma-admin-header-actions__avatar {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 50%;
  color: var(--el-color-white);
  background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
  font-size: calc(var(--luma-font-size-base, 14px) - 2px);
}

.luma-admin-header-actions__divider {
  width: 1px;
  height: 20px;
  margin: 0 4px;
  background: var(--el-border-color-lighter);
}

.luma-admin-header-actions__mobile-menu {
  display: none;
}

.luma-admin-header-actions__mobile-trigger {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: var(--luma-radius-small);
  background: transparent;
  cursor: pointer;
  transition:
    color var(--luma-motion-duration-fast) var(--luma-easing-standard),
    background-color var(--luma-motion-duration-fast) var(--luma-easing-standard);
}

.luma-admin-header-actions__mobile-trigger:hover {
  background: var(--el-fill-color-light);
}

.luma-admin-header-actions__mobile-trigger:focus-visible {
  outline: 2px solid var(--el-color-primary);
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .luma-admin-header-actions {
    gap: 2px;
  }

  .luma-admin-header-actions__desktop-only {
    display: none;
  }

  .luma-admin-header-actions__mobile-menu {
    display: inline-flex;
  }

  .luma-admin-header-actions :deep(.el-button) {
    width: 36px;
    height: 36px;
  }
}

:global(.luma-admin-header-actions__mobile-dropdown .luma-admin-header-actions__mobile-danger) {
  color: var(--el-color-danger);
}

:global(.luma-admin-header-actions__mobile-dropdown .luma-admin-header-actions__mobile-danger:hover:not(.is-disabled)) {
  color: var(--el-color-danger);
  background: var(--el-color-danger-light-9);
}
</style>
