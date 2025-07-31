<template>
  <div class="grow w-full flex flex-col max-w-(--breakpoint-xl) mx-auto">
    <h1 class="text-center text-xl uppercase text-primary-600 dark:text-primary-400 tracking-wider">Bücher verkaufen</h1>

    <section class="grow mt-8 flex flex-row gap-x-8">
      <!-- left side -->
      <aside class="shrink-0 w-full sm:w-96 md:w-80 mx-auto">
        <div class="sticky w-full h-fit top-4">
          <div>
            <UButtonGroup orientation="horizontal" class="w-full">
              <UInput v-model="state.offerId" name="offerId" placeholder="1234" step="1" min="0" class="grow" @keydown.enter="searchOffer" />
              <UButton type="submit" icon="i-heroicons-plus" color="neutral" variant="outline" :disabled="errorMsg != null" :loading="loadingOffer" @click="searchOffer"/>
            </UButtonGroup>
            <div v-if="isIdInvalid" class="text-red-500 dark:text-red-400 text-sm mt-1">
              {{ errorMsg }}
            </div>
          </div>
          <div v-if="selectedOffer && selectedOffer.active && !isIdInvalid" class="w-full mt-4">
            <div class="grid grid-cols-6 gap-2">
              <DataLabel multi-line label="Titel" :data="selectedOffer.book.title" class="col-span-6" />
              <DataLabel label="ISBN" :data="selectedOffer.book.isbn" class="col-span-3" />
              <DataLabel label="Auflage" :data="String(selectedOffer.book.edition)" class="col-span-1" />
              <DataLabel label="Max. Preis" :data="formatPrice(selectedOffer.book.maxPrice)" class="col-span-2" />
              <DataLabel multi-line label="Autoren" :data="selectedOffer.book.authors" class="col-span-6" />
              <DataLabel multi-line label="Verlag" :data="selectedOffer.book.publisher" class="col-span-6" />
              <DataLabel multi-line label="Zugehörige Prüfung" :data="selectedOffer.book.exam?.name" class="col-span-6" />
              <USeparator class="col-span-6" label="Angebotdetails" />
              <DataLabel label="Verkäufer" :data="`${selectedOffer.seller.fullName}`" class="col-span-6" />
              <DataLabel label="Markiert" :data="selectedOffer.marked ? 'Ja' : 'Nein'" class="col-span-2" />
              <DataLabel label="Ort" :data="selectedOffer.location" class="col-span-2" />
              <DataLabel label="Preis" :data="formatPrice(selectedOffer.price)" class="col-span-2" />
            </div>
            <div class="w-full mt-2 flex flex-row justify-end gap-x-2">
              <UButton
                color="primary"
                variant="outline"
                label="Hinzufügen"
                :block="true"
                :disabled="!selectedOffer || isIdInvalid"
                @click="addOffer"
              />
            </div>
          </div>
        </div>
      </aside>
      <!-- right side -->
      <div class="grow hidden md:block">
        <div v-if="addedOffers.length !== 0" class="flex grow flex-col gap-y-4">
          <div v-for="(offer, index) in addedOffers" :key="offer.id">
            <CheckoutOfferItemSell v-if="addedOffers[index]" v-model="addedOffers[index]" @delete-item="removeOffer" />
          </div>
          <div class="w-full inline-flex justify-between items-center">
            <div>
              <UButton
                color="neutral"
                icon="i-heroicons-arrow-path"
                variant="ghost"
                label="Neu laden"
                :loading="updatingAddedOffers"
                @click="updateOffers"
              />
            </div>
            <div class="inline-flex items-center gap-x-2">
              <div>
                Gesamtpreis: <b>{{ selectedOfferPrice }}</b>
              </div>
              <div>
                <UButton
                  color="primary"
                  variant="solid"
                  label="Verkaufen"
                  :disabled="addedOffers.length === 0 || !addedOffersActive || updatingAddedOffers"
                  @click="confirmModalOpen = true"
                />
              </div>
            </div>
          </div>
          <UModal v-model:open="confirmModalOpen">
            <template #content>
              <UCard>
                <template #header>
                  Kauf bestätigen
                </template>
  
                Ich habe vom Käufer <b>{{ selectedOfferPrice }}</b> erhalten und <b>{{ offerCount }}</b> übergeben!
  
                <template #footer>
                  <div class="flex flex-row justify-end gap-x-2">
                    <UButton
                      color="primary"
                      variant="outline"
                      label="Abbrechen"
                      :disabled="loadingCheckout"
                      @click="confirmModalOpen = false"
                    />
                    <UButton
                      color="primary"
                      variant="solid"
                      label="Bestätigen"
                      :loading="loadingCheckout"
                      @click="checkout"
                    />
                  </div>
                </template>
              </UCard>
            </template>
          </UModal>
        </div>
        <div v-else class="py-16 text-center">
          <UIcon name="i-heroicons-inbox-arrow-down-20-solid" class="text-5xl text-neutral-300 dark:text-neutral-700" />
          <p class="text-neutral-600 dark:text-neutral-400">
            Noch keine Angebote hinzugefügt...
          </p>
        </div>
      </div>
    </section>
    <div
      class="md:hidden mt-4 sticky bottom-4 w-full p-2 sm:p-4 flex flex-col gap-y-2 rounded-md border backdrop-blur-md"
      :class="addedOffersActive ? 'border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50' : 'border-orange-200 dark:border-orange-800 bg-orange-50/35 dark:bg-orange-900/25'"
    >
      <div class="flex flex-row justify-between items-center">
        <div class="flex items-center gap-x-4">
          <UIcon
            name="i-lucide-shopping-basket"
            class="w-10 h-10"
            :class="addedOffersActive ? 'text-neutral-400 dark:text-neutral-600' : 'text-orange-400 dark:text-orange-500'"
          />
          <div>
            <div :class="addedOffersActive ? 'text-neutral-700 dark:text-neutral-300' : 'text-orange-700 dark:text-orange-300'">
              <span class="hidden sm:inline">Ausgewählte Angebote: </span>{{ offerCount }}
            </div>
            <div :class="addedOffersActive ? 'text-neutral-700 dark:text-neutral-300' : 'text-orange-700 dark:text-orange-300'">
              <span class="hidden sm:inline">Gesamtpreis: </span><b>{{ selectedOfferPrice }}</b>
            </div>
          </div>
        </div>
        <UButton
          variant="subtle"
          :color="addedOffersActive ? 'primary' : 'error'"
          :label="showAddedOffers ? 'Angebote verbergen' : 'Angebote anzeigen'"
          :disabled="addedOffers.length === 0 || updatingAddedOffers"
          @click="showAddedOffers = !showAddedOffers"
        />
      </div>
      <div 
        class="transition-all duration-300 ease-in-out overflow-hidden"
        :class="showAddedOffers ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'"
      >
        <div class="max-h-52 overflow-y-scroll">
          <div v-for="(offer, index) in addedOffers" :key="offer.id" class="mb-2">
            <CheckoutOfferItemSell v-if="addedOffers[index]" v-model="addedOffers[index]" @delete-item="removeOffer" />
          </div>
        </div>
        <UButton
          color="primary"
          variant="solid"
          label="Verkaufen"
          block
          :disabled="addedOffers.length === 0 || !addedOffersActive || updatingAddedOffers"
          @click="confirmModalOpen = true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Offer } from '~/interfaces/Offer'
