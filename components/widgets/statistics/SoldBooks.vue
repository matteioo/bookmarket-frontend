<template>
  <div class="relative gradient-container rounded-lg z-20 bg-gray-200 dark:bg-gray-800">
    <div class="absolute inset-0 w-full h-full opacity-0 gradient-border gradient-border -z-[1] rounded-lg" />
    <div class="gradient-right absolute inset-0 w-full bg-gradient-to-bl to-transparent to-40% from-primary-400/75 rounded-lg opacity-0 transition-opacity duration-300" />
    <div class="w-full h-full p-[1px]">
      <div class="h-full flex flex-col gap-2 p-4 rounded-lg bg-white dark:bg-gray-900">
        <div class="flex flex-row gap-2 font-semibold">
          <h2 class="text-gray-700 dark:text-gray-300">Verkaufte Bücher</h2>
          <span class="text-gray-600 dark:text-gray-400 cursor-default">&middot;</span>
          <h3 class="text-gray-600 dark:text-gray-400 uppercase cursor-default">heute</h3>
        </div>
        <div class="inline-flex items-baseline gap-2">
          <span class="text-4xl text-gray-900 dark:text-gray-100 font-semibold tracking-tight">56</span>
          <span class="text-2xl text-gray-800 dark:text-gray-200 font-medium tracking-tight">(+4)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.gradient-border {
  background: linear-gradient(var(--gradient-angle), theme('colors.yellow.400'), theme('colors.yellow.400/0.6'), theme('colors.white/0.8'), theme('colors.yellow.400'));
}
@media (prefers-color-scheme: dark) {
  .gradient-border {
    background: linear-gradient(var(--gradient-angle), theme('colors.yellow.400'), theme('colors.yellow.700'), theme('colors.white/0.3'), theme('colors.yellow.400'));
  }
}

.gradient-container:hover > .gradient-border {
  animation: gradient-rotate 10s cubic-bezier(0,0,1,1) 0s infinite reverse;
  @apply opacity-100 transition-all duration-300 ease-linear;
}
.gradient-container:hover > .gradient-right {
  @apply opacity-20;
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
