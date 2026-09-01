<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { api, type ApiError } from '@/api'
import { ArrowLeft, Trash2, Eye, ShoppingBag, Truck, CheckCircle } from '@lucide/vue'
import { formatPrice } from '@/utils/format'

const router = useRouter()
const cart = useCartStore()
const auth = useAuthStore()
const checkoutSuccess = ref(false)
const loading = ref(false)
const error = ref('')

function goToProduct(id: number) {
  router.push(`/product/${id}`)
}

function goBack() {
  router.push('/')
}

async function handleCheckout() {
  if (!auth.isAuthenticated || !auth.user) {
    router.push('/login')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const items = cart.items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }))

    await api.checkout(auth.user.id, items)
    cart.clearCart()
    checkoutSuccess.value = true
  } catch (e) {
    error.value = (e as ApiError).messages?.[0] || 'Erro ao finalizar compra'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-gray-900 shadow">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <button @click="goBack" class="text-white hover:text-gray-300 flex items-center gap-1">
          <ArrowLeft :size="18" />
          Continuar Comprando
        </button>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Carrinho de Compras</h1>

      <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
        <Truck :size="24" class="text-green-600" />
        <p class="text-green-800 font-medium">Frete grátis para todo o Brasil!</p>
      </div>

      <div v-if="checkoutSuccess" class="text-center py-10">
        <CheckCircle :size="64" class="mx-auto text-green-600 mb-4" />
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Pedido realizado com sucesso!</h2>
        <p class="text-gray-600 mb-4">Você receberá um email com os detalhes do seu pedido.</p>
        <button
          @click="goBack"
          class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Continuar Comprando
        </button>
      </div>

      <div v-else-if="!auth.isAuthenticated" class="text-center py-10">
        <p class="text-gray-600 mb-4">Faça login para fazer pedidos</p>
        <button
          @click="router.push('/login')"
          class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>
      </div>

      <div v-else-if="cart.items.length === 0" class="text-center py-10">
        <p class="text-gray-600 mb-4">Seu carrinho está vazio</p>
        <button
          @click="goBack"
          class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center gap-2 mx-auto"
        >
          <ShoppingBag :size="18" />
          Ver Produtos
        </button>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cart.items"
            :key="item.product.id"
            class="bg-white rounded-lg shadow p-4 flex gap-4"
          >
            <img
              :src="item.product.imageUrl"
              :alt="item.product.name"
              class="w-24 h-24 object-cover rounded"
            />
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900">{{ item.product.name }}</h3>
              <p class="text-gray-600 text-sm">
                {{ item.product.description }}
              </p>
              <p class="font-bold text-gray-900 mt-2">
                R${{ formatPrice(item.product.price) }}
              </p>
              <div class="flex items-center gap-4 mt-2">
                <div class="flex items-center gap-2">
                  <button
                    @click="cart.updateQuantity(item.product.id, item.quantity - 1)"
                    class="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span>{{ item.quantity }}</span>
                  <button
                    @click="cart.updateQuantity(item.product.id, item.quantity + 1)"
                    class="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
                <button
                  @click="cart.removeItem(item.product.id)"
                  class="text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <Trash2 :size="16" />
                  Remover
                </button>
                <button
                  @click="goToProduct(item.product.id)"
                  class="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Eye :size="16" />
                  Ver
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 h-fit">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Resumo</h2>
          <div v-if="error" class="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
            {{ error }}
          </div>
          <div class="space-y-2 text-gray-600">
            <div class="flex justify-between">
              <span>Itens:</span>
              <span>{{ cart.totalItems }}</span>
            </div>
            <div class="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t">
              <span>Total:</span>
              <span>R${{ formatPrice(cart.totalPrice) }}</span>
            </div>
          </div>
          <button
            @click="handleCheckout"
            :disabled="loading"
            class="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {{ loading ? 'Processando...' : 'Finalizar Compra' }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
