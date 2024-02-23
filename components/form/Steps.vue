<template>
  <ul class="inline-flex flex-row gap-x-4">
    <li v-for="(step, index) in steps" :key="index" @click="handleClick(step)" class="pt-2 px-1 pb-1 border-t-4 border-primary-800 rounded-b hover:bg-white dark:hover:bg-gray-900 cursor-pointer">
      <div class="text-sm text-gray-600 dark:text-gray-400">Schritt {{ index + 1 }}</div>
      <div class="text-sm text-gray-800 dark:text-gray-200 font-medium">{{ step.title }}</div>
    </li>
  </ul>
</template>

<script setup lang="ts">
interface Step {
  step: number;
  title: string;
}

const props = defineProps({
  steps: {
    type: Array as () => Step[],
    required: true,
    validator: (steps: Step[]) => steps.every(step => 'step' in step && 'title' in step)
  }
});

const emit = defineEmits(['step-clicked']);

const handleClick = (step: Step) => {
  emit('step-clicked', step.step);
};
</script>