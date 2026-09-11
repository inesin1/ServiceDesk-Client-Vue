import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CurrentUser {
  id: number
  name: string
  role: { id: number; name: string }
  token: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<CurrentUser | null>(null)

  const isAuthenticated = computed(() => user.value !== null)

  function setUser(next: Omit<CurrentUser, 'token'>, token: string) {
    user.value = { ...next, token }
  }

  function logout() {
    user.value = null
  }

  return { user, isAuthenticated, setUser, logout }
})
