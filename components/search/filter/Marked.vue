<template>
  <div>
    <UButton
      :label="`Zustand: ${filterActive ? 'unbeschriftet' : 'egal'}`"
      :icon="filterActive ? 'i-heroicons-sparkles-16-solid' : 'i-heroicons-paint-brush-16-solid'"
      size="xs"
      :variant="filterActive ? 'outline' : 'solid'"
      :color="filterActive ? 'primary' : 'gray'"
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