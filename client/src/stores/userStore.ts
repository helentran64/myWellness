import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const isLoggedOut = ref(true)
  const user = ref<null | { username: string; email: string }> (null)

  function login(userData: { username: string; email: string }) {
    isLoggedIn.value = true
    isLoggedOut.value = false
    user.value = userData
  }

  function logout() {
    isLoggedIn.value = false
    isLoggedOut.value = true
    user.value = null
  }

  return { isLoggedIn, isLoggedOut, user, login, logout }
}, 
// @ts-ignore
{ persist: true }
)