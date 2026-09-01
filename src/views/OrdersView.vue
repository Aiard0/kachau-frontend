<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api, type Order } from '@/api'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { ArrowLeft, Package, LogOut, ShoppingCart as ShoppingCartIcon, LogIn, UserPlus, User, ArrowUpDown } from '@lucide/vue'
import { triggerProductsReload } from '@/events'
import { formatPrice } from '@/utils/format'

const router = useRouter()
const auth = useAuthStore()
const cart = useCartStore()
const orders = ref<Order[]>([])
const loading = ref(true)
const error = ref('')
const sortOrder = ref<'newest' | 'oldest'>('newest')

const sortedOrders = computed(() => {
  return [...orders.value].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return sortOrder.value === 'newest' ? dateB - dateA : dateA - dateB
  })
})

onMounted(async () => {
  if (!auth.isAuthenticated || !auth.user) {
    loading.value = false
    return
  }

  try {
    orders.value = await api.getOrdersByBuyer(auth.user.id)
  } catch {
    error.value = 'Erro ao carregar pedidos'
  } finally {
    loading.value = false
  }
})

function goBack() {
  router.push('/')
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
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
            <ShoppingCartIcon :size="20" />
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
        <button @click="goBack" class="text-blue-600 hover:text-blue-800 flex items-center gap-1">
          <ArrowLeft :size="18" />
          Voltar para produtos
        </button>
      </div>

      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Meus Pedidos</h1>
        <div class="flex items-center gap-2">
          <ArrowUpDown :size="18" class="text-gray-500" />
          <select
            v-model="sortOrder"
            class="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Mais recente</option>
            <option value="oldest">Mais antigo</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="text-center py-10">Carregando...</div>

      <div v-else-if="!auth.isAuthenticated" class="text-center py-10">
        <p class="text-gray-600 mb-4">Faça login para ver seus pedidos</p>
        <button
          @click="router.push('/login')"
          class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>
      </div>

      <div v-else-if="error" class="text-red-600 text-center py-10">
        {{ error }}
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-10">
        <Package :size="64" class="mx-auto text-gray-400 mb-4" />
        <p class="text-gray-600 mb-4">Você ainda não fez nenhum pedido</p>
        <button
          @click="goBack"
          class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Ver Produtos
        </button>
      </div>

      <div v-else class="space-y-6">
        <div
          v-for="order in sortedOrders"
          :key="order.id"
          class="bg-white rounded-lg shadow p-6"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <p class="text-sm text-gray-500">Pedido #{{ order.id.slice(0, 8) }}</p>
              <p class="text-sm text-gray-500">Data: {{ formatDate(order.createdAt) }}</p>
            </div>
            <div class="text-right">
              <p class="text-lg font-bold text-gray-900">
                R${{ formatPrice(order.totalPrice) }}
              </p>
            </div>
          </div>

          <div class="border-t pt-4">
            <p class="text-sm font-medium text-gray-700 mb-3">Itens:</p>
            <div class="space-y-3">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex items-center gap-4"
              >
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ item.productName }}</p>
                  <p class="text-sm text-gray-500">
                    R${{ formatPrice(item.unitPrice) }} x {{ item.quantity }}
                  </p>
                </div>
                <p class="font-medium text-gray-900">
                  R${{ formatPrice(item.unitPrice * item.quantity) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
