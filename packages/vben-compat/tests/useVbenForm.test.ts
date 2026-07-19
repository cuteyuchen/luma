import { describe, expect, it } from 'vitest'
import { shallowRef } from 'vue'
import { adaptVbenFormSchemas, useVbenForm } from '../src'

describe('useVbenForm', () => {
  it('会把常见 Vben 表单 schema 适配为 LumalSchemaForm schema', () => {
    const schemas = adaptVbenFormSchemas([
      {
        component: 'Input',
        componentProps: {
          disabled: true,
          placeholder: '请输入名称',
        },
        defaultValue: 'Lumal',
        fieldName: 'name',
        label: '名称',
        required: true,
      },
      {
        component: 'Select',
        componentProps: {
          options: [
            { label: '启用', value: 'enabled' },
            { label: '停用', value: 'disabled', disabled: true },
          ],
          placeholder: '请选择状态',
        },
        fieldName: 'status',
        label: '状态',
      },
      {
        component: 'Input.TextArea',
        fieldName: 'remark',
        label: '备注',
      },
      {
        component: 'Input',
        fieldName: 'internal',
        ifShow: false,
        label: '内部字段',
      },
    ])

    expect(schemas).toEqual([
      {
        component: 'input',
        defaultValue: 'Lumal',
        field: 'name',
        label: '名称',
        placeholder: '请输入名称',
        componentProps: {
          disabled: true,
        },
        required: true,
      },
      {
        component: 'select',
        field: 'status',
        label: '状态',
        options: [
          { label: '启用', value: 'enabled' },
          { label: '停用', value: 'disabled', disabled: true },
        ],
        placeholder: '请选择状态',
        componentProps: {},
      },
      {
        component: 'textarea',
        field: 'remark',
        label: '备注',
        componentProps: {},
      },
      {
        component: 'input',
        field: 'internal',
        hidden: true,
        label: '内部字段',
        componentProps: {},
      },
    ])
  })

  it('会提供 Vben 风格 register 和表单方法，并生成 LumalSchemaForm props', () => {
    const [register, formApi] = useVbenForm({
      model: {
        name: '旧名称',
      },
      schemas: [
        {
          component: 'Input',
          fieldName: 'name',
          label: '名称',
        },
        {
          component: 'Select',
          defaultValue: 'enabled',
          fieldName: 'status',
          label: '状态',
        },
      ],
      showActions: true,
      submitText: '查询',
    })

    const formInstance = { validate: () => true }
    register(formInstance)

    expect(formApi.getFormInstance()).toBe(formInstance)
    expect(formApi.schemaFormProps.value.schemas.map(item => item.field)).toEqual(['name', 'status'])
    expect(formApi.schemaFormProps.value.showActions).toBe(true)
    expect(formApi.schemaFormProps.value.submitText).toBe('查询')
    expect(formApi.getFieldsValue()).toEqual({
      name: '旧名称',
      status: 'enabled',
    })

    formApi.setFieldsValue({
      name: '新名称',
    })
    formApi.handleUpdateModel({
      name: '新名称',
      status: 'disabled',
    })

    expect(formApi.getFieldsValue()).toEqual({
      name: '新名称',
      status: 'disabled',
    })

    formApi.resetFields()

    expect(formApi.getFieldsValue()).toEqual({
      name: '旧名称',
      status: 'enabled',
    })
  })

  it('支持响应式 options 更新 schema', () => {
    const options = shallowRef({
      schemas: [
        {
          component: 'Input',
          fieldName: 'keyword',
          label: '关键词',
        },
      ],
    })

    const [, formApi] = useVbenForm(options)

    expect(formApi.schemaFormProps.value.schemas[0]?.field).toBe('keyword')

    options.value = {
      schemas: [
        {
          component: 'Input',
          fieldName: 'name',
          label: '名称',
        },
      ],
    }

    expect(formApi.schemaFormProps.value.schemas[0]?.field).toBe('name')
  })

  it('同步常用数字、选择、日期和状态控件', () => {
    const schemas = adaptVbenFormSchemas([
      { component: 'InputNumber', fieldName: 'count', label: '数量' },
      { component: 'Switch', fieldName: 'enabled', label: '启用' },
      { component: 'DatePicker', componentProps: { type: 'datetime' }, fieldName: 'createdAt', label: '创建时间' },
      { component: 'DatePicker.RangePicker', fieldName: 'range', label: '日期范围' },
      { component: 'RadioGroup', fieldName: 'role', label: '角色' },
      { component: 'CheckboxGroup', fieldName: 'permissions', label: '权限' },
      { component: 'TreeSelect', fieldName: 'parentId', label: '上级' },
      { component: 'Input.Password', fieldName: 'password', label: '密码' },
    ])

    expect(schemas.map(schema => schema.component)).toEqual([
      'number',
      'switch',
      'datetime',
      'daterange',
      'radio',
      'checkbox',
      'tree-select',
      'input',
    ])
    expect(schemas.at(-1)?.componentProps).toMatchObject({ type: 'password' })
  })
})
