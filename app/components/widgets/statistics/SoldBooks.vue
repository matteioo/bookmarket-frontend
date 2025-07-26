<template>
  <div class="group relative gradient-container rounded-lg z-20 bg-neutral-200 dark:bg-neutral-800">
    <div class="absolute inset-0 w-full h-full opacity-0 gradient-border gradient-border -z-1 rounded-lg group-hover:opacity-100 group-hover:transition-all group-hover:duration-300 group-hover:ease-linear" />
    <div class="group-hover:opacity-20 absolute inset-0 w-full bg-linear-to-bl to-transparent to-40% from-primary-400/75 rounded-lg opacity-0 transition-opacity duration-300" />
    <div class="w-full h-full p-px">
      <div class="h-full flex flex-col gap-2 p-4 rounded-lg bg-white dark:bg-neutral-900">
        <div class="flex flex-row gap-2 font-semibold">
          <h2 class="text-neutral-700 dark:text-neutral-300">Verkaufte Bücher</h2>
          <span class="text-neutral-600 dark:text-neutral-400 cursor-default">&middot;</span>
          <h3 class="text-neutral-600 dark:text-neutral-400 uppercase cursor-default">heute</h3>
        </div>
        <div class="inline-flex items-baseline gap-2">
          <span class="text-4xl text-neutral-900 dark:text-neutral-100 font-semibold tracking-tight">56</span>
          <span class="text-2xl text-neutral-800 dark:text-neutral-200 font-medium tracking-tight">(+4)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.gradient-border {
  background: linear-gradient(var(--gradient-angle), var(--color-yellow-400), var(--color-yellow-400), rgb(255 255 255 / 0.8), var(--color-yellow-400));
}
@media (prefers-color-scheme: dark) {
  .gradient-border {
    background: linear-gradient(var(--gradient-angle), var(--color-yellow-400), var(--color-yellow-700), rgb(255 255 255 / 0.3), var(--color-yellow-400));
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
