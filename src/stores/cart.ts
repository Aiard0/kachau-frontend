import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/api'

export interface LocalCartItem {
  product: Product
  quantity: number
}

const CART_STORAGE_KEY = 'kachau_cart'

function loadCartFromStorage(): LocalCartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
  }
  return []
}

function saveCartToStorage(items: LocalCartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<LocalCartItem[]>(loadCartFromStorage())

  const totalItems = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  )

  function addItem(product: Product, quantity: number = 1) {
    const existing = items.value.find((i) => i.product.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ product, quantity })
    }
    saveCartToStorage(items.value)
  }

  function removeItem(productId: number) {
    const index = items.value.findIndex((i) => i.product.id === productId)
    if (index !== -1) {
      items.value.splice(index, 1)
      saveCartToStorage(items.value)
    }
  }

  function updateQuantity(productId: number, quantity: number) {
    const item = items.value.find((i) => i.product.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
      } else {
        item.quantity = quantity
        saveCartToStorage(items.value)
      }
    }
  }

  function clearCart() {
    items.value = []
    saveCartToStorage(items.value)
  }

  return {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
})
