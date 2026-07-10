import { defineComponent } from 'vue'

/***********************Admin Element Plus 测试替身*********************/
export const elementPlusStubs = {
  ElButton: defineComponent({
    name: 'ElButton',
    props: {
      disabled: Boolean,
      loading: Boolean,
      nativeType: String,
      type: String,
    },
    template: `
      <button
        class="el-button"
        :disabled="disabled || loading"
        :type="nativeType || 'button'"
        v-bind="$attrs"
      >
        <slot />
      </button>
    `,
  }),
  ElForm: defineComponent({
    name: 'ElForm',
    props: {
      labelPosition: String,
      model: Object,
    },
    methods: {
      async validate() {
        return true
      },
    },
    template: '<form class="el-form" v-bind="$attrs" @submit.prevent="$emit(\'submit\', $event)"><slot /></form>',
  }),
  ElFormItem: defineComponent({
    name: 'ElFormItem',
    props: {
      label: String,
      prop: String,
    },
    template: '<label class="el-form-item" :data-field="prop"><span>{{ label }}</span><slot /></label>',
  }),
  ElInput: defineComponent({
    name: 'ElInput',
    props: {
      disabled: Boolean,
      modelValue: [String, Number],
      name: String,
      type: String,
    },
    emits: ['update:modelValue'],
    template: `
      <input
        class="el-input__inner"
        :disabled="disabled"
        :name="name"
        :type="type || 'text'"
        :value="modelValue ?? ''"
        v-bind="$attrs"
        @input="$emit('update:modelValue', $event.target.value)"
      >
    `,
  }),
  ElOption: defineComponent({
    name: 'ElOption',
    props: {
      disabled: Boolean,
      label: String,
      value: [String, Number],
    },
    template: '<option :disabled="disabled" :value="value">{{ label }}</option>',
  }),
  ElSelect: defineComponent({
    name: 'ElSelect',
    props: {
      disabled: Boolean,
      modelValue: [String, Number],
      name: String,
    },
    emits: ['update:modelValue'],
    template: `
      <select
        class="el-select"
        :disabled="disabled"
        :name="name"
        :value="modelValue ?? ''"
        v-bind="$attrs"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <slot />
      </select>
    `,
  }),
}
