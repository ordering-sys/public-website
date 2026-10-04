# 📱 Implementation Guide - Customer Flow

## What We Built

Core customer-facing features for QR-based restaurant ordering:

### ✅ Completed Features

1. **Landing Page** (`app/(site)/page.tsx`)
   - Welcome screen with cafe branding
   - QR parameter detection
   - CTA button to start ordering

2. **Order Page** (`app/(site)/order/page.tsx`)
   - Menu display with images
   - Category filtering
   - Shopping cart with quantity controls
   - Order submission

3. **Tracking Page** (`app/(site)/tracking/[id]/page.tsx`)
   - Real-time status updates via Supabase
   - Visual progress indicator
   - Order summary

## Architecture

```
Customer Flow:
┌─────────────┐
│ Scan QR at  │
│   Table T1  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│   Landing Page          │
│   /?table=T1&token=xyz  │
└──────┬──────────────────┘
       │ Click "Start Order"
       ▼
┌─────────────────────────┐
│   Order Page            │
│   - Browse menu         │
│   - Add to cart         │
│   - Submit order        │
└──────┬──────────────────┘
       │ Submit
       ▼
┌─────────────────────────┐
│   Tracking Page         │
│   /tracking/[order-id]  │
│   - Realtime updates    │
└─────────────────────────┘
```

## Tech Stack

- **Frontend:** React 19, Next.js 16 (App Router)
- **Styling:** TailwindCSS 4, Lucide Icons
- **Database:** Supabase (PostgreSQL + Realtime)
- **State:** React useState (client-side cart)
- **Language:** Khmer + English bilingual

## File Structure Created

```
cafe-qr-app/
├── lib/
│   ├── supabase/
│   │   ├── admin.ts       ✅ Service role client
│   │   ├── client.ts      ✅ Browser client
│   │   └── server.ts      ✅ Server component client
│   ├── telegram.ts        ✅ Notification helper
│   └── types.ts           ✅ TypeScript interfaces
│
├── app/
│   ├── (site)/
│   │   ├── layout.tsx     ✅ Customer layout
│   │   ├── page.tsx       ✅ Landing/welcome
│   │   ├── order/
│   │   │   ├── page.tsx   ✅ Menu & cart
│   │   │   └── actions.ts ✅ Server actions
│   │   └── tracking/[id]/
│   │       └── page.tsx   ✅ Order tracking
│   ├── layout.tsx         ✅ Root layout (updated)
│   ├── page.tsx           ✅ Root redirect
│   └── globals.css        ✅ Theme + Khmer fonts
│
├── DATABASE.sql           ✅ Schema + sample data
├── SETUP.md              ✅ Setup instructions
└── AGENTS.md             ✅ AI agent guide
```

## Database Tables

### `tables`
- Stores table numbers and QR tokens
- Each table has unique token for security

### `menu_items`
- Menu items with Khmer + English names
- Categories, prices, availability
- Optional image URLs

### `orders`
- Customer orders with JSONB items
- Status tracking (pending → preparing → ready → completed)
- Realtime enabled for live updates

## Key Features

### 🌐 Bilingual Support
- Khmer primary, English secondary
- Noto Sans Khmer font for proper rendering
- All UI labels in both languages

### 📱 Mobile-First Design
- Touch-friendly buttons (min 48px)
- Responsive grid layout
- Bottom sheet cart drawer
- Floating cart button with badge

### ⚡ Real-Time Updates
- Supabase Realtime subscriptions
- Order status updates without refresh
- Visual status indicators with animations

### 🎨 Cafe Theme
- Warm amber/orange colors
- Custom CSS variables
- Gradient backgrounds
- Rounded, modern UI

## Testing Checklist

```bash
# 1. Install dependencies
npm install

# 2. Set up Supabase (see SETUP.md)
# - Run DATABASE.sql in Supabase SQL Editor
# - Update .env.local with your keys

# 3. Start dev server
npm run dev

# 4. Test flow
# Visit: http://localhost:3000/?table=T1&token=abc123xyz
```

### Manual Test Scenarios

1. **Landing page loads** with table params
2. **Click "Start Order"** → redirects to /order
3. **Browse menu** → items load from Supabase
4. **Add items to cart** → counter updates
5. **Open cart drawer** → shows items with quantities
6. **Submit order** → redirects to tracking page
7. **Watch status change** (manually update in Supabase) → page updates realtime

### Test Status Updates (Supabase SQL)

```sql
-- Get latest order ID
SELECT id FROM orders ORDER BY created_at DESC LIMIT 1;

-- Update status
UPDATE orders SET status = 'preparing' WHERE id = 'your-order-id';
UPDATE orders SET status = 'ready' WHERE id = 'your-order-id';
```

## Next Phase: Admin Dashboard

### Planned Features (not yet built)

- [ ] **Admin Login** (`/admin/login`)
- [ ] **Kitchen Display System** (`/admin/dashboard/kds`)
  - Live order queue
  - Status update buttons
  - Realtime sync with customer tracking
  
- [ ] **Menu Management** (`/admin/dashboard/menu`)
  - CRUD operations
  - Image upload to R2
  - Category management
  
- [ ] **Table Management** (`/admin/dashboard/tables`)
  - Generate new tables
  - Print QR codes
  - Token regeneration
  
- [ ] **Analytics** (`/admin/dashboard`)
  - Daily sales reports
  - Popular items
  - Order completion time

## Environment Variables

Required:
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

Optional (for future features):
- ⏳ `R2_*` (image uploads)
- ⏳ `TELEGRAM_BOT_TOKEN` (notifications)

## Performance Notes

- Server Components used by default (faster initial load)
- Client Components only where needed (cart interactivity)
- Images lazy-loaded
- Realtime connections only on tracking page

## Security Considerations

- RLS policies needed for production (currently disabled for testing)
- QR tokens should be regenerated periodically
- Admin routes need authentication (future phase)

---

**Status:** Phase 1 Complete ✅  
**Next:** Admin Dashboard (Phase 2)  
**Est. Time to MVP:** Customer flow ready, admin ~2-3 days
