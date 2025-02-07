<template>
  <div>
    <UButton
      :label="`Verkaufte ${filterActive ? 'ausblenden' : 'anzeigen'}`"
      :icon="filterActive ? 'i-heroicons-eye-slash-16-solid' : 'i-heroicons-eye-16-solid'"
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