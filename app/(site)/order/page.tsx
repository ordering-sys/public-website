import { Suspense } from 'react'
import OrderContent from '../../../components/site/order/OrderContent'

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div role="status" className="flex items-center justify-center min-h-[60vh]">
          <div className="text-amber-700">កំពុងផ្ទុក...</div>
        </div>
      }
    >
      <OrderContent />
    </Suspense>
  )
}
