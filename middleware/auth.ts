export default defineNuxtRouteMiddleware(async (to, from) => {
	const authStore = useAuthStore()

	// Initialize or rehydrate the auth store
	authStore.initializeAuth()

	if (!authStore.token && !authStore.refreshToken) {
		return navigateTo('/login')
	}
})