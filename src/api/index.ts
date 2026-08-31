const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  email: string
  token: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
  createdAt: string
  updatedAt: string
}

export interface ProductCreate {
  name: string
  description: string
  price: number
  imageUrl: string
}

export interface OrderItemResponseDTO {
  id: number
  productName: string
  quantity: number
  unitPrice: number
}

export interface OrderResponseDTO {
  id: string
  buyerName: string
  buyerEmail: string
  items: OrderItemResponseDTO[]
  totalPrice: number
  createdAt: string
  updatedAt: string
}

export type Order = OrderResponseDTO
export type OrderItem = OrderItemResponseDTO

export interface CheckoutItem {
  productId: number
  quantity: number
}

export interface ApiError {
  timestamp: string
  status: number
  error: string
  messages: string[]
  path: string
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token')

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}`
    try {
      const error: ApiError = await response.json()
      if (error.messages && error.messages.length > 0 && error.messages[0]) {
        errorMessage = error.messages[0]
      }
    } catch {
    }
    const err: ApiError = {
      timestamp: '',
      status: response.status,
      error: response.statusText,
      messages: [errorMessage],
      path,
    }
    throw err
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

export const api = {
  login: (data: LoginRequest) =>
    request<LoginResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: RegisterRequest) =>
    request<User>('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getProducts: () => request<Product[]>('/products'),

  getProduct: (id: number) => request<Product>(`/products/${id}`),

  createProduct: (data: ProductCreate) =>
    request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getUsers: () => request<User[]>('/users'),

  getUser: (id: string) => request<User>(`/users/${id}`),

  testAuth: () =>
    request<string>('/test'),

  getOrders: () => request<Order[]>('/orders'),

  getOrder: (id: string) => request<Order>(`/orders/${id}`),

  getOrdersByBuyer: (buyerId: string) => request<Order[]>(`/orders/buyer/${buyerId}`),

  checkout: (buyerId: string, items: CheckoutItem[]) =>
    request<Order>(`/checkout/buyer/${buyerId}`, {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),
}
