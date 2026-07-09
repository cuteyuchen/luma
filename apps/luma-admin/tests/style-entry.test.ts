import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/***********************样式入口*********************/
describe('luma admin style entry', () => {
  it('会显式导入 Luma 组件样式和主题样式', async () => {
    const mainTs = await readFile(join(process.cwd(), 'src/main.ts'), 'utf8')

    expect(mainTs).toContain('import \'@luma/core/theme-chalk/index.scss\'')
    expect(mainTs).toContain('import \'@luma/core/style.css\'')
    expect(mainTs).toContain('import \'@luma/icons/style.css\'')
    expect(mainTs).toContain('import \'./styles.scss\'')
  })
})
