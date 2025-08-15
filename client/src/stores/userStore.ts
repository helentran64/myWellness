import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    isLoggedOut: true,
    user: null as null | { username: string; email: string; /* add more fields as needed */ },
  }),
  actions: {
    login(userData: { username: string; email: string }) {
      this.isLoggedIn = true
      this.isLoggedOut = false
      this.user = userData
    },
    logout() {
      this.isLoggedIn = false
      this.isLoggedOut = true
      this.user = null
    },
  },
})