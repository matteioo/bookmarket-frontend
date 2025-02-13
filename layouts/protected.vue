<template>
  <div class="min-h-dvh container mx-auto flex flex-col items-center px-4">
    <header class="flex-grow-0 w-full flex justify-between py-2">
      <NuxtLink to="/fv" class="flex items-center gap-x-2 text-xl text-primary-900 dark:text-primary-100">
        <UIcon class="hidden lg:block" name="i-heroicons-circle-stack" />
        <div class="inline-flex">Bücherbörse<span class="hidden lg:block">&nbsp;@ FVJus</span></div>
      </NuxtLink>
      <div class="font-medium hidden md:block">
        <UHorizontalNavigation :links="links" />
      </div>
    </header>
    <div class="flex-grow w-full flex flex-col m-2">
      <slot />
    </div>
    <div class="flex-grow-0">
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
const { signOut } = useAuth()
const router = useRouter()

const logoutAndRedirect = async () => {
  // TODO: Error fetching signOut endpoint (default /logout because not set), even though we simply want to remove the token as logout action
  await signOut({ callbackUrl: '/login' })
  router.push('/login')
};

const links = [{
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
  label: 'Logout',
  click: logoutAndRedirect
}]
</script>