<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { LumaLayoutTabItem } from './types'
import { LumaIcon } from '@luma/icons'
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'

type TabContextAction = 'close' | 'close-all' | 'close-left' | 'close-others' | 'close-right' | 'refresh'

/***********************属性定义*********************/
const props = withDefaults(defineProps<{
  activePath?: string
  fullscreenTarget?: string
  showIcon?: boolean
  showMaximize?: boolean
  tabs?: LumaLayoutTabItem[]
  visible?: boolean
}>(), {
  activePath: '',
  fullscreenTarget: '[data-layout-fullscreen-target]',
  showIcon: true,
  showMaximize: true,
  tabs: () => [],
  visible: true,
})

const emit = defineEmits<{
  change: [path: string]
  closeAll: []
  closeLeft: [path: string]
  closeOthers: [path: string]
  closeRight: [path: string]
  refresh: [path: string]
  remove: [path: string]
}>()

const activePath = defineModel<string>('activePath', { default: '' })

/***********************本地状态*********************/
const tabsViewportRef = useTemplateRef<HTMLElement>('tabsViewportRef')
const contextMenuVisible = shallowRef(false)
const contextMenuPath = shallowRef('')
const contextMenuStyle = shallowRef<CSSProperties>({})
const isFullscreen = shallowRef(false)
const showScrollButtons = shallowRef(false)
const scrollIsAtLeft = shallowRef(true)
const scrollIsAtRight = shallowRef(false)
let resizeObserver: ResizeObserver | undefined

const canCloseAny = computed(() => props.tabs.some(tab => tab.closable !== false))

/***********************标签约束*********************/
function canCloseTab(path: string): boolean {
  return props.tabs.length > 1
    && props.tabs.some(tab => tab.path === path && tab.closable !== false)
}

function canCloseInDirection(path: string, direction: 'left' | 'right'): boolean {
  const index = props.tabs.findIndex(tab => tab.path === path)
  const candidates = direction === 'left' ? props.tabs.slice(0, index) : props.tabs.slice(index + 1)
  return candidates.some(tab => tab.closable !== false)
}

function isContextActionDisabled(action: TabContextAction): boolean {
  const path = contextMenuPath.value

  if (action === 'close') {
    return !canCloseTab(path)
  }
  if (action === 'close-left' || action === 'close-right') {
    return !canCloseInDirection(path, action === 'close-left' ? 'left' : 'right')
  }
  if (action === 'close-others') {
    return !props.tabs.some(tab => tab.path !== path && tab.closable !== false)
  }
  if (action === 'close-all') {
    return !canCloseAny.value
  }
  return false
}

/***********************标签交互*********************/
function activateTab(path: string): void {
  activePath.value = path
  emit('change', path)
}

function closeTab(path: string): void {
  if (canCloseTab(path)) {
    emit('remove', path)
  }
}

function handleTabMouseDown(event: MouseEvent, tab: LumaLayoutTabItem): void {
  if (event.button !== 1 || !canCloseTab(tab.path)) {
    return
  }

  event.preventDefault()
  emit('remove', tab.path)
}

function handleTabKeydown(event: KeyboardEvent, index: number): void {
  const supportedKeys = ['ArrowLeft', 'ArrowRight', 'End', 'Home']
  if (!supportedKeys.includes(event.key) || props.tabs.length === 0) {
    return
  }

  event.preventDefault()
  const nextIndex = event.key === 'Home'
    ? 0
    : event.key === 'End'
      ? props.tabs.length - 1
      : event.key === 'ArrowLeft'
        ? (index - 1 + props.tabs.length) % props.tabs.length
        : (index + 1) % props.tabs.length
  const nextTab = props.tabs[nextIndex]

  if (!nextTab) {
    return
  }

  activateTab(nextTab.path)
  void nextTick(() => {
    tabsViewportRef.value
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      .item(nextIndex)
      .focus()
  })
}

/***********************右键菜单*********************/
function openContextMenu(event: MouseEvent, path: string): void {
  event.preventDefault()
  const width = 168
  const height = 240
  contextMenuPath.value = path
  contextMenuStyle.value = {
    left: `${Math.max(8, Math.min(event.clientX, window.innerWidth - width - 8))}px`,
    top: `${Math.max(8, Math.min(event.clientY, window.innerHeight - height - 8))}px`,
  }
  contextMenuVisible.value = true
}

function closeContextMenu(): void {
  contextMenuVisible.value = false
}

function handleContextAction(action: TabContextAction): void {
  if (isContextActionDisabled(action)) {
    return
  }

  const path = contextMenuPath.value
  closeContextMenu()

  if (action === 'close')
    emit('remove', path)
  else if (action === 'close-left')
    emit('closeLeft', path)
  else if (action === 'close-right')
    emit('closeRight', path)
  else if (action === 'close-others')
    emit('closeOthers', path)
  else if (action === 'close-all')
    emit('closeAll')
  else emit('refresh', path)
}

