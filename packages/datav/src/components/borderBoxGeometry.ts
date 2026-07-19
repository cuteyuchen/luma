let borderBoxInstance = 0

export function createBorderBoxInstanceId(vueId: string): string {
  borderBoxInstance += 1
  return `lumal-border-box-${vueId.replace(/[^\w-]/g, '')}-${borderBoxInstance}`
}
