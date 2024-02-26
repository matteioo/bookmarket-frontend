import { jwtDecode } from 'jwt-decode'
import type { Member } from '~/interfaces/Member';

interface AuthState {
  member: Member | null;
  token: string | null;
  refreshToken: string | null;
}

interface TokenResponse {
  refresh: string;
  access: string;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    return {
      member: null,
      token: null,
      refreshToken: null
    }
  },
  getters: {
    getTokenExpiration: (state): number | null => {
      if (!state.token || !state.refreshToken) {
        return null;
      }

      try {
        const decodedToken: any = jwtDecode(state.token);
        return decodedToken.exp;
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
      return null;
    },
    getMember: (state): Member | null => {
      return state.member;
    }
  },
  actions: {
    async login(username: string, password: string) {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const tokenResponse: TokenResponse = await response.json();

        const authStore = useAuthStore();
        authStore.token = tokenResponse.access;
        authStore.refreshToken = tokenResponse.refresh;

        await authStore.fetchUser();
      } else {
        throw new Error('Login fehlgeschlagen. Bitte versuche es erneut.');
      }
    },
    async fetchUser() {
      let response = await fetch('/api/auth/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (response.ok) {
        const member: Member = await response.json();
        this.member = member;
      } else {
        throw new Error('Member konnte nicht geladen werden.');
      }
    },
    async initializeStore() {
      if (this.getTokenExpiration && this.getTokenExpiration > Date.now() / 1000 && this.refreshToken) {
        await this.fetchUser();
      } else {
        this.logout();
      }
    },
    logout() {
      this.member = null;
      this.token = null;
      this.refreshToken = null;
    },
  }
});