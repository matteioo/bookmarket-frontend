<template>
  <div class="w-full max-w-screen-lg mx-auto">
    <h1 class="text-center text-xl uppercase text-primary-600 dark:text-primary-400 tracking-wider">Bücher verkaufen</h1>

    <section class="mt-8 flex flex-row gap-x-8">
      <!-- left side -->
      <aside class="flex-shrink-0 w-80">
        <div class="sticky w-full h-fit top-4">
          <div>
            <UButtonGroup orientation="horizontal" class="w-full">
              <UInput v-model="state.offerId" name="offerId" placeholder="1234" step="1" min="0" class="flex-grow" @keydown.enter="searchOffer" />
              <UButton type="submit" icon="i-heroicons-plus" color="gray" :disabled="isOfferIdValid?.error" :loading="loadingOffer" @click="searchOffer"/>
            </UButtonGroup>
            <div v-if="isOfferIdValid?.error" class="text-red-500 dark:text-red-400 text-sm mt-1">
              {{ isOfferIdValid.message }}
            </div>
            <div v-else-if="selectedOffer && !selectedOffer.active" class="text-red-500 dark:text-red-400 text-sm mt-1">
              Angebot mit der ID {{ selectedOffer.id }} ist nicht aktiv...
            </div>
          </div>
          <div v-if="selectedOffer && selectedOffer.active" class="w-full mt-4">
            <div class="grid grid-cols-6 gap-2">
              <DataLabel label="Titel" :data="selectedOffer.book.title" class="col-span-6" />
              <DataLabel label="ISBN" :data="selectedOffer.book.isbn" class="col-span-3" />
              <DataLabel label="Auflage" :data="String(selectedOffer.book.edition)" class="col-span-1" />
              <DataLabel label="Max. Preis" :data="formatPrice(selectedOffer.book.maxPrice)" class="col-span-2" />
              <DataLabel label="Autoren" :data="selectedOffer.book.authors" class="col-span-6" />
              <DataLabel label="Verlag" :data="selectedOffer.book.publisher" class="col-span-6" />
              <DataLabel label="Zugehörige Prüfung" :data="selectedOffer.book.exam?.name" class="col-span-6" />
              <UDivider class="col-span-6" label="Angebotdetails" />
              <DataLabel label="Verkäufer" :data="`${selectedOffer.seller.fullName}`" class="col-span-6" />
              <DataLabel label="Markiert" :data="selectedOffer.marked ? 'Ja' : 'Nein'" class="col-span-2" />
              <DataLabel label="Ort" :data="selectedOffer.location" class="col-span-2" />
              <DataLabel label="Preis" :data="formatPrice(selectedOffer.price)" class="col-span-2" />
            </div>
            <div class="w-full mt-2 flex flex-row justify-end gap-x-2">
              <UButton
                size="sm"
                color="primary"
                variant="outline"
                label="Hinzufügen"
                :disabled="!selectedOffer"
                @click="addOffer"
              />
            </div>
          </div>
        </div>
      </aside>
      <!-- right side -->
      <div class="flex-grow">
        <div v-if="addedOffers.length !== 0" class="flex flex-grow flex-col gap-y-4">
          <div v-for="(offer, index) in addedOffers" :key="offer.id">
            <CheckoutOfferItemSell v-model="addedOffers[index]" @delete-item="removeOffer" />
          </div>
          <div class="w-full inline-flex justify-end items-center gap-x-2">
            <div>
              Gesamtpreis: <b>{{ selectedOfferPrice }}</b>
            </div>
            <div>
              <UButton
                size="sm"
                color="primary"
                variant="solid"
                label="Verkaufen"
                :disabled="addedOffers.length === 0"
                @click="confirmModalOpen = true"
              />
            </div>
          </div>
          <UModal v-model="confirmModalOpen">
            <UCard>
              <template #header>
                Kauf bestätigen
              </template>

              Ich habe vom Käufer <b>{{ selectedOfferPrice }}</b> erhalten und <b>{{ offerCount }}</b> übergeben!

              <template #footer>
                <div class="flex flex-row justify-end gap-x-2">
                  <UButton
                    size="sm"
                    color="primary"
                    variant="outline"
                    label="Abbrechen"
                    @click="confirmModalOpen = false"
                  />
                  <UButton
                    size="sm"
                    color="primary"
                    variant="solid"
                    label="Bestätigen"
                    @click="confirmModalOpen = false"
                  />
                </div>
              </template>
            </UCard>
          </UModal>
        </div>
        <div v-else class="py-16 text-center">
          <UIcon name="i-heroicons-inbox-arrow-down-20-solid" class="text-5xl text-gray-300 dark:text-gray-700" />
          <p class="text-gray-600 dark:text-gray-400">
            Noch keine Angebote hinzugefügt...
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Offer } from '~/interfaces/Offer';
import { formatPrice } from '~/utils/utils';

definePageMeta({
  layout: 'protected',
})

const { token } = useAuth()
const loadingOffer = ref(false)
const selectedOffer = ref<Offer | null>(null)
const addedOffers = ref<Offer[]>([])
const confirmModalOpen = ref(false)

const state = reactive({
  offerId: '',
})

const selectedOfferPrice = computed(() => formatPrice(addedOffers.value.reduce((acc, offer) => acc + offer.price, 0)))

const offerCount = computed(() => {
  if (addedOffers.value.length === 1) {
    return 'ein Buch';
  } else {
    return `${addedOffers.value.length} Bücher`;
  }
})

const isOfferIdValid = computed(() => {
  if (state.offerId === '') return null;
  if (Number.isInteger(Number(state.offerId)) && Number(state.offerId) >= 0) {
    if (addedOffers.value.find(offer => offer.id === Number(state.offerId))) {
      return { error: true, message: 'Angebot mit dieser ID wurde bereits hinzugefügt.' };
    } else {
      return { error: false, message: null };
    }
  }
  return { error: true, message: 'Angebots-ID muss eine positive Zahl sein!' };
})

async function searchOffer () {
  if (!isOfferIdValid.value) return;
  loadingOffer.value = true;

  const offerId = Number(state.offerId);
  try {
    const offerById = await $fetch<Offer>(useRuntimeConfig().public.apiUrl + '/offers/' + offerId, {
      method: 'GET',
      headers: {
        Authorization: `${token.value}`,
      },
    });

    if (offerById) {
      selectedOffer.value = offerById;

      if (!selectedOffer.value.active) {
        state.offerId = '';
      }
    } else {
      selectedOffer.value = null;
      console.error('No offer found with ID:', offerId);
    }

  } catch (error) {
    selectedOffer.value = null;
    console.error('Failed to fetch offer:', error);
  }

  loadingOffer.value = false;
}

function addOffer() {
  console.log('adding offer', selectedOffer.value);
  if (selectedOffer.value) {
    addedOffers.value.push(selectedOffer.value);
    selectedOffer.value = null;
    state.offerId = '';
  }
}

function removeOffer(offer: Offer) {
  const index = addedOffers.value.indexOf(offer);
  if (index > -1) {
    addedOffers.value.splice(index, 1);
  }
  console.log('removed offer - offers:', addedOffers.value);
}
</script>