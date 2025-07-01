<template>
  <div>
    <UButton
      :label="`Zustand: ${filterActive ? 'unbeschriftet' : 'egal'}`"
      :icon="filterActive ? 'i-heroicons-sparkles-16-solid' : 'i-heroicons-paint-brush-16-solid'"
      size="xs"
      :variant="filterActive ? 'subtle' : 'outline'"
      :color="filterActive ? 'primary' : 'neutral'"
      @click="toggleFilter"
    />
  </div>
</template>

<script setup lang="ts">
const model = defineModel<boolean>()
const filterActive = computed(() => !model.value)

const toggleFilter = () => {
  model.value = !model.value
}
</script>