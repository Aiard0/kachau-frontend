<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { api, type Product } from '@/api'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ShoppingCart, LogOut, User, LogIn, UserPlus, Search } from '@lucide/vue'
import { onProductsReload } from '@/events'
import { formatPrice } from '@/utils/format'

const router = useRouter()
const cart = useCartStore()
const auth = useAuthStore()
const products = ref<Product[]>([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')

const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return products.value
  const query = searchQuery.value.toLowerCase()
  return products.value.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
  )
})

async function loadProducts() {
  loading.value = true
  try {
    products.value = await api.getProducts()
  } catch {
    error.value = 'Falha ao carregar produtos'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProducts()
  const unsubscribe = onProductsReload(loadProducts)
  onUnmounted(() => unsubscribe())
})

async function addToCart(product: Product) {
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }
  await cart.addItem(product)
}

function goToProduct(id: number) {
  router.push(`/product/${id}`)
}

function goToCart() {
  router.push('/cart')
}

function logout() {
  auth.logout()
  router.push('/login')
}

function reloadProducts() {
  loadProducts()
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-gray-900 shadow">
      <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <router-link to="/" class="text-2xl font-bold text-white hover:text-gray-300" @click="reloadProducts">
          Kachau<span class="text-blue-500">.</span>Store
        </router-link>
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
      <div class="mb-6">
        <div class="relative">
          <Search :size="20" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar produtos..."
            class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <p v-if="!loading && !error && products.length > 0" class="text-sm text-gray-500 mt-2">
          Exibindo {{ filteredProducts.length }} de {{ products.length }} itens
        </p>
      </div>

      <div v-if="loading" class="text-center py-10">Carregando...</div>
      <div v-else-if="error" class="text-red-600 text-center py-10">
        {{ error }}
      </div>
      <div v-else-if="filteredProducts.length === 0" class="text-center py-10 text-gray-600">
        <span v-if="searchQuery">Nenhum produto encontrado para "{{ searchQuery }}"</span>
        <span v-else>Nenhum produto disponível</span>
      </div>
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-white rounded-lg shadow overflow-hidden"
        >
          <div class="aspect-square">
            <img
              :src="product.imageUrl"
              :alt="product.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">
              {{ product.name }}
            </h3>
            <p class="text-xl font-bold text-gray-900 mt-2">
              R${{ formatPrice(product.price) }}
            </p>
            <div class="mt-4 flex gap-2">
              <button
                @click="goToProduct(product.id)"
                class="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
              >
                Ver
              </button>
              <button
                @click="addToCart(product)"
                class="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
