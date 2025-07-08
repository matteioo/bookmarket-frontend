<template>
  <div class="min-h-dvh container mx-auto flex flex-col items-center px-4">
    <header class="grow-0 w-full flex justify-between py-2">
      <NuxtLink to="/fv" class="flex items-center gap-x-2 text-xl text-primary-900 dark:text-primary-100">
        <UIcon class="hidden lg:block" name="i-heroicons-circle-stack" />
        <div class="inline-flex">Bücherbörse<span class="hidden lg:block">&nbsp;@ FVJus</span></div>
      </NuxtLink>
      <div class="font-medium hidden md:block">
        <UNavigationMenu orientation="horizontal" :items="links" />
      </div>
    </header>
    <div class="grow w-full flex flex-col m-2">
      <slot />
    </div>
    <div class="grow-0">
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '#ui/types'

const { signOut } = useAuth()

const logoutAndRedirect = async () => {
  await signOut({ callbackUrl: '/login' })
};

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