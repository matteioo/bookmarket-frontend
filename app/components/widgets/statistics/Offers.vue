<template>
  <WidgetsTemplate color="emerald">
    <div class="flex flex-col gap-2">
      <div class="flex flex-row justify-between items-center">
        <div class="inline-flex gap-2 font-semibold">
          <h2 class="text-neutral-700 dark:text-neutral-300">Angebote</h2>
          <span class="text-neutral-600 dark:text-neutral-400 cursor-default">&middot;</span>
          <h3 class="text-neutral-600 dark:text-neutral-400 uppercase cursor-default">heute</h3>
        </div>
        <UButton icon="i-lucide-plus" size="sm" color="neutral" variant="subtle" to="/fv/offers/create" />
      </div>
      <div class="inline-flex items-baseline gap-2">
        <span class="text-4xl text-neutral-900 dark:text-neutral-100 font-semibold tracking-tight">592</span>
        <span class="text-2xl text-neutral-800 dark:text-neutral-200 font-medium tracking-wide">(+19)</span>
      </div>
    </div>
  </WidgetsTemplate>
</template>