/***********************滚动状态*********************/
function syncScrollState(): void {
  const viewport = tabsViewportRef.value
  if (!viewport) {
    return
  }

  showScrollButtons.value = viewport.scrollWidth > viewport.clientWidth + 1
  scrollIsAtLeft.value = viewport.scrollLeft <= 1
  scrollIsAtRight.value = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 1
}

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

function scrollTabs(direction: 'left' | 'right'): void {
  const viewport = tabsViewportRef.value
  if (!viewport) {
    return
  }

  viewport.scrollBy({
    behavior: scrollBehavior(),
    left: (direction === 'left' ? -1 : 1) * Math.max(160, viewport.clientWidth - 120),
  })
}

function handleWheel(event: WheelEvent): void {
  const viewport = tabsViewportRef.value
  if (!viewport || !showScrollButtons.value) {
    return
  }

  event.preventDefault()
  viewport.scrollBy({
    left: Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX,
  })
}

async function scrollActiveTabIntoView(): Promise<void> {
  await nextTick()
  const activeTab = tabsViewportRef.value?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
  activeTab?.scrollIntoView({
    behavior: scrollBehavior(),
    block: 'nearest',
    inline: 'nearest',
  })
  syncScrollState()
}

/***********************最大化*********************/
function syncFullscreenState(): void {
  isFullscreen.value = Boolean(document.fullscreenElement)
}

async function toggleFullscreen(): Promise<void> {
  const target = document.querySelector(props.fullscreenTarget)
  if (!(target instanceof HTMLElement)) {
    return
  }

  if (document.fullscreenElement) {
    await document.exitFullscreen?.()
  }
  else {
    await target.requestFullscreen?.()
  }
}

watch(
  () => [props.activePath, props.tabs.length],
  () => void scrollActiveTabIntoView(),
  { flush: 'post' },
)

onMounted(() => {
  document.addEventListener('click', closeContextMenu)
  document.addEventListener('fullscreenchange', syncFullscreenState)
  syncScrollState()

  if (typeof ResizeObserver !== 'undefined' && tabsViewportRef.value) {
    resizeObserver = new ResizeObserver(syncScrollState)
    resizeObserver.observe(tabsViewportRef.value)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeContextMenu)
  document.removeEventListener('fullscreenchange', syncFullscreenState)
  resizeObserver?.disconnect()
})

defineExpose({
  getTabsElement: () => tabsViewportRef.value,
  scrollTabs,
  toggleFullscreen,
})
</script>

<template>
  <div v-if="visible && tabs.length" class="luma-tabs">
    <button
      v-show="showScrollButtons"
      class="luma-tabs__tool"
      type="button"
      aria-label="向左滚动标签"
      :disabled="scrollIsAtLeft"
      @click="scrollTabs('left')"
    >
      <span aria-hidden="true">‹</span>
    </button>

    <div
      ref="tabsViewportRef"
      class="luma-tabs__viewport"
      @scroll="syncScrollState"
      @wheel="handleWheel"
    >
      <div class="luma-tabs__list" role="tablist" aria-label="页面标签">
        <div
          v-for="(tab, index) in tabs"
          :key="tab.path"
          class="luma-tabs__item"
          :class="{ 'is-active': tab.path === activePath }"
          @contextmenu="openContextMenu($event, tab.path)"
        >
          <button
            class="luma-tabs__tab"
            type="button"
            role="tab"
            :aria-selected="tab.path === activePath"
            :tabindex="tab.path === activePath ? 0 : -1"
            @click="activateTab(tab.path)"
            @keydown="handleTabKeydown($event, index)"
            @mousedown="handleTabMouseDown($event, tab)"
          >
            <LumaIcon v-if="showIcon && tab.icon" :name="tab.icon" :size="14" />
            <span class="luma-tabs__label" :title="tab.title">{{ tab.title }}</span>
          </button>
          <button
            v-if="canCloseTab(tab.path)"
            class="luma-tabs__close"
            type="button"
            :aria-label="`关闭${tab.title}`"
            @click="closeTab(tab.path)"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      </div>
    </div>

    <button
      v-show="showScrollButtons"
      class="luma-tabs__tool"
      type="button"
      aria-label="向右滚动标签"
      :disabled="scrollIsAtRight"
      @click="scrollTabs('right')"
    >
      <span aria-hidden="true">›</span>
    </button>

    <button
      v-if="showMaximize"
      class="luma-tabs__tool"
      type="button"
      :aria-label="isFullscreen ? '退出内容最大化' : '内容最大化'"
      @click="toggleFullscreen"
    >
      <span aria-hidden="true">{{ isFullscreen ? '↙' : '⛶' }}</span>
    </button>

    <Teleport to="body">
      <div
        v-if="contextMenuVisible"
        class="luma-tabs-context-menu"
        role="menu"
        :style="contextMenuStyle"
        @click.stop
      >
        <button type="button" role="menuitem" @click="handleContextAction('refresh')">
          刷新当前页
        </button>
        <span class="luma-tabs-context-menu__divider" />
        <button type="button" role="menuitem" :disabled="isContextActionDisabled('close')" @click="handleContextAction('close')">
          关闭当前
        </button>
        <button type="button" role="menuitem" :disabled="isContextActionDisabled('close-left')" @click="handleContextAction('close-left')">
          关闭左侧
        </button>
        <button type="button" role="menuitem" :disabled="isContextActionDisabled('close-right')" @click="handleContextAction('close-right')">
          关闭右侧
        </button>
        <button type="button" role="menuitem" :disabled="isContextActionDisabled('close-others')" @click="handleContextAction('close-others')">
          关闭其他
        </button>
        <button type="button" role="menuitem" :disabled="isContextActionDisabled('close-all')" @click="handleContextAction('close-all')">
          关闭全部
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.luma-tabs {
  display: flex;
  flex: 0 0 auto;
  width: 100%;
  min-width: 0;
  height: var(--luma-tabbar-height);
  border-bottom: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
}

