<template>
  <div>
    <UButton
      :label="filterLabel"
      icon="i-heroicons-paint-brush-16-solid"
      size="xs"
      :variant="filterActive ? 'outline' : 'solid'"
      :color="filterActive ? 'primary' : 'gray'"
      @click="toggleFilter"
    />
  </div>
</template>

<script setup lang="ts">
const model = defineModel<boolean>();
const filterActive = computed(() => !model.value);
const filterLabel = computed(() => filterActive.value ? 'Markierte anzeigen' : 'Markierte ausblenden');

const toggleFilter = () => {
  model.value = !model.value;
}
</script>