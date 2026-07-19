import type { SchemaFormComponentType, SchemaFormItem, SchemaFormOption } from '@lumal/core/components'
import type { VbenFormComponentProps, VbenFormSchema } from '../types'

/***********************组件类型适配*********************/
function adaptVbenFormComponent(component: string | undefined): SchemaFormComponentType {
  const normalizedComponent = component?.replaceAll('.', '').replaceAll('-', '').toLowerCase() ?? 'input'

  if (normalizedComponent.includes('textarea')) {
    return 'textarea'
  }

  if (normalizedComponent.includes('inputnumber')) {
    return 'number'
  }

  if (normalizedComponent.includes('checkbox')) {
    return 'checkbox'
  }

  if (normalizedComponent.includes('radio')) {
    return 'radio'
  }

  if (normalizedComponent.includes('treeselect')) {
    return 'tree-select'
  }

  if (normalizedComponent.includes('switch')) {
    return 'switch'
  }

  if (normalizedComponent.includes('upload')) {
    return 'upload'
  }

  if (normalizedComponent.includes('rangepicker')) {
    return 'daterange'
  }

  if (normalizedComponent.includes('datepicker')) {
    return 'date'
  }

  if (normalizedComponent.includes('select')) {
    return 'select'
  }

  if (normalizedComponent.includes('hidden')) {
    return 'hidden'
  }

  return 'input'
}

/***********************属性适配*********************/
function adaptVbenComponentProps(componentProps: VbenFormComponentProps = {}): Record<string, unknown> {
  const {
    options: _options,
    placeholder: _placeholder,
    ...props
  } = componentProps

  return props
}

function resolveVbenComponentProps(schema: VbenFormSchema): Record<string, unknown> {
  const props = adaptVbenComponentProps(schema.componentProps)
  const normalizedComponent = schema.component?.toLowerCase()

  if (normalizedComponent === 'input.password' && props.type === undefined) {
    props.type = 'password'
  }

  return props
}

function resolveVbenDateComponent(schema: VbenFormSchema, component: SchemaFormComponentType): SchemaFormComponentType {
  if (component !== 'date') {
    return component
  }

  const type = schema.componentProps?.type?.toLowerCase()
  if (type === 'datetime') {
    return 'datetime'
  }
  if (type?.includes('range')) {
    return 'daterange'
  }

  return component
}

function adaptVbenOptions(componentProps: VbenFormComponentProps = {}): SchemaFormOption[] | undefined {
  return componentProps.options?.map(option => ({
    disabled: option.disabled,
    label: option.label,
    value: option.value,
  }))
}

/***********************显示和校验适配*********************/
function isVbenSchemaHidden(schema: VbenFormSchema): boolean {
  return Boolean(schema.hidden || schema.show === false || schema.ifShow === false)
}

function isVbenSchemaRequired(schema: VbenFormSchema): boolean | undefined {
  return schema.required ?? (schema.rules?.some(rule => rule.required) || undefined)
}

/***********************Schema 适配*********************/
export function adaptVbenFormSchema(schema: VbenFormSchema): SchemaFormItem {
  const field = schema.fieldName ?? schema.field ?? ''
  const componentProps = schema.componentProps ?? {}
  const component = resolveVbenDateComponent(schema, adaptVbenFormComponent(schema.component))

  return {
    component,
    defaultValue: schema.defaultValue,
    field,
    hidden: isVbenSchemaHidden(schema) || undefined,
    label: schema.label,
    options: adaptVbenOptions(componentProps),
    placeholder: componentProps.placeholder,
    componentProps: resolveVbenComponentProps(schema),
    required: isVbenSchemaRequired(schema),
  }
}

export function adaptVbenFormSchemas(schemas: VbenFormSchema[] = []): SchemaFormItem[] {
  return schemas.map(schema => adaptVbenFormSchema(schema))
}
