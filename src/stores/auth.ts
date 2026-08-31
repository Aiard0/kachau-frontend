import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api, type User } from '@/api'

const USER_KEY = 'kachau_user'

export const useAuthStore = defineStore('auth', () => {
  const storedUser = localStorage.getItem(USER_KEY)
  const user = ref<User | null>(storedUser ? JSON.parse(storedUser) : null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  function setAuth(userData: User, authToken: string) {
    user.value = userData
    token.value = authToken
    localStorage.setItem('token', authToken)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
  }

  function clearAuth() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem(USER_KEY)
  }

  async function login(email: string, password: string) {
    const response = await api.login({ email, password })
    const users = await api.getUsers()
    const loggedUser = users.find((u) => u.email === email)
    if (loggedUser) {
      setAuth(loggedUser, response.token)
    }
    return response
  }

  async function register(name: string, email: string, password: string) {
    const newUser = await api.register({ name, email, password })
    return newUser
  }

  function logout() {
    clearAuth()
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
  }
})
