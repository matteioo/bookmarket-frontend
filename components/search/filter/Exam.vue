<template>
  <div>
    <UPopover v-model:open="popoverOpen">
      <UButton
        label="Markiert"
        icon="i-heroicons-paint-brush-16-solid"
        size="xs"
        :variant="!localExamFilter.value.exam ? 'outline' : 'solid'"
        :color="!localExamFilter.value.exam ? 'primary' : 'gray'"
      />

      <template #panel>
        <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
          <div class="p-4 flex flex-col gap-y-4">
            <UFormGroup name="marked" class="w-72">
              <USelect
                v-model="state.exam"
                :options="exams"
              />
            </UFormGroup>
          
            <div class="inline-flex flex-row-reverse gap-x-2 justify-stretch flex-wrap">
              <UButton
                type="submit"
                label="Speichern"
                color="red"
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

interface MarkedFields {
  marked: boolean;
  unmarked: boolean;
}

const props = defineProps({
  examFilter: {
    type: Object as PropType<ExamFilter>,
    required: true,
  }
});
const emit = defineEmits(['update:examFilter']);

const popoverOpen = ref(false);
const localExamFilter = ref<ExamFilter>(props.examFilter);

const exams = ['Wade Cooper', 'Arlene Mccoy', 'Devon Webb', 'Tom Cook', 'Tanya Fox', 'Hellen Schmidt', 'Caroline Schultz', 'Mason Heaney', 'Claudie Smitham', 'Emil Schaefer'];

const state = reactive({
  exam: props.examFilter.value.exam,
})

const validate = (state: MarkedFields): FormError[] => {
  const errors = []
  if (!state.marked && !state.unmarked) errors.push({ path: 'unmarked', message: 'Mindestens ein Feld muss aktiv sein!' })
  return errors
}

async function onSubmit (event: FormSubmitEvent<MarkedFields>) {
  if (event.data.marked === true && event.data.unmarked === true) {
    resetModal();
  } else {
    localExamFilter.value = { active: true, value: { exam: event.data.exam } };
    emit('update:examFilter', localExamFilter.value);
  }

  console.log(event.data.marked, event.data.marked, localExamFilter.value);
  
  popoverOpen.value = false;
}

function resetModal () {
  state.exam = undefined;
  localExamFilter.value = { active: false, value: { exam: undefined } };

  emit('update:examFilter', localExamFilter.value);

  popoverOpen.value = false;
}

interface ExamFilter {
  active: boolean;
  value: {
    exam: string | undefined;
  };
}
</script>