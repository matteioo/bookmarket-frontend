<template>
  <div class="group relative gradient-container rounded-lg z-20 bg-neutral-200 dark:bg-neutral-800">
    <div 
      class="absolute inset-0 w-full h-full opacity-0 gradient-border -z-1 rounded-lg group-hover:opacity-100 group-hover:transition-all group-hover:ease-linear"
      :class="gradientBorderClass"
    />
    <div class="w-full h-full p-px">
      <div class="z-1 h-full p-4 rounded-lg bg-white dark:bg-neutral-900">
        <UIcon v-if="icon" :name="icon" class="absolute top-4 right-4 w-6 h-6 text-neutral-400 transition-colors" :class="iconColorClass" />
        <slot />
      </div>
      <!-- <div 
        class="group-hover:opacity-20 absolute inset-0 w-full bg-linear-to-bl to-transparent to-25% rounded-lg opacity-0 transition-opacity duration-300"
        :class="overlayClass"
      /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  color?: 'yellow' | 'sky' | 'emerald'
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'yellow',
  icon: undefined
})

// Define all possible Tailwind classes to prevent purging
const colorClasses = {
  yellow: {
    overlay: 'from-yellow-400/75',
    gradientBorder: 'gradient-border-yellow',
    iconColor: 'group-hover:text-yellow-700 dark:group-hover:text-yellow-200',
  },
  sky: {
    overlay: 'from-sky-400/75',
    gradientBorder: 'gradient-border-sky',
    iconColor: 'group-hover:text-sky-700 dark:group-hover:text-sky-200',
  },
  emerald: {
    overlay: 'from-emerald-400/75',
    gradientBorder: 'gradient-border-emerald',
    iconColor: 'group-hover:text-emerald-700 dark:group-hover:text-emerald-200',
  },
}

// const overlayClass = computed(() => colorClasses[props.color].overlay)
const gradientBorderClass = computed(() => colorClasses[props.color].gradientBorder)
const iconColorClass = computed(() => colorClasses[props.color].iconColor)
</script>

<style lang="css" scoped>
.gradient-border-yellow {
  background: linear-gradient(var(--gradient-angle), var(--color-yellow-400), var(--color-yellow-400), var(--color-neutral-200), var(--color-yellow-400));
}
.gradient-border-sky {
  background: linear-gradient(var(--gradient-angle), var(--color-sky-400), var(--color-sky-400), var(--color-neutral-200), var(--color-sky-400));
}
.gradient-border-emerald {
  background: linear-gradient(var(--gradient-angle), var(--color-emerald-400), var(--color-emerald-400), var(--color-neutral-200), var(--color-emerald-400));
}

@media (prefers-color-scheme: dark) {
  .gradient-border-yellow {
    background: linear-gradient(var(--gradient-angle), var(--color-yellow-400), var(--color-yellow-700), var(--color-neutral-800), var(--color-yellow-400));
  }
    .gradient-border-sky {
      background: linear-gradient(var(--gradient-angle), var(--color-sky-400), var(--color-sky-700), var(--color-neutral-800), var(--color-sky-400));
  }
  .gradient-border-emerald {
    background: linear-gradient(var(--gradient-angle), var(--color-emerald-400), var(--color-emerald-700), var(--color-neutral-800), var(--color-emerald-400));
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