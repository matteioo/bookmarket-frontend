<template>
  <div>
    <UPopover v-model:open="popoverOpen">
      <UButton
        :label="localExamFilter.value.exam ? `Prüfung: ${localExamFilter.value.exam}` : 'Prüfung'"
        icon="i-heroicons-academic-cap-16-solid"
        size="xs"
        :variant="localExamFilter.value.exam ? 'outline' : 'solid'"
        :color="localExamFilter.value.exam ? 'primary' : 'gray'"
      />

      <template #panel>
        <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
          <div class="p-4 flex flex-col gap-y-4">
            <UFormGroup name="examPicker" class="w-72">
              <USelect
                v-model="state.exam"
                :options="exams"
              />
            </UFormGroup>
          
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
import type { FormError, FormSubmitEvent } from '#ui/types'
import type { Filter, ExamFilter } from '~/interfaces/SearchFilters'
import type { Exam } from '~/interfaces/Exam'
import type { Page } from '~/interfaces/Page'

const props = defineProps({
  examFilter: {
    type: Object as PropType<Filter<ExamFilter>>,
    required: true,
  }
})
const emit = defineEmits(['update:examFilter'])

const { token } = useAuth()
const popoverOpen = ref(false)
const localExamFilter = ref<Filter<ExamFilter>>(props.examFilter)

const exams = [] as string[]
const state = reactive({
  exam: props.examFilter.value.exam,
})

onMounted(async () => {
  const { data: examsPage } = await useFetch<Page<Exam>>(useRuntimeConfig().public.apiUrl + '/exams', {
    headers: {
      Authorization: `${token.value}`,
    },
  })

  exams.push(...(examsPage.value?.results.map((exam) => exam.name) ?? []))
  
  // Set the initial value of state.exam after fetching the exams
  state.exam = props.examFilter.value.exam
})

const validate = (state: ExamFilter): FormError[] => {
  const errors = []
  if (state.exam && !exams.includes(state.exam)) errors.push({ path: 'examPicker', message: 'Prüfung ist nicht im System hinterlegt!' })
  return errors
}

async function onSubmit (event: FormSubmitEvent<ExamFilter>) {
  if (!event.data.exam || !exams.includes(event.data.exam)) {
    resetModal()
  } else {
    localExamFilter.value = { active: true, value: { exam: event.data.exam } }
    emit('update:examFilter', localExamFilter.value)
  }
  
  popoverOpen.value = false
}

function resetModal () {
  state.exam = undefined
  localExamFilter.value = { active: false, value: { exam: undefined } }

  emit('update:examFilter', localExamFilter.value)

  popoverOpen.value = false
}
</script>