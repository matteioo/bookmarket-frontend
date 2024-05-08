<template>
  <div>
    <UPopover v-model:open="popoverOpen">
      <UButton
        label="Preis"
        icon="i-heroicons-banknotes-16-solid"
        size="xs"
        :variant="localPriceFilter.active ? 'outline' : 'solid'"
        :color="localPriceFilter.active ? 'primary' : 'gray'"
      />

      <template #panel>
        <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
          <div class="p-4 flex flex-col gap-y-4">
            <div class="inline-flex flex-row gap-x-2 items-center">
              <UFormGroup class="w-24" name="minPrice">
                <UInput v-model="state.minPrice" placeholder="Min." type="number" step="0.01" min="0" max="999.99" />
              </UFormGroup>
              <span>bis</span>
              <UFormGroup class="w-24" name="maxPrice">
                <UInput v-model="state.maxPrice" placeholder="Max." type="number" step="0.01" min="0" max="999.99" />
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
import type { FormError, FormSubmitEvent } from '#ui/types'

const props = defineProps({
  priceFilter: {
    type: Object as PropType<{
      active: boolean;
      value: {
        min: number | undefined;
        max: number | undefined;
      };
    }>,
    required: true,
  }
});
const emit = defineEmits(['update:priceFilter']);

const popoverOpen = ref(false);
const localPriceFilter = ref<PriceFilter>(props.priceFilter);

const state = reactive({
  minPrice: props.priceFilter.value.min,
  maxPrice: props.priceFilter.value.max,
})

const validate = (state: any): FormError[] => {
  const errors = []
  if (state.minPrice && state.minPrice < 0) errors.push({ path: 'minPrice', message: 'Preis muss mind. 0 sein!' })
  if (state.maxPrice && state.maxPrice > 999.99) errors.push({ path: 'maxPrice', message: 'Preis darf max. 999,99 sein!' })
  if (state.minPrice && state.maxPrice && state.minPrice > state.maxPrice) errors.push({ path: 'maxPrice', message: 'Max. Preis muss größer als Min. Preis sein!' })
  return errors
}

async function onSubmit (event: FormSubmitEvent<any>) {
  if (!event.data.minPrice && !event.data.maxPrice) {
    resetModal();
  } else {
    localPriceFilter.value = { active: true, value: { min: event.data.minPrice, max: event.data.maxPrice } };
    emit('update:priceFilter', localPriceFilter.value);
  }

  popoverOpen.value = false;
}

function resetModal () {
  state.minPrice = undefined;
  state.maxPrice = undefined;
  localPriceFilter.value = { active: false, value: { min: undefined, max: undefined } };

  emit('update:priceFilter', localPriceFilter.value);

  popoverOpen.value = false;
}



/* const updateModel = () => {
  if (validateInput() === undefined) {
    if (minPrice === undefined && maxPrice === undefined) {
      filterActive.value = false;
    } else {
      filterActive.value = true;
    }
    console.log('update', localPriceFilter.value);

    emit('update:priceFilter', localPriceFilter.value);
  };
}

const resetModal = () => {
  minPrice.value = undefined;
  maxPrice.value = undefined;
  filterActive.value = false;

  emit('update:priceFilter', localPriceFilter.value);
} */

interface PriceFilter {
  active: boolean;
  value: {
    min: number | undefined;
    max: number | undefined;
  };
}
</script>