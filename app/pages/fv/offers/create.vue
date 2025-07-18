<template>
  <div class="grow flex flex-col">
    <div class="mx-auto w-full max-w-lg mb-4">
      <FormSteps :steps="steps" :active="currentStep" @step-clicked="handleStepClicked" />
    </div>
    <div class="grow flex flex-col items-center gap-y-6" :class="{ 'justify-center': currentStep === 1 }">
      <div v-if="currentStep === 1" class="w-full max-w-md mx-auto">
        <FormGroupStepSeller :current-seller="offers.seller" :on-submit="handleSellerSubmit" />
      </div>
      <div v-else-if="currentStep === 2" class="w-full max-w-(--breakpoint-xl) mx-auto">
        <FormGroupStepOffer :current-offers="offers.offers" :on-submit="handleOfferSubmit" :seller="offers.seller" />
      </div>
      <div v-else-if="currentStep === 3">
        <FormGroupStepOverview :model-value="offers" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Seller } from '~/interfaces/Seller'
import type { Offer } from '~/interfaces/Offer'

useSeoMeta({
  title: 'Angebot anlegen',
})

definePageMeta({
  layout: 'protected',
})

const currentStep = ref<number>(1)
const offers = ref<NewOffers>({} as NewOffers)

const steps = [
  { step: 1, title: 'Verkäufer:in zuordnen' },
  { step: 2, title: 'Bücher hinzufügen' },
  { step: 3, title: 'Kontrolle' },
]

const handleStepClicked = (step: number) => {
  if (step < currentStep.value) {
    currentStep.value = step
  }
}

const handleSellerSubmit = (submittedSeller: Seller) => {
  offers.value.seller = submittedSeller
  currentStep.value = 2
}

const handleOfferSubmit = (submittedOffers: Offer[]) => {
  offers.value.offers = submittedOffers
  currentStep.value = 3
}

interface NewOffers {
  seller: Seller
  offers: Offer[]
}
</script>