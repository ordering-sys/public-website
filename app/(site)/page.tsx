import Link from 'next/link'
import { Coffee, UtensilsCrossed } from 'lucide-react'

export default function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ table?: string; token?: string }>
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
      {/* Logo/Branding */}
      <div className="space-y-4">
        <div className="flex justify-center gap-2">
          <Coffee className="w-16 h-16 text-amber-700" />
          <UtensilsCrossed className="w-16 h-16 text-amber-700" />
        </div>
        <h1 className="text-4xl font-bold text-amber-900">
          សូមស្វាគមន៍
        </h1>
        <p className="text-lg text-amber-800">
          Welcome to Our Cafe
        </p>
      </div>

      {/* Description */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg max-w-md">
        <p className="text-gray-700 mb-6">
          កុម្ម៉ង់អាហារតាមរយៈ QR Code<br />
          Order food directly from your table
        </p>
        
        {/* CTA Button */}
        <StartOrderButton searchParams={searchParams} />
      </div>

      {/* Footer Info */}
      <p className="text-sm text-amber-700">
        📱 ស្កេន QR នៅលើតុដើម្បីចាប់ផ្តើម
      </p>
    </div>
  )
}

async function StartOrderButton({
  searchParams,
}: {
  searchParams: Promise<{ table?: string; token?: string }>
}) {
  const params = await searchParams
  const { table, token } = params

  // If QR params exist, link to order page
  if (table && token) {
    return (
      <Link
        href={`/order?table=${table}&token=${token}`}
        className="block w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-4 px-8 rounded-xl transition-colors shadow-lg"
      >
        ចាប់ផ្តើមកុម្ម៉ង់
        <span className="block text-sm font-normal mt-1">Start Order</span>
      </Link>
    )
  }

  // Otherwise, show scan QR prompt
  return (
    <div className="text-amber-700 py-4 px-8 border-2 border-amber-300 rounded-xl bg-amber-50">
      សូមស្កេន QR Code នៅលើតុ
      <span className="block text-sm mt-1">Please scan QR code at your table</span>
    </div>
  )
}
