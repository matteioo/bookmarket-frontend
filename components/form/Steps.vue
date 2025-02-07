<template>
  <ul class="split-evenly w-full inline-flex flex-row gap-x-4">
    <li
      v-for="(step, index) in steps"
      :key="index" :class="
        {
          'border-yellow-500 dark:border-yellow-400': index === active - 1,
          'border-green-500 dark:border-green-400': index < active,
          'border-gray-300 dark:border-gray-700': index >= active
        }"
      class="flex-grow pt-2 px-1 pb-1 border-t-4 rounded-b hover:bg-white dark:hover:bg-gray-900 cursor-pointer" @click="handleClick(step)">
      <div class="text-sm text-gray-600 dark:text-gray-400">Schritt {{ index + 1 }}</div>
      <div class="text-sm text-gray-800 dark:text-gray-200 font-medium">{{ step.title }}</div>
    </li>
  </ul>
</template>

<script setup lang="ts">
interface Step {
  step: number
  title: string
}

const _props = defineProps({
  steps: {
    type: Array as () => Step[],
    required: true,
    validator: (steps: Step[]) => steps.every(step => 'step' in step && 'title' in step)
  },
  active: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['step-clicked'])

const handleClick = (step: Step) => {
  emit('step-clicked', step.step)
}
</script>

<style scoped>
.split-evenly {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr))
  }
</style>