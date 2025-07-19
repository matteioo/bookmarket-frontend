<template>
  <div class="w-full">
    <UInput ref="inputRef" :required="props.required" :size="(props.size as InputSize)" :placeholder="props.placeholder" />
  </div>
</template>


<script setup lang="ts">
type InputSize = 'xs' | 'md'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  minPrice: {
    type: Number,
    default: 0,
  },
  maxPrice: {
    type: Number,
    default: 999.99,
  },
  size: {
    type: String as PropType<InputSize>,
    default: 'md',
  },
  required: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    required: false,
    default: '',
  }
})

const { inputRef, numberValue } = useEuroCurrencyInput({ valueRange: { min: props.minPrice, max: props.maxPrice }})

const emit = defineEmits(['update:modelValue'])

watch (numberValue, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>