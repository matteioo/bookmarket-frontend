<template>
  <div v-if="props.bins && props.bins.length > 0" class="h-full w-full">
    <VisXYContainer :data="props.bins" class="h-full w-full">
      <VisStackedBar :x="x" :y="y" />
      <VisAxis type="x" :x="x" :tick-values="tickValues" :tick-format="tickFormat" />
      <VisAxis type="y" :y="y" />
      <VisTooltip :triggers="triggers" />
    </VisXYContainer>
  </div>
</template>

<script setup lang="ts">
import { VisXYContainer, VisStackedBar, VisAxis, VisTooltip } from '@unovis/vue'
import { StackedBar } from '@unovis/ts'
import type { PriceBin } from '~/interfaces/PriceBin';

const props = defineProps({
  bins: {
    type: Object as PropType<PriceBin[]>,
    required: true
  },
})

const x = (d: PriceBin) => d.binRange.min
const y = [
  (d: PriceBin) => d.count.active,
  (d: PriceBin) => d.count.inactive,
]

const tickValues = computed(() => props.bins?.map(bin => bin.binRange.max))

const tickFormat = (value: number, index: number) => {
  return index % 2 === 0 ? value : ''
}

const triggers = {
    [StackedBar.selectors.bar]: (d: PriceBin) =>  `Angebote für ${d.binRange.min} € bis ${d.binRange.max} €:<br>
      <ul class="list-disc pl-4">
        <li>Aktiv: ${d.count.active}</li>
        <li>Inaktiv: ${d.count.inactive}</li>
      </ul>`
  }
</script>

<style scoped>
.unovis-xy-container {
  --vis-crosshair-line-stroke-color: var(--color-red-500);
  --vis-crosshair-circle-stroke-color: #fff;

  --vis-axis-grid-color: var(--color-neutral-200);
  --vis-axis-tick-color: var(--color-neutral-200);
  --vis-axis-tick-label-color: var(--color-neutral-400);

  --vis-tooltip-background-color: #fff;
  --vis-tooltip-border-color: var(--color-neutral-200);
  --vis-tooltip-text-color: var(--color-neutral-900);
}

@media (prefers-color-scheme: dark) {
  .unovis-xy-container {
    --vis-crosshair-line-stroke-color: var(--color-red-400);
    --vis-crosshair-circle-stroke-color: var(--color-neutral-900);

    --vis-axis-grid-color: var(--color-neutral-800);
    --vis-axis-tick-color: var(--color-neutral-800);
    --vis-axis-tick-label-color: var(--color-neutral-500);

    --vis-tooltip-background-color: var(--color-neutral-900);
    --vis-tooltip-border-color: var(--color-neutral-800);
    --vis-tooltip-text-color: #fff;
  }
}
</style>
