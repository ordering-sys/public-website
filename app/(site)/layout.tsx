export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <main className="container mx-auto max-w-2xl px-4 py-6">
        {children}
      </main>
    </div>
  )
}
