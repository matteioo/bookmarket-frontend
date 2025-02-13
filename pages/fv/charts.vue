<template>
  <div>
    <VisXYContainer
      :data="data"
      :padding="{ top: 10 }"
      class="h-96"
    >
      <VisLine
        :x="x"
        :y="y"
        color="rgb(var(--color-primary-DEFAULT))"
      />
      <VisArea
        :x="x"
        :y="y"
        color="rgb(var(--color-primary-DEFAULT))"
        :opacity="0.1"
      />

      <VisAxis
        type="x"
        :x="x"
      />

      <VisCrosshair
        color="rgb(var(--color-primary-DEFAULT))"
      />

      <VisTooltip />
    </VisXYContainer>


    <VisXYContainer :data="data">
      <VisStackedBar :x="x" :y="y" />
    </VisXYContainer>
  </div>
</template>

<script setup lang="ts">
import { VisXYContainer, VisLine, VisAxis, VisCrosshair, VisArea, VisTooltip, VisStackedBar } from '@unovis/vue'

definePageMeta({
  layout: 'protected',
})

type DataRecord = { x: number, y: number }
const data = ref<DataRecord[]>([
  { x: 0, y: 0 },
  { x: 1, y: 2 },
  { x: 2, y: 1 },
  { x: 3, y: 9 },
  { x: 4, y: 5 },
  { x: 5, y: 1 },
  { x: 6, y: 4 },
  { x: 7, y: 0 },
  { x: 8, y: 10 },
])

const x = (d: DataRecord) =>  d.x
const y = [
    (d: DataRecord) =>  d.y,
  ]
</script>

<style scoped>
.unovis-xy-container {
  --vis-crosshair-line-stroke-color: rgb(var(--color-red-500));
  --vis-crosshair-circle-stroke-color: #fff;

  --vis-axis-grid-color: rgb(var(--color-gray-200));
  --vis-axis-tick-color: rgb(var(--color-gray-200));
  --vis-axis-tick-label-color: rgb(var(--color-gray-400));

  --vis-tooltip-background-color: #fff;
  --vis-tooltip-border-color: rgb(var(--color-gray-200));
  --vis-tooltip-text-color: rgb(var(--color-gray-900));
}

@media (prefers-color-scheme: dark) {
  .unovis-xy-container {
    --vis-crosshair-line-stroke-color: rgb(var(--color-red-400));
    --vis-crosshair-circle-stroke-color: rgb(var(--color-gray-900));

    --vis-axis-grid-color: rgb(var(--color-gray-800));
    --vis-axis-tick-color: rgb(var(--color-gray-800));
    --vis-axis-tick-label-color: rgb(var(--color-gray-500));

    --vis-tooltip-background-color: rgb(var(--color-gray-900));
    --vis-tooltip-border-color: rgb(var(--color-gray-800));
    --vis-tooltip-text-color: #fff;
  }
}
</style>
