<template>
  <div>
    <UPopover v-model:open="popoverOpen">
      <UButton
        :label="priceLabel"
        icon="i-heroicons-banknotes-16-solid"
        size="xs"
        :variant="filterActive ? 'outline' : 'solid'"
        :color="filterActive ? 'primary' : 'gray'"
      />

      <template #panel>
        <UForm :state="state" class="space-y-4" @submit="onSubmit">
          <div class="p-4 flex flex-col gap-y-4">
            <div class="inline-flex flex-row gap-x-2 items-center">
              <UFormGroup class="w-24" name="minPrice">
                <FormInputPrice v-model="state.min" label="maxPrice" size="md" placeholder="Min." :min-price="0" :max-price="999.99" />
              </UFormGroup>
              <span>bis</span>
              <UFormGroup class="w-24" name="maxPrice">
                <FormInputPrice v-model="state.max" label="maxPrice" size="md" placeholder="Max." :min-price="0" :max-price="999.99" />
              </UFormGroup>
            </div>
            <div class="inline-flex flex-row-reverse gap-x-2 justify-stretch flex-wrap">
              <UButton
                type="submit"
                label="Speichern"
                color="primary"
                variant="outline"
                block
                class="flex-1"
              />

              <UButton
                label="Löschen"
                color="gray"
                block
                class="flex-1"
                @click="resetModal"
              />
            </div>
          </div>
        </UForm>
      </template>
    </UPopover>
  </div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import type { Filter, PriceFilter } from '~/interfaces/SearchFilters'

const props = defineProps({
  priceFilter: {
    type: Object as PropType<{
      active: boolean
      value: {
        min: number | undefined
        max: number | undefined
      }
    }>,
    required: true,
  }
})
const emit = defineEmits(['update:priceFilter'])

const popoverOpen = ref(false)
const localPriceFilter = ref<Filter<PriceFilter>>(props.priceFilter)
const filterActive = computed(() => props.priceFilter.value.min !== undefined || props.priceFilter.value.max !== undefined)
const errors = ref<string[]>([])

const state = reactive<PriceFilter>({
  min: localPriceFilter.value.value.min,
  max: localPriceFilter.value.value.max,
})

watch(
  () => props.priceFilter,
  (newFilter) => {
    state.min = newFilter.value.min
    state.max = newFilter.value.max
    localPriceFilter.value = newFilter
  },
  { immediate: true, deep: true }
)

const validate = (state: PriceFilter) => {
  if (state.min && state.min < 0) errors.value.push('Min. Preis muss mindestens 0 € sein!')
  if (state.max && state.max > 999.99) errors.value.push('Max. Preis muss kleiner 1.000 € sein!')
}

const priceLabel = computed(() => {
  if (localPriceFilter.value.value.min !== undefined && localPriceFilter.value.value.max !== undefined) {
    return `Preis: ${localPriceFilter.value.value.min.toFixed(2)} - ${localPriceFilter.value.value.max.toFixed(2)} €`
  } else if (localPriceFilter.value.value.min !== undefined) {
    return `Preis: ab ${localPriceFilter.value.value.min.toFixed(2)} €`
  } else if (localPriceFilter.value.value.max !== undefined) {
    return `Preis: bis ${localPriceFilter.value.value.max.toFixed(2)} €`
  } else {
    return 'Preis'
  }
})

async function onSubmit (event: FormSubmitEvent<PriceFilter>) {
  validate(event.data)

  if (!event.data.min && !event.data.max) {
    resetModal()
  } else if (event.data.min && event.data.max && event.data.min > event.data.max) {
    // Save original values before modifying state
    const originalMin = event.data.min
    const originalMax = event.data.max

    state.min = originalMax
    state.max = originalMin
    localPriceFilter.value = { active: true, value: { min: originalMax, max: originalMin } }

    emit('update:priceFilter', localPriceFilter.value)
  } else if (errors.value.length) {
    return
  } else {
    localPriceFilter.value = { active: true, value: { min: event.data.min, max: event.data.max } }
    emit('update:priceFilter', localPriceFilter.value)
  }

  popoverOpen.value = false
}

function resetModal () {
  state.min = undefined
  state.max = undefined
  localPriceFilter.value = { active: false, value: { min: undefined, max: undefined } }

  emit('update:priceFilter', localPriceFilter.value)

  popoverOpen.value = false
}
</script>