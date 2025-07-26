<template>
  <div class="group relative gradient-container rounded-lg z-20 bg-neutral-200 dark:bg-neutral-800">
    <div 
      class="absolute inset-0 w-full h-full opacity-0 gradient-border -z-1 rounded-lg group-hover:opacity-100 group-hover:transition-all group-hover:duration-300 group-hover:ease-linear"
      :class="gradientBorderClass"
    />
    <div class="w-full h-full p-px">
      <div class="z-1 h-full p-4 rounded-lg bg-white dark:bg-neutral-900">
        <slot />
      </div>
      <div 
        class="group-hover:opacity-20 absolute inset-0 w-full bg-linear-to-bl to-transparent to-25% rounded-lg opacity-0 transition-opacity duration-300"
        :class="overlayClass"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  color?: 'yellow' | 'sky'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'yellow'
})

// Define all possible Tailwind classes to prevent purging
const colorClasses = {
  yellow: {
    overlay: 'from-yellow-400/75',
    gradientBorder: 'gradient-border-yellow'
  },
  sky: {
    overlay: 'from-sky-400/75',
    gradientBorder: 'gradient-border-sky'
  },
}

const overlayClass = computed(() => colorClasses[props.color].overlay)
const gradientBorderClass = computed(() => colorClasses[props.color].gradientBorder)
</script>

<style lang="css" scoped>
.gradient-border-yellow {
  background: linear-gradient(var(--gradient-angle), var(--color-yellow-400), var(--color-yellow-400), rgb(255 255 255 / 0.8), var(--color-yellow-400));
}
.gradient-border-sky {
  background: linear-gradient(var(--gradient-angle), var(--color-sky-400), var(--color-sky-400), rgb(255 255 255 / 0.8), var(--color-sky-400));
}

@media (prefers-color-scheme: dark) {
  .gradient-border-yellow {
    background: linear-gradient(var(--gradient-angle), var(--color-yellow-400), var(--color-yellow-700), rgb(255 255 255 / 0.3), var(--color-yellow-400));
  }
  .gradient-border-sky {
    background: linear-gradient(var(--gradient-angle), var(--color-sky-400), var(--color-sky-700), rgb(255 255 255 / 0.3), var(--color-sky-400));
  }
}

.gradient-container:hover > .gradient-border {
  animation: gradient-rotate 10s cubic-bezier(0,0,1,1) 0s infinite reverse;
}

@property --gradient-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 180deg;
}

@keyframes gradient-rotate {
  0% {
    --gradient-angle: 0deg;
  }

  100% {
    --gradient-angle: 360deg;
  }
}
</style>