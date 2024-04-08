<template>
  <div class="flex flex-row gap-x-8">
    <!-- left side -->
    <div class="flex-shrink-0 w-80">
      <div class="sticky h-fit top-4">
        <USelectMenu
          v-model="selected"
          :loading="loading"
          :searchable="search"
          placeholder="Suche nach einem Buch..."
          option-attribute="isbn"
          trailing
          by="isbn"
          class="w-full"
        >
          <template #label>
            <span v-if="selected" class="truncate">{{ selected?.isbn }} &middot; {{ selected?.title }}</span>
          </template>
  
          <template #option="{ option: person }">
            <div class="flex flex-col w-full">
              <div>{{ person.isbn }}</div>
              <div class="truncate text-sm dark:text-gray-300">{{ person.title }}</div>
            </div>
          </template>
        </USelectMenu>
  
        <div v-if="selected" class="w-full">
          <div class="grid grid-cols-4 gap-2">
            <DataLabel label="Titel" :data="selected.title" class="col-span-4" />
            <DataLabel label="ISBN" :data="selected.isbn" class="col-span-2" />
            <DataLabel label="Auflage" :data="String(selected.edition)" class="col-span-1" />
            <DataLabel label="Max. Preis" :data="String(selected.maxPrice)" class="col-span-1" />
            <DataLabel label="Zugehörige Prüfung" :data="selected.exam?.name" class="col-span-4" />
            <DataLabel label="Autoren" :data="selected.authors" class="col-span-4" />
            <DataLabel label="Verlag" :data="selected.publisher" class="col-span-4" />
          </div>
          <div class="float-right">
            <UButton
              size="sm"
              color="primary"
              variant="outline"
              label="Hinzufügen"
              :disabled="!selected"
              @click="handleSearchSubmit"
            />
          </div>
        </div>
  
        <UDivider label="ODER ANLEGEN" />
      </div>
    </div>
    <!-- right side -->
    <div class="flex flex-grow flex-col gap-y-2">
      <div v-if="offers.length !== 0">
        <div v-for="(offer, index) in offers" :key="offer.id" class="p-2 hover:bg-white dark:hover:bg-gray-900 rounded">
          <CheckoutOfferItemCreate v-model="offers[index]" @delete-item="handleDeleteItem" />
        </div>
        <div class="sticky bottom-0 w-full p-4 inline-flex flex-row justify-between backdrop-blur-md">
          <div>Preis: {{ currentPrice }}</div>
          <UButton label="Weiter" />
        </div>
      </div>
      <div v-else class="py-16 text-center">
        <UIcon name="i-heroicons-folder-open-20-solid" class="text-5xl text-gray-300" />
        <p class="text-gray-600">
          Noch keine Bücher hinzugefügt...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Seller } from '~/interfaces/Seller';
import type { Page } from '~/interfaces/Page';
import type { Book } from '~/interfaces/Book';
import type { Offer } from '~/interfaces/Offer';
import type { Member } from '~/interfaces/Member';

const props = defineProps({
  seller: {
    type: Object as () => Seller,
    required: true,
  },
  onSubmit: {
    type: Function as PropType<(userData: Offer[]) => void>,
    required: true,
  },
});

const loading = ref(false);
const selected = ref(undefined as Book | undefined);
const { token } = useAuth();
const offers = ref([] as Offer[]);
let currentPrice = ref(0);

// This anonymous function is called by the USelectMenu component to pass the selected seller to the parent component
const handleSearchSubmit = () => {
  if (selected.value) {
    console.log('selected seller', selected.value);
    createOffer(selected.value);
    //props.onSubmit(offers.value);
  } else {
    console.error('No seller selected');
  }
}

// This function is called by the selectMenu component to search for sellers
async function search(query: string) {
  loading.value = true;
  
  const sellers = await $fetch<Page<Book>>(useRuntimeConfig().public.apiUrl + '/books', {
    headers: {
      Authorization: `$value}`,
    },
    params: {
      search: query,
      offset: 0,
      limit: 20,
    },
  });

  loading.value = false;
  return sellers.results;
}

const handleDeleteItem = (item: Offer) => {
  const index = offers.value.indexOf(item);
  if (index !== -1) {
    offers.value.splice(index, 1);
  }
}

const member: Member = {
  id: 0,
  username: 'username',
  email: 'emailAddress', 
};

function createOffer(book: Book) {
  let offer: Offer = {
    book: book,
    price: book.maxPrice,
    seller: props.seller,
    member: member,
    active: true,
    createdAt: new Date(),
    modified: new Date(),
    marked: false,
    location: 'location',
  };
  offers.value.push(offer);
  console.log('offers', offers.value);
}

watch(offers, () => {
  console.log('offers', offers.value);
  const sum = offers.value.reduce((sum: number, offer) => {
    const priceAsNumber: number = offer.price;
    return sum + priceAsNumber;
  }, 0);
  currentPrice.value = Math.round(sum * 100) / 100;
}, { deep: true });
</script>