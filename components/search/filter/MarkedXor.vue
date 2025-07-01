<template>
  <div>
    <UPopover v-model:open="popoverOpen">
      <UButton
        label="Markiert"
        icon="i-heroicons-paint-brush-16-solid"
        size="xs"
        :variant="filterActive ? 'subtle' : 'outline'"
        :color="filterActive ? 'primary' : 'neutral'"
      />

      <template #panel>
        <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
          <div class="p-4 flex flex-col gap-y-4">
            <UFormField name="marked">
              <UCheckbox v-model="state.marked" label="Markierte Angebote anzeigen" />
            </UFormField>

            <UFormField name="marked">
              <UCheckbox v-model="state.unmarked" label="Nicht markierte Angebote anzeigen" />
            </UFormField>

            <div v-if="!state.marked && !state.unmarked" class="text-red-500 dark:text-red-400 text-sm">
              Mindestens ein Feld muss aktiv sein!
            </div>
          
            <div class="inline-flex flex-row-reverse gap-x-2 justify-stretch flex-wrap">
              <UButton
                type="submit"
                label="Speichern"
                color="primary"
                variant="outline"
                block
                class="flex-1"
                :disabled="!state.marked && !state.unmarked"
              />

              <UButton
                label="Löschen"
                color="neutral"
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
import type { FormError, FormSubmitEvent } from '#ui/types'

interface MarkedFields {
  marked: boolean
  unmarked: boolean
}

const props = defineProps({
  markedFilter: {
    type: Object as PropType<MarkedFilter>,
    required: true,
  }
})
const emit = defineEmits(['update:markedFilter'])

const popoverOpen = ref(false)
const localMarkedFilter = ref<MarkedFilter>(props.markedFilter)
const filterActive = computed(() => !localMarkedFilter.value.value.marked || !localMarkedFilter.value.value.unmarked)


const state = reactive({
  marked: props.markedFilter.value.marked,
  unmarked: props.markedFilter.value.unmarked,
})

const validate = (state: MarkedFields): FormError[] => {
  const errors = []
  if (!state.marked && !state.unmarked) errors.push({ name: 'unmarked', message: 'Mindestens ein Feld muss aktiv sein!' })
  return errors
}

async function onSubmit (event: FormSubmitEvent<MarkedFields>) {
  if (event.data.marked === true && event.data.unmarked === true) {
    resetModal()
  } else {
    localMarkedFilter.value = { active: true, value: { marked: event.data.marked, unmarked: event.data.unmarked } }
    emit('update:markedFilter', localMarkedFilter.value)
  }
  
  popoverOpen.value = false
}

function resetModal () {
  state.marked = true
  state.unmarked = true
  localMarkedFilter.value = { active: false, value: { marked: true, unmarked: true } }

  emit('update:markedFilter', localMarkedFilter.value)

  popoverOpen.value = false
}

interface MarkedFilter {
  active: boolean
  value: {
    marked: boolean
    unmarked: boolean
  }
}
</script>