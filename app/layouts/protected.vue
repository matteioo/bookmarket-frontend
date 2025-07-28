<template>
  <div>
    <div class="min-h-dvh container mx-auto flex flex-col items-center px-4">
      <header class="grow-0 w-full flex items-center justify-between py-4 md:py-2">
        <NuxtLink to="/fv" class="flex items-center gap-x-2 text-xl text-primary-900 dark:text-primary-100">
          <UIcon name="i-heroicons-circle-stack" />
          <div class="inline-flex">Bücherbörse<span class="hidden lg:block">&nbsp;@ FVJus</span></div>
        </NuxtLink>
        <div class="font-medium hidden md:block">
          <UNavigationMenu orientation="horizontal" :items="links" />
        </div>
        <div class="md:hidden">
          <UButton color="neutral" variant="outline" icon="i-lucide-menu" @click="slideoverOpen = true" />
        </div>
      </header>
      <div class="grow w-full flex flex-col m-2">
        <slot />
      </div>
      <div class="grow-0">
        <Footer />
      </div>
    </div>

    <USlideover
      v-model:open="slideoverOpen"
      side="left"
      :ui="{ overlay: 'md:hidden' }"
      class="md:hidden"
    >
      <template #header>
        <div class="w-full flex items-center justify-between">
          <NuxtLink to="/fv" class="flex items-center gap-x-2 text-xl text-primary-900 dark:text-primary-100" @click="slideoverOpen = false">
            <UIcon name="i-heroicons-circle-stack" />
            <div class="inline-flex">Bücherbörse<span class="hidden lg:block">&nbsp;@ FVJus</span></div>
          </NuxtLink>
          <UButton icon="i-lucide-x" color="neutral" variant="ghost" @click="slideoverOpen = false" />
        </div>
      </template>
      <template #body>
        <div class="h-full">
          <UNavigationMenu orientation="vertical" :items="links" @click="slideoverOpen = false" />
        </div>
      </template>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '#ui/types'

const { signOut } = useAuth()

const logoutAndRedirect = async () => {
  await signOut({ callbackUrl: '/login' })
}

const slideoverOpen = ref(false)
const links = ref<NavigationMenuItem[]>([{
  label: 'Suchen',
  to: '/fv/search',
  icon: 'i-heroicons-magnifying-glass',
}, {
  label: 'Verkaufen',
  to: '/fv/sell',
  icon: 'i-heroicons-shopping-cart',
}, {
  label: 'Angebote',
  to: '/fv/offers',
  icon: 'i-heroicons-tag',
}, {
  label: 'Verkäufer:innen',
  to: '/fv/sellers',
  icon: 'i-heroicons-user-group',
}, {
  label: 'Bücher',
  to: '/fv/books',
  icon: 'i-lucide-book-copy',
}, {
  label: 'Logout',
  class: 'cursor-pointer',
  onSelect: logoutAndRedirect
}])
</script>