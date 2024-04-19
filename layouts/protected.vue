<template>
  <div class="min-h-dvh container mx-auto flex flex-col items-center px-4">
    <header class="flex-grow-0 w-full flex justify-between py-2">
      <NuxtLink to="/fv" class="text-primary-900 dark:text-primary-100 text-xl flex items-center gap-x-2"><UIcon name="i-heroicons-scale" /><span>FV Jus</span></NuxtLink>
      <div class="font-medium">
        <UButton color="gray" variant="ghost" size="lg" to="/fv/offers"><span>Angebote</span></UButton>
        <UButton color="gray" variant="ghost" size="lg" to="/fv/sellers"><span>Verkäufer:innen</span></UButton>
        <UButton color="gray" variant="ghost" size="lg" to="/fv/search"><span>Suchen</span></UButton>
        <UButton color="gray" variant="ghost" size="lg" @click="logoutAndRedirect" icon="i-heroicons-arrow-right-start-on-rectangle" trailing>Logout</UButton>
      </div>
    </header>
    <div class="flex-grow w-full flex flex-col m-2">
      <slot></slot>
    </div>
    <div class="flex-grow-0">
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
const { signOut } = useAuth();

const logoutAndRedirect = async () => {
  await signOut({ callbackUrl: '/login' })
};
</script>