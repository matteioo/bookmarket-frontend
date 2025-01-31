<template>
  <UModal v-model="editHistoryModal">
    <div class="p-4">
      <TimelineContainer>
        <TimelineItem icon="i-heroicons-user-plus-solid" variant="success" :member="member" :date-time="new Date('2024-04-18T03:24:12')" title="hat den Verkäufer angelegt" />
        
        <TimelineItem icon="i-heroicons-user-plus-solid" variant="info" :member="member" :date-time="new Date('2024-04-19T03:24:12')" title="hat den Verkäufer angeschaut" />
        
        <TimelineItem icon="i-heroicons-adjustments-horizontal-solid" variant="warning" :member="member" :date-time="new Date('2024-04-20T03:24:12')" title="hat den Verkäufer bearbeitet">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore veritatis iusto facere nostrum quas aspernatur repellendus atque voluptatibus minima ut, pariatur culpa? Dolores, sapiente voluptas consequuntur modi fuga et eos!
        </TimelineItem>

        <TimelineItem icon="i-heroicons-adjustments-horizontal-solid" variant="warning" :member="member" :date-time="new Date('2024-04-21T03:24:12')" title="hat den Verkäufer bearbeitet">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore veritatis iusto facere nostrum quas aspernatur repellendus atque voluptatibus minima ut, pariatur culpa? Dolores, sapiente voluptas consequuntur modi fuga et eos!
        </TimelineItem>

        <TimelineItem icon="i-heroicons-adjustments-horizontal-solid" variant="warning" :member="member" :date-time="new Date('2024-04-22T03:24:12')" title="hat den Verkäufer bearbeitet">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore veritatis iusto facere nostrum quas aspernatur repellendus atque voluptatibus minima ut, pariatur culpa? Dolores, sapiente voluptas consequuntur modi fuga et eos!
        </TimelineItem>

        <TimelineItem icon="i-heroicons-trash-solid" variant="error" :member="member" :date-time="new Date('2024-04-23T03:24:12')" title="hat den Verkäufer gelöscht" />
      </TimelineContainer>
    </div>
  </UModal>

  <div class="flex-grow flex flex-col gap-y-4 w-full max-w-screen-lg mx-auto">
    <section>
      <div class="flex items-center justify-between">
        <div class="inline-flex items-center gap-x-2">
          <h1 class="text-2xl tracking-wide font-medium text-primary-600 dark:text-primary-400">Verkäufer:in - {{ seller?.fullName }}</h1>
          <UButton icon="i-heroicons-pencil" size="sm" square variant="link" to="/fv/sellers" />
        </div>
        <UButton label="Bearbeitungsverlauf" variant="soft" @click="editHistoryModal = true" icon="i-heroicons-rectangle-stack" />
      </div>
      <div class="grid grid-cols-2">
        <DataLabel label="Matrikelnummer" :data="seller?.matriculationNumber" />
        <DataLabel label="E-Mail" :data="seller?.email" />
        <DataLabel label="Anmerkungen" :data="seller?.note" :multi-line="true" />
      </div>
    </section>
    <section class="flex flex-col gap-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-medium text-primary-800 dark:text-primary-200">Angebote</h2>
        <UInput placeholder="Suchen..." v-model="searchInput" />
      </div>
      <div class="w-full rounded bg-white dark:bg-gray-900 shadow divide-y divide-gray-200 dark:divide-gray-700">
        <div class="px-4 py-3">
          <USelectMenu class="w-fit" v-slot="{ open }" v-model="selectedColumns" :options="columns" multiple>
            <UButton color="gray" class="flex-1 justify-between">
              Spalten auswählen

              <UIcon name="i-heroicons-chevron-right-20-solid" class="w-5 h-5 transition-transform text-gray-400 dark:text-gray-500" :class="[open && 'transform rotate-90']" />
            </UButton>
          </USelectMenu>
        </div>
        <UTable
          :loading="loadingSellerOffers"
          :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Lade Angebote...' }"
          :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'Kein Angebot gefunden.' }"
          class="w-full"
          :rows="sellerOffers !== null ? sellerOffers.results : []"
          :columns="selectedColumns"
        >
          <template #seller-data="{ row }">
            <UButton color="gray" variant="ghost" class="-my-1.5 !text-inherit" :to="`/fv/sellers/${row.seller.id}`">{{ row.seller.matriculationNumber }} &middot; {{ row.seller.fullName }}</UButton>
          </template>

          <template #member-data="{ row }">
            <UButton color="gray" variant="ghost" class="-my-1.5 !text-inherit" :to="`/fv/members/${row.member.id}`">{{ row.member.username }}</UButton>
          </template>

          <template #active-data="{ row }">
            <div v-if="row.active"><UIcon name="i-heroicons-check-circle-20-solid" class="text-lg text-green-600" /></div>
            <div v-else><UIcon name="i-heroicons-x-circle-20-solid" class="text-lg text-orange-600" /></div>
          </template>

          <template #marked-data="{ row }">
            <UIcon v-if="row.marked" name="i-heroicons-paint-brush-20-solid" class="text-lg text-sky-600" />
            <span v-else></span>
          </template>

          <template #createdAt-data="{ row }">
            <span>{{ formatDate(row.createdAt) }}</span>
          </template>

          <template #modified-data="{ row }">
            <span>{{ formatDate(row.modified) }}</span>
          </template>

          <template #price-data="{ row }">
            <div class="text-right">{{ formatPrice(row.price) }}</div>
          </template>
        </UTable>
      </div>
      <div class="w-full flex flex-row justify-between text-gray-700 dark:text-gray-300">
        <div class="inline-flex items-center gap-x-2">
          <div>Seitengröße</div>
          <USelectMenu v-model="itemsPerPage" :options="pageSizes.map(size => size.toString())" />
        </div>
        <UPagination v-model="currentPage" :page-count="Number(itemsPerPage)" :total="sellerOffers !== null ? sellerOffers.count : 0" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Member } from '~/interfaces/Member';
