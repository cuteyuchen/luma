import { shallowRef } from 'vue'

export const adminSettingsVisible = shallowRef(false)

export function openAdminSettings(): void {
  adminSettingsVisible.value = true
}

export function closeAdminSettings(): void {
  adminSettingsVisible.value = false
}
