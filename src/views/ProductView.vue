<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api, type Product } from '@/api'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { ShoppingCart, LogOut, User, LogIn, UserPlus, ArrowLeft } from '@lucide/vue'
import { triggerProductsReload } from '@/events'
import { formatPrice } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const auth = useAuthStore()

const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    product.value = await api.getProduct(id)
  } catch {
    error.value = 'Produto não encontrado'
  } finally {
    loading.value = false
  }
})

async function addToCart() {
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }
  if (product.value) {
    await cart.addItem(product.value)
  }
}

function goToCart() {
  router.push('/cart')
}

function logout() {
  auth.logout()
  router.push('/login')
}

function goHome() {
  triggerProductsReload()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-gray-900 shadow">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <span @click="goHome" class="text-2xl font-bold text-white hover:text-gray-300 cursor-pointer">
          Kachau<span class="text-blue-500">.</span>Store
        </span>
        <div class="flex items-center gap-4">
          <button
            @click="goToCart"
            class="relative text-gray-300 hover:text-white flex items-center gap-1"
          >
            <ShoppingCart :size="20" />
            Carrinho
            <span
              v-if="cart.totalItems > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ cart.totalItems }}
            </span>
          </button>
          <template v-if="auth.isAuthenticated">
            <router-link to="/orders" class="text-gray-300 hover:text-white flex items-center gap-1">
              <User :size="18" />
              {{ auth.user?.name }}
            </router-link>
            <button @click="logout" class="text-red-400 hover:text-red-300 flex items-center gap-1">
              <LogOut :size="18" />
              Sair
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="text-blue-400 hover:text-blue-300 flex items-center gap-1">
              <LogIn :size="18" />
              Entrar
            </router-link>
            <router-link
              to="/register"
              class="text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <UserPlus :size="18" />
              Cadastrar
            </router-link>
          </template>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-4">
        <router-link to="/" class="text-blue-600 hover:text-blue-800 flex items-center gap-1">
          <ArrowLeft :size="18" />
          Voltar para produtos
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-10">Carregando...</div>
      <div v-else-if="error" class="text-red-600 text-center py-10">
        {{ error }}
      </div>
      <div v-else-if="product" class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <img
            :src="product.imageUrl"
            :alt="product.name"
            class="w-full h-[500px] object-contain bg-gray-100 rounded-lg"
          />
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ product.name }}</h1>
            <p class="text-2xl font-bold text-gray-900 mt-4">
              R${{ formatPrice(product.price) }}
            </p>
            <p class="text-gray-600 mt-4">{{ product.description }}</p>
            <button
              @click="addToCart"
              class="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <ShoppingCart :size="20" />
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