import type { Offer } from '~/interfaces/Offer';
import type { Page } from '~/interfaces/Page';
import type { Seller } from '~/interfaces/Seller';
import { formatDate, formatPrice } from '~/utils/utils';

definePageMeta
({
  layout: 'protected',
  validate: async (route) => {
    // Check if the id is made up of digits
    return typeof route.params.id === 'string' && /^\d+$/.test(route.params.id)
  }
})

const columns = [
  //{ key: 'id', label: 'ID' },
  { key: 'createdAt', label: 'Erstellt' },
  { key: 'active', label: 'Aktiv' },
  { key: 'marked', label: 'Beschriftet' },
  { key: 'location', label: 'Ort' },
  { key: 'member', label: 'FV-Mitglied' },
  { key: 'price', label: 'Preis', class: 'text-right' },
  //{ key: 'modified', label: 'Aktualisiert' },
];

const { token } = useAuth()
const route = useRoute()
const editHistoryModal = ref(false)
const currentPage = ref(1)
const pageSizes = [5, 10, 20, 50]
const itemsPerPage = ref(pageSizes[1])
const searchInput = ref('')
const selectedColumns = ref([...columns])
const member = ref<Member>({
  id: 1,
  username: 'max.mustermann',
  email: '',
});

const fetchParams = computed(() => ({
  limit: itemsPerPage.value,
  offset: (currentPage.value - 1) * itemsPerPage.value,
  search: searchInput.value,
  seller: route.params.id,
}));

const { data: seller } = useFetch<Seller>(useRuntimeConfig().public.apiUrl + '/sellers/' + route.params.id, {
  headers: {
    Authorization: `${token.value}`,
  },
  onResponseError: () => {
    console.log('Seller not found');
  },
});

const { data: sellerOffers, pending: loadingSellerOffers } = useFetch<Page<Offer>>(useRuntimeConfig().public.apiUrl + '/offers', {
  headers: {
    Authorization: `${token.value}`,
  },
  params: fetchParams,
});
</script>