import type { FetchError } from 'ofetch'
import { formatPrice } from '~/utils/utils'

useSeoMeta({
  title: 'Verkaufen',
})

definePageMeta({
  layout: 'protected',
})

const route = useRoute()
const { $api } = useNuxtApp()
const loadingOffer = ref<boolean>(false)
const selectedOffer = ref<Offer | null>(null)
const addedOffers = ref<Offer[]>([])
const confirmModalOpen = ref<boolean>(false)
const errorMsg = ref<string | null>(null)
const loadingCheckout = ref<boolean>(false)
const updatingAddedOffers = ref<boolean>(false)
const showAddedOffers = ref<boolean>(false)

const offerId = Array.isArray(route.params.offerId) ? route.params.offerId[0] : route.params.offerId
const state = reactive({
  offerId: offerId ?? '',
})

if (state.offerId !== '') {
  searchOffer()
}

const isIdInvalid = computed(() => errorMsg.value !== null)
const selectedOfferPrice = computed(() => formatPrice(addedOffers.value.reduce((acc, offer) => acc + offer.price, 0)))
const offerCount = computed(() => {
  if (addedOffers.value.length === 1) {
    return 'ein Buch'
  } else {
    return `${addedOffers.value.length} Bücher`
  }
})
const addedOffersActive = computed(() => addedOffers.value.every(offer => offer.active))

