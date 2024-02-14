import { defineStore } from "pinia";

interface AuthState {
	user: User | null;
	token: string | null;
	refreshToken: string | null;
}

export const useAuthStore = defineStore('auth', {
	state: (): AuthState => {
		return {
			user: null,
			token: null,
			refreshToken: null,
		}
	},
	actions: {
		setUser(user: User) {
			this.user = user;
		},
		setToken(token: string) {
			this.token = token;
      localStorage.setItem('authToken', token)
		},
		setRefreshToken(refreshToken: string) {
			this.refreshToken = refreshToken;
			localStorage.setItem('authRefreshToken', refreshToken)
		},
		logout() {
			this.user = null;
			this.token = null;
			this.refreshToken = null;
			localStorage.removeItem('authToken');
			localStorage.removeItem('authRefreshToken');

			// Redirect to the start page
			const router = useRouter();
			router.push('/');
		},
    async initializeAuth() {
			if (typeof window === 'undefined') return
			
      const token = localStorage.getItem('authToken')
			const refreshToken = localStorage.getItem('authRefreshToken')
      if (token && refreshToken) {
				// TODO: check if tokens are still valid

        this.setToken(token)
				this.setRefreshToken(refreshToken)
				await this.loadUserDetails()
      } else {
				this.logout()
			}
    },
		async login(username: string, password: string) {
			const response = await fetch('http://localhost:8000/v1/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});
			const data: TokenResponse = await response.json();

			if (response.ok && data.access && data.refresh) {
				this.setToken(data.access);
				this.setRefreshToken(data.refresh);

				await this.loadUserDetails();

				// Redirect to the start page
				const router = useRouter();
				router.push('/fv');
			} else {
				throw new Error('Login fehlgeschlagen. Bitte versuche es erneut.');
			}
		},
		async loadUserDetails() {
			const userResponse = await fetch('http://localhost:8000/v1/api/auth/user', {
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${this.token}`,
					},
				});

				if (userResponse.ok) {
					const user: User = await userResponse.json();
					this.setUser(user);
				} else {
					this.logout();
				}
		},
	}
})

interface User {
	id: number;
	username: string;
	email: string;
}

interface TokenResponse {
	refresh: string;
	access: string;
}