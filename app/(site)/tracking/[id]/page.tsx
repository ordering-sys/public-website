'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle, Clock, ChefHat, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ORDER_STATUS_LABELS, type Order } from '@/lib/types'

export default function TrackingPage() {
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (!orderId) return

    let cancelled = false

    async function loadOrder() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single()

        if (error) throw error
        if (!cancelled) setOrder(data)
      } catch (error) {
        console.error('Failed to load order:', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadOrder()

    const channel = supabase
      .channel(`order_tracking_${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder(payload.new as Order)
        }
      )
      .subscribe()

    return () => {
      cancelled = true
      void supabase.removeChannel(channel)
    }
  }, [orderId, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-amber-700">កំពុងផ្ទុក...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">មិនឃើញការកុម្ម៉ង់</p>
      </div>
    )
  }

  const statusInfo = ORDER_STATUS_LABELS[order.status]

  return (
    <div className="max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-amber-900 mb-2">
          ការកុម្ម៉ង់ #{order.id.slice(0, 8)}
        </h1>
        <p className="text-sm text-gray-600">
          {new Date(order.created_at).toLocaleString('km-KH')}
        </p>
      </div>

      {/* Status Progress */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-center mb-6">
          <StatusIcon status={order.status} />
        </div>
        
        <div className={`text-center p-4 rounded-xl mb-4 ${getStatusColor(order.status)}`}>
          <p className="text-2xl font-bold mb-1">{statusInfo.km}</p>
          <p className="text-sm">{statusInfo.en}</p>
        </div>

        {/* Progress Steps */}
        <div className="space-y-4">
          <Step 
            icon={<CheckCircle />} 
            label="កំពុងទទួល"
            active={order.status === 'pending'}
            completed={['preparing', 'ready', 'completed'].includes(order.status)}
          />
          <Step 
            icon={<ChefHat />} 
            label="កំពុងចម្អិន"
            active={order.status === 'preparing'}
            completed={['ready', 'completed'].includes(order.status)}
          />
          <Step 
            icon={<Sparkles />} 
            label="រួចរាល់"
            active={order.status === 'ready'}
            completed={order.status === 'completed'}
          />
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="font-bold text-lg mb-4">បញ្ជីកុម្ម៉ង់</h2>
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between py-2 border-b last:border-b-0">
            <div>
              <p className="font-semibold">{item.name_km}</p>
              <p className="text-sm text-gray-600">x{item.quantity}</p>
            </div>
            <p className="font-bold text-amber-700">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
        <div className="flex justify-between pt-4 mt-4 border-t font-bold text-lg">
          <span>សរុប</span>
          <span className="text-amber-700">${order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Call Waiter Button */}
      {order.status === 'ready' && (
        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors">
          📞 ហៅបុគ្គលិក Call Waiter
        </button>
      )}
    </div>
  )
}

function StatusIcon({ status }: { status: Order['status'] }) {
  const iconClass = "w-16 h-16"
  
  switch (status) {
    case 'pending':
      return <Clock className={`${iconClass} text-blue-500 animate-pulse`} />
    case 'preparing':
      return <ChefHat className={`${iconClass} text-yellow-500 animate-bounce`} />
    case 'ready':
      return <Sparkles className={`${iconClass} text-green-500`} />
    case 'completed':
      return <CheckCircle className={`${iconClass} text-gray-500`} />
    default:
      return <Clock className={iconClass} />
  }
}

function getStatusColor(status: Order['status']) {
  const colors = {
    pending: 'bg-blue-50 text-blue-700',
    preparing: 'bg-yellow-50 text-yellow-700',
    ready: 'bg-green-50 text-green-700',
    completed: 'bg-gray-50 text-gray-700',
    cancelled: 'bg-red-50 text-red-700'
  }
  return colors[status] || 'bg-gray-50'
}

function Step({ 
  icon, 
  label, 
  active, 
  completed 
}: { 
  icon: React.ReactNode
  label: string
  active: boolean
  completed: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-full ${
        completed ? 'bg-green-500 text-white' :
        active ? 'bg-amber-500 text-white' :
        'bg-gray-200 text-gray-400'
      }`}>
        {icon}
      </div>
      <span className={`font-semibold ${
        completed || active ? 'text-gray-900' : 'text-gray-400'
      }`}>
        {label}
      </span>
    </div>
  )
}
