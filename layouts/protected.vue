<template>
	<div class="min-h-dvh container mx-auto flex flex-col items-center px-4">
		<header class="w-full flex justify-between py-2">
			<div class="text-primary-900 dark:text-primary-100 text-xl flex items-center gap-x-2"><UIcon name="i-heroicons-scale" /><span>FV Jus</span></div>
			<div><UButton color="gray" variant="ghost" @click="authStore.logout">Logout</UButton></div>
		</header>
		<div class="flex-grow w-full flex items-center justify-center">
			<slot></slot>
		</div>
		<Footer />
	</div>
</template>

<script setup>
const authStore = useAuthStore()
</script>