function isOfferIdValid() {
  if (!Number.isInteger(Number(state.offerId)) || Number(state.offerId) < 0) {
    errorMsg.value = 'Angebots-ID muss eine positive Zahl sein!'
  } else if (addedOffers.value.find(offer => offer.id === Number(state.offerId))) {
    errorMsg.value = 'Angebot mit dieser ID wurde bereits hinzugefügt.'
  } else {
    errorMsg.value = null
  }
}

async function searchOffer () {
  if (!state.offerId.trim()) {
    return
  }

  isOfferIdValid()
  if (errorMsg.value) {
    selectedOffer.value = null
    return
  }
  loadingOffer.value = true

  const offerId = Number(state.offerId)
  try {
    selectedOffer.value = await fetchOffer(offerId)

    if (!selectedOffer.value.active) {
      errorMsg.value = 'Angebot ist nicht aktiv!'
      state.offerId = ''
      selectedOffer.value = null
    } else {
      showAddedOffers.value = false // Relevant for mobile screen
    }
  } catch (error) {
    const fetchError = error as FetchError

    selectedOffer.value = null
    if (fetchError.statusCode === 404) {
      errorMsg.value = 'Angebot nicht gefunden!'
    } else {
      errorMsg.value = 'Fehler beim Laden des Angebots!'
    }
  }

  loadingOffer.value = false
}

function addOffer() {
  if (selectedOffer.value) {
    addedOffers.value.push(selectedOffer.value)
    selectedOffer.value = null
    state.offerId = ''
  }
}

function removeOffer(offer: Offer) {
  const index = addedOffers.value.indexOf(offer)
  if (index > -1) {
    addedOffers.value.splice(index, 1)
  }
}

async function checkout() {
  loadingCheckout.value = true

  await $api('/offers/sell' , {
    method: 'POST',
    body: {
      offers: addedOfferIds(),
    },
    onResponse: () => {
      loadingCheckout.value = false
      confirmModalOpen.value = false
    },
    onResponseError: async () => {
      await updateOffers()
      useToast().add({
        title: 'Fehler',
        description: 'Bücher konnten nicht verkauft werden!',
        icon: 'i-heroicons-exclamation-triangle',
        color: 'error',
        actions: [{
          label: 'Zurücksetzen',
          variant: 'outline',
          color: 'error',
          onClick: () => {
            // TODO: Reset only inactive offers instead of all
            addedOffers.value = []
          },
        }]
      })
    }
  })

  useToast().add({
    title: 'Bücher wurden erfolgreich verkauft!',
    icon: 'i-heroicons-check-circle',
    color: 'success',
  })

  await navigateTo({
    path: '/fv',
  })
}

function addedOfferIds() {
  return addedOffers.value.map(offer => offer.id)
}

async function updateOffers() {
  updatingAddedOffers.value = true
  // Filter all offers where offer.id is null
  addedOffers.value = addedOffers.value.filter(offer => offer.id)

  // Create an array of promises to refetch all offers in parallel
  const fetchPromises = addedOffers.value.map(async (offer) => {
    if (!offer.id) {
      return
    }

    try {
      const refetchedOffer = await fetchOffer(offer.id)
      offer.active = refetchedOffer.active
    } catch {
      // If the offer is not found or any error occurs, set active to false
      offer.active = false
    }
  })

  // Wait for all fetch promises to complete
  await Promise.all(fetchPromises)
  updatingAddedOffers.value = false
}

async function fetchOffer(id: number): Promise<Offer> {
  return await $api<Offer>('/offers/' + id, {
    onResponseError: ({ response }) => {
      if (response.status === 404) {
        console.error('Offer not found:', id)
      } else {
        console.error('Failed to refetch offer:', response)
      }
    },
  })
}
</script>