<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { ApiError } from '@/api'
import { LogIn, ArrowLeft } from '@lucide/vue'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true

  try {
    await auth.login(email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = (e as ApiError).messages?.[0] || 'Falha ao fazer login'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h2 class="text-2xl font-bold text-center mb-6">Entrar</h2>

      <div v-if="error" class="bg-red-100 text-red-700 p-3 rounded mb-4">
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Senha</label
          >
          <input
            v-model="password"
            type="password"
            required
            class="mt-1 w-full px-3 py-2 border rounded-md"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <LogIn :size="18" />
          {{ loading ? 'Carregando...' : 'Entrar' }}
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-600">
        Não tem uma conta?
        <router-link to="/register" class="text-blue-600 hover:text-blue-800">
          Cadastre-se
        </router-link>
      </p>

      <p class="mt-2 text-center text-sm text-gray-600">
        <router-link to="/" class="text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1">
          <ArrowLeft :size="16" />
          Voltar para a loja
        </router-link>
      </p>
    </div>
  </div>
</template>
