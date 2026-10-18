type BrandLogoProps = {
  size?: 'sm' | 'md'
}

export function BrandLogo({ size = 'md' }: BrandLogoProps) {
  const box = size === 'sm' ? 'w-7 h-7 rounded-md' : 'w-9 h-9 rounded-lg'
  const svg = size === 'sm' ? 14 : 20
  const stroke = size === 'sm' ? 3 : 2.5

  return (
    <div
      className={`${box} flex items-center justify-center flex-shrink-0`}
      style={{
        background: 'var(--primary)',
        boxShadow: size === 'md' ? '0 2px 8px rgba(200,145,58,0.35)' : undefined,
      }}
    >
      <svg width={svg} height={svg} viewBox="0 0 52 52" fill="none" aria-hidden="true">
        <path d="M10 16h24l-3 20H13L10 16z" stroke="#fff" strokeWidth={stroke} strokeLinejoin="round" />
        <path d="M34 20h4a4 4 0 0 1 0 8h-4" stroke="#fff" strokeWidth={stroke} strokeLinecap="round" />
        {size === 'md' && (
          <path d="M7 38h30" stroke="#fff" strokeWidth={stroke} strokeLinecap="round" />
        )}
      </svg>
    </div>
  )
}
