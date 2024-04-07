export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  try {
    const target = useRuntimeConfig().myProxyUrl;

    authStore.fetchUser();

    const response = await fetch(`${target}/auth/user`)
    if (response.ok) {
      const responseUser = await response.json();
      console.log('middleware foo', responseUser);

      authStore.fetchUser();
      //authStore.user = responseUser;
    } else {
      throw new Error('Failed to fetch user data' + response.status + ' ' + response.statusText);
    }
  } catch (error) {
    console.error(error);
    navigateTo('/login');
  }

  function isTokenValid(): boolean {
    if (authStore.member === null) {
      return false;
    }

    const tokenExpiration = authStore.getTokenExpiration ?? 0;

    return tokenExpiration > Date.now() / 1000;
  }
});