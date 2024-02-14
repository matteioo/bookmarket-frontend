<template>
	<div>
		<p>Logged in as: {{ user.username }} with ID {{ user.id }} and email {{ user.email }}</p>
	</div>
</template>

<script setup>
definePageMeta({
  layout: "protected",
	middleware: 'auth',
});

const authStore = useAuthStore()
const user = ref(authStore.user)
</script>