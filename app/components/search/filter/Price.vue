<template>
  <div>
    <UPopover v-model:open="popoverOpen">
      <UButton
        :label="priceLabel"
        icon="i-heroicons-banknotes-16-solid"
        size="xs"
        :variant="filterActive ? 'subtle' : 'outline'"
        :color="filterActive ? 'primary' : 'neutral'"
      />

      <template #content>
        <UForm :state="state" class="space-y-4" @submit="onSubmit">
          <div class="p-4 flex flex-col gap-y-4">
            <div class="inline-flex flex-row gap-x-2 items-center">
              <UFormField class="w-32" name="minPrice">
                <FormInputPrice
                  v-model="state.min"
                  class="w-full"
                  :max="state.max ? Math.max(state.max - 1, 0) : 999"
                />
              </UFormField>
              <span>bis</span>
              <UFormField class="w-32" name="maxPrice">
                <FormInputPrice
                  v-model="state.max"
                  class="w-full"
                  :min="state.min ? Math.min(state.min + 1, 999) : 0"
                />
              </UFormField>
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
                color="neutral"
                variant="subtle"
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
    type: Object as PropType<Filter<PriceFilter>>,
    required: true,
  }
})
const emit = defineEmits(['update:priceFilter'])

const popoverOpen = ref<boolean>(false)
const errors = ref<string[]>([])

const state = reactive<PriceFilter>({
  min: props.priceFilter.value.min,
  max: props.priceFilter.value.max,
})

watch(
  () => props.priceFilter,
  (newFilter) => {
    state.min = newFilter.value.min
    state.max = newFilter.value.max
  },
  { immediate: true, deep: true }
)

const filterActive = computed(() => props.priceFilter.value.min !== undefined || props.priceFilter.value.max !== undefined)

const priceLabel = computed(() => {
  const { min, max } = props.priceFilter.value

  if (min !== undefined && max !== undefined) {
    if (min === max) return `Preis: ${min} €`
    return `Preis: ${min} - ${max} €`
  } else if (min !== undefined) {
    return `Preis: ab ${min} €`
  } else if (max !== undefined) {
    return `Preis: bis ${max} €`
  }
  return 'Preis'
})

const validate = (state: PriceFilter): boolean => {
  errors.value = []
  if (state.min && state.min < 0) errors.value.push('Min. Preis muss mindestens 0 € sein!')
  if (state.min && state.min > 999) errors.value.push('Min. Preis darf maximal 999 € sein!')
  if (state.max && state.max < 0) errors.value.push('Max. Preis muss mindestens 0 € sein!')
  if (state.max && state.max > 999) errors.value.push('Max. Preis darf maximal 999 € sein!')

  return errors.value.length === 0
}

async function onSubmit (event: FormSubmitEvent<PriceFilter>) {
  const min = event.data.min
  const max = event.data.max

  if (!min && !max) {
    return resetModal()
  }

  if (!validate(event.data)) {
    return
  }

  let newMin = min
  let newMax = max

  if (min != null && max != null && min > max) {
    // Swap values if min is greater than max
    newMin = max
    newMax = min
  }

  emit('update:priceFilter', { active: true, value: { min: newMin, max: newMax } } as Filter<PriceFilter>)
  popoverOpen.value = false
}

function resetModal () {
  state.min = undefined
  state.max = undefined
  emit('update:priceFilter', { active: false, value: { min: undefined, max: undefined } } as Filter<PriceFilter>)
  popoverOpen.value = false
}
</script>