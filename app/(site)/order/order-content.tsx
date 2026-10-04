'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { MenuItem, CartItem } from '@/lib/types'
import { submitOrder as submitOrderAction } from './actions'

export default function OrderContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const table = searchParams.get('table')
  const token = searchParams.get('token')

  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const supabase = createClient()

  useEffect(() => {
    loadMenu()
  }, [])

  async function loadMenu() {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('available', true)
        .order('category', { ascending: true })

      if (error) throw error
      setMenuItems(data || [])
    } catch (error) {
      console.error('Failed to load menu:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', ...new Set(menuItems.map(item => item.category))]
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory)

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
      return updated.filter(item => item.quantity > 0)
    })
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  async function submitOrder() {
    if (!table || !token || cart.length === 0) return

    setSubmitting(true)
    try {
      const result = await submitOrderAction({
        tableId: table,
        items: cart,
        total: cartTotal,
      })

      if (!result.success || !result.orderId) {
        throw new Error(result.error ?? 'Failed to submit order')
      }

      router.push(`/tracking/${result.orderId}`)
    } catch (error) {
      console.error('Order failed:', error)
      alert('មានបញ្ហា! សូមព្យាយាមម្តងទៀត')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-amber-700">កំពុងផ្ទុក...</div>
      </div>
    )
  }

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-amber-900">ម៉ឺនុយ Menu</h1>
        <p className="text-sm text-gray-600">តុ {table}</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto mb-6 pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-700 hover:bg-amber-100'
            }`}
          >
            {cat === 'all' ? 'ទាំងអស់' : cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name_km}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{item.name_km}</h3>
              <p className="text-sm text-gray-600">{item.name_en}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-lg font-bold text-amber-700">
                  ${item.price.toFixed(2)}
                </span>
                <button
                  onClick={() => addToCart(item)}
                  className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <button
          onClick={() => setShowCart(!showCart)}
          className="fixed bottom-6 right-6 bg-amber-600 text-white rounded-full p-4 shadow-2xl hover:bg-amber-700 transition-all z-50"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {cartCount}
          </span>
        </button>
      )}

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowCart(false)}>
          <div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">កន្ត្រក Cart</h2>
            
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-4 mb-4 pb-4 border-b">
                <div className="flex-1">
                  <p className="font-semibold">{item.name_km}</p>
                  <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 bg-gray-200 rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 bg-amber-200 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 bg-red-100 text-red-600 rounded ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between text-xl font-bold mb-4">
                <span>សរុប Total</span>
                <span className="text-amber-700">${cartTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={submitOrder}
                disabled={submitting}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition-colors"
              >
                {submitting ? 'កំពុងដាក់...' : 'ដាក់ការកុម្ម៉ង់'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
