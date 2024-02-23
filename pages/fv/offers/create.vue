<template>
  <div class="mx-auto">
    <FormSteps :steps="steps" @step-clicked="handleStepClicked" />
  </div>
  <div class="flex-grow w-full max-w-md mx-auto flex flex-col items-center justify-center gap-y-6">
    <div>
      Offers create offer | step: {{ currentStep }}
    </div>
    <FormGroupStepSeller :onSubmit="handleSellerSubmit" v-if="currentStep === 1" />
    <div v-else-if="currentStep == 2">
      {{ offers }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Seller } from '~/interfaces/Seller';
import type { Book } from '~/interfaces/Book';

definePageMeta({
  middleware: 'auth',
  layout: 'protected',
});

let currentStep = ref(1);
let offers = ref({} as Offers);

const steps = [
  { step: 1, title: 'Verkäufer:in zuordnen' },
  { step: 2, title: 'Bücher anlegen' },
  { step: 3, title: 'Kontrolle' },
]

const handleStepClicked = (step: number) => {
  if (step < currentStep.value) {
    currentStep.value = step;
  }
};

const handleSellerSubmit = (submittedSeller: Seller) => {
  offers.value.seller = submittedSeller;
  console.log('offers', offers.value);
  currentStep.value = 2;
}

interface Offers {
  seller: Seller;
  books: Book[];
}
</script>