<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Cafe QR Ordering System - Public Website (Customer-Facing)

## 🎯 Project Overview

This is a modern QR-code based restaurant ordering system for Cambodian cafes/restaurants. Customers scan QR codes at their tables to view menus and place orders directly from their mobile devices.

**Tech Stack:**
- **Framework:** Next.js 16.3.8 (App Router)
- **UI:** React 19, TailwindCSS 4, Lucide Icons
- **Backend:** Supabase (Database + Auth + Realtime)
- **Storage:** Cloudflare R2 (S3-compatible)
- **Notifications:** Telegram Bot API

---

## 📁 Project Structure

```
app/
├── (site)/                    # Customer-facing routes (public)
│   ├── layout.tsx             # Mobile-optimized theme & container
│   ├── page.tsx               # Welcome/Landing page
│   ├── order/
│   │   └── page.tsx           # Menu + Cart (?table=T1&token=xyz)
│   └── tracking/[id]/
│       └── page.tsx           # Live order tracking
│
├── (admin)/                   # Staff/Owner dashboard (protected)
│   ├── layout.tsx             # Admin sidebar & navbar
│   ├── dashboard/
│   │   ├── page.tsx           # Sales analytics
│   │   ├── kds/page.tsx       # Kitchen Display System (realtime)
│   │   ├── menu/page.tsx      # Menu management (CRUD)
│   │   └── tables/page.tsx    # Table & QR generation
│   └── login/page.tsx         # Staff authentication
│
├── api/
│   ├── upload-url/route.ts    # Generate presigned R2 URLs
│   └── webhooks/telegram/route.ts  # Telegram bot callbacks
│
└── globals.css

components/
├── site/                      # Customer UI components
├── admin/                     # Admin UI components
└── ui/                        # Reusable primitives

lib/
├── supabase/
│   ├── client.ts              # Browser client (Client Components)
│   ├── server.ts              # Server client (Server Components/Actions)
│   └── admin.ts               # Service role (webhooks/background jobs)
├── r2.ts                      # Cloudflare R2 S3 operations
└── telegram.ts                # Telegram notification helpers
```

---

## 🚀 Phase 1: Public Website (Customer-Facing) - CURRENT FOCUS

### **Priority Tasks**

#### 1️⃣ **Landing Page** (`app/(site)/page.tsx`)
**Goal:** Welcome screen when customers first scan QR code

**Requirements:**
- Mobile-first responsive design (min-width: 320px)
- Khmer language support (Unicode fonts)
- Display cafe branding (logo, name, tagline)
- Auto-detect GPS location (optional, for multi-branch support)
- CTA button: "ចាប់ផ្តើមកុម្ម៉ង់" (Start Order) → redirects to `/order?table=T1&token=xyz`
- Loading states while validating QR token

**Design Notes:**
- Use warm, inviting colors (orange/brown cafe theme)
- Show food imagery in background (subtle overlay)
- Keep UI minimal - get users to menu quickly

**Dependencies:**
```tsx
// Validate table token via Supabase
const { data: table } = await supabase
  .from('tables')
  .select('*')
  .eq('token', token)
  .single()
```

---

#### 2️⃣ **Order Page** (`app/(site)/order/page.tsx`)
**Goal:** Browse menu, add items to cart, submit order

**URL Format:** `/order?table=T1&token=abc123xyz`

**Features:**
- **Menu Display:**
  - Fetch menu items from Supabase (`menu_items` table)
  - Category filters (ភេសជ្ជៈ, អាហារ, បង្អែម)
  - Card layout with image, name (Khmer + English), price
  - "Add to Cart" button with quantity picker

- **Shopping Cart:**
  - Sticky bottom sheet showing total & item count
  - Expand to show full cart details
  - Edit quantities or remove items
  - Add special instructions per item

- **Order Submission:**
  - Insert into `orders` table with status `pending`
  - Link to `table_id` from URL params
  - Send Telegram notification to staff
  - Redirect to `/tracking/[order_id]`

**Database Schema (Reference):**
```sql
-- menu_items
id, name_km, name_en, description, price, category, image_url, available

-- orders
id, table_id, status, items (jsonb), total, created_at

-- tables
id, number, token, active
```

**State Management:**
```tsx
const [cart, setCart] = useState<CartItem[]>([])
const addToCart = (item: MenuItem, qty: number) => { ... }
```

---

#### 3️⃣ **Order Tracking** (`app/(site)/tracking/[id]/page.tsx`)
**Goal:** Real-time status updates after order submission

**Features:**
- Fetch order by ID from Supabase
- Subscribe to realtime updates:
  ```tsx
  supabase
    .channel('order_updates')
    .on('postgres_changes', 
      { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${id}` },
      (payload) => setOrder(payload.new)
    )
    .subscribe()
  ```

- **Status Flow:**
  - 🔵 `pending` → "កំពុងទទួល..." (Received)
  - 🟡 `preparing` → "កំពុងចម្អិន..." (Preparing)
  - 🟢 `ready` → "រួចរាល់! 🎉" (Ready to serve)
  - ⚪ `completed` → "ចប់សាច់" (Completed)

- Estimated time display (optional)
- "Call Waiter" button (sends Telegram alert)

---

### **Component Structure**

```
components/site/
├── MenuCard.tsx               # Single menu item display
├── CategoryFilter.tsx         # Tabs for filtering categories
├── CartSheet.tsx              # Bottom sheet cart UI
├── OrderStatusBadge.tsx       # Visual status indicator
└── GPSCheck.tsx               # Location verification (optional)
```

---

### **Styling Guidelines**

**Theme (TailwindCSS):**
```css
/* globals.css */
:root {
  --cafe-primary: #D97706;    /* Amber-600 */
  --cafe-secondary: #92400E;  /* Amber-900 */
  --cafe-bg: #FEF3C7;         /* Amber-50 */
}
```

**Mobile Optimization:**
- All buttons min-height: 48px (touch-friendly)
- Font sizes: 16px minimum (prevent zoom on iOS)
- Use `viewport` meta tag with `width=device-width`

**Khmer Typography:**
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;700&display=swap');

body {
  font-family: 'Noto Sans Khmer', system-ui, sans-serif;
}
```

---

### **API Integration Examples**

**Fetch Menu Items (Server Component):**
```tsx
// app/(site)/order/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function OrderPage({ searchParams }) {
  const supabase = await createClient()
  
  const { data: items } = await supabase
    .from('menu_items')
    .select('*')
    .eq('available', true)
    .order('category', { ascending: true })

  return <MenuGrid items={items} />
}
```

**Submit Order (Server Action):**
```tsx
// app/(site)/order/actions.ts
'use server'
import { createClient } from '@/lib/supabase/server'
import { sendTelegram } from '@/lib/telegram'

export async function submitOrder(formData: FormData) {
  const supabase = await createClient()
  
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      table_id: formData.get('tableId'),
      items: JSON.parse(formData.get('items')),
      total: formData.get('total'),
      status: 'pending'
    })
    .select()
    .single()

  if (!error) {
    await sendTelegram(`🔔 ការកុម្ម៉ង់ថ្មី #${order.id}\nតុ: ${order.table_id}\nសរុប: $${order.total}`)
  }

  return { orderId: order.id }
}
```

---

### **Environment Variables**

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Cloudflare R2
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=cafe-images

# Telegram
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
TELEGRAM_CHAT_ID=-100123456789
```

---

### **Testing Checklist**

- [ ] QR code redirect works with valid `?table=T1&token=xyz`
- [ ] Menu loads images from R2 correctly
- [ ] Cart persists when navigating back
- [ ] Order submission redirects to tracking page
- [ ] Realtime updates trigger on status change
- [ ] Khmer text renders properly on iOS & Android
- [ ] Touch targets are at least 44x44px
- [ ] Page loads under 2 seconds on 3G

---

## 🔧 Development Commands

```bash
# Start dev server
npm run dev

# Type checking
npx tsc --noEmit

# Build for production
npm run build
npm start
```

---

## 📝 Notes for AI Agents

1. **Always use Server Components by default** - Only add `'use client'` when needed (forms, state, interactivity)

2. **Supabase Client Usage:**
   - Browser interactions → `@/lib/supabase/client`
   - Server Components → `@/lib/supabase/server`
   - Background jobs → `@/lib/supabase/admin`

3. **Image Uploads:** Use presigned R2 URLs (never upload directly from client)

4. **Error Handling:** Show Khmer error messages in UI, log English to console

5. **Mobile-First:** Start with 375px viewport, scale up

6. **Accessibility:** Use semantic HTML, ARIA labels for Khmer screenreaders

---

## 🎨 Design References

- **Color Palette:** Warm browns/ambers (cafe aesthetic)
- **Inspiration:** Food delivery apps (Grab, Foodpanda) but simpler
- **Icons:** Lucide React (already installed)

---

**Current Phase:** Phase 1 - Public Website  
**Next Phase:** Admin Dashboard (KDS, Menu Management, Analytics)