.luma-tabs__viewport {
  flex: 1 1 auto;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
}

.luma-tabs__viewport::-webkit-scrollbar {
  display: none;
}

.luma-tabs__list {
  display: flex;
  width: max-content;
  min-width: 100%;
  height: 100%;
  align-items: stretch;
  gap: 4px;
  padding: 4px 8px 0;
  box-sizing: border-box;
}

.luma-tabs__item {
  position: relative;
  display: flex;
  min-width: 96px;
  max-width: min(240px, 32vw);
  align-items: center;
  border-radius: var(--luma-radius-small) var(--luma-radius-small) 0 0;
  color: var(--el-text-color-regular);
  transition:
    color var(--luma-motion-duration-fast) var(--luma-easing-standard),
    background-color var(--luma-motion-duration-fast) var(--luma-easing-standard);
}

.luma-tabs__item:hover {
  background: var(--el-fill-color-light);
}

.luma-tabs__item.is-active {
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
}

.luma-tabs__tab {
  display: flex;
  flex: 1 1 auto;
  min-width: 0;
  height: 100%;
  align-items: center;
  gap: 6px;
  padding: 0 28px 0 12px;
  border: 0;
  color: inherit;
  background: transparent;
  cursor: pointer;
}

.luma-tabs__tab:focus-visible,
.luma-tabs__tool:focus-visible,
.luma-tabs__close:focus-visible {
  outline: 2px solid var(--el-color-primary);
  outline-offset: -2px;
}

.luma-tabs__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.luma-tabs__close {
  position: absolute;
  right: 7px;
  display: grid;
  width: 18px;
  height: 18px;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  color: var(--el-text-color-secondary);
  background: transparent;
  cursor: pointer;
}

.luma-tabs__close:hover {
  color: var(--el-text-color-primary);
  background: var(--el-fill-color);
}

.luma-tabs__tool {
  display: grid;
  flex: 0 0 36px;
  width: 36px;
  height: 100%;
  place-items: center;
  padding: 0;
  border: 0;
  border-left: 1px solid var(--el-border-color-lighter);
  color: var(--el-text-color-secondary);
  background: transparent;
  cursor: pointer;
}

.luma-tabs__tool:hover:not(:disabled) {
  color: var(--el-text-color-primary);
  background: var(--el-fill-color-light);
}

.luma-tabs__tool:disabled {
  cursor: default;
  opacity: 0.35;
}

@media (prefers-reduced-motion: reduce) {
  .luma-tabs__item {
    transition: none;
  }
}
</style>

<style lang="scss">
.luma-tabs-context-menu {
  position: fixed;
  z-index: var(--luma-z-context-menu);
  display: grid;
  min-width: 160px;
  padding: 4px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: var(--luma-radius-base);
  background: var(--el-bg-color-overlay);
  box-shadow: var(--luma-shadow-base);
}

.luma-tabs-context-menu button {
  padding: 8px 12px;
  border: 0;
  border-radius: var(--luma-radius-small);
  color: var(--el-text-color-regular);
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.luma-tabs-context-menu button:hover:not(:disabled) {
  color: var(--el-text-color-primary);
  background: var(--el-fill-color-light);
}

.luma-tabs-context-menu button:disabled {
  color: var(--el-text-color-placeholder);
  cursor: not-allowed;
}

.luma-tabs-context-menu__divider {
  height: 1px;
  margin: 4px 6px;
  background: var(--el-border-color-lighter);
}
</style>
