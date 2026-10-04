# Changelog

## Phase 1.5 - Admin QR Generation (Current)

### Added
- **Admin Dashboard** (`/admin/dashboard`)
  - Landing page with quick navigation
  - Dashboard cards for all features
  - Quick start guide

- **Table Management** (`/admin/tables`)
  - Create new tables with custom names
  - View all tables in grid layout
  - Generate QR codes on demand
  - Download QR codes as PNG
  - Print-optimized QR layout
  - Regenerate security tokens
  - Delete tables
  - Active/inactive status badges

- **Admin Layout**
  - Professional sidebar navigation
  - Top navbar with branding
  - Responsive design

- **Documentation**
  - `ADMIN-GUIDE.md` - Complete admin feature guide
  - `TEST-ADMIN.md` - Quick testing instructions
  - Updated `README.md` with full project overview

### Technical
- QR code generation with `qrcode` package
- Unique security tokens per table
- Image optimization config in Next.js
- TypeScript types for all components
- Mobile-responsive admin interface

---

## Phase 1 - Customer Ordering (Completed)

### Added
- **Landing Page** (`/(site)/page.tsx`)
  - Welcome screen with QR parameter detection
  - Bilingual Khmer + English
  - Auto-redirect to order page

- **Order Page** (`/(site)/order/page.tsx`)
  - Browse menu with category filters
  - Shopping cart with quantity management
  - Add items, adjust quantities
  - Special instructions support
  - Order submission

- **Order Tracking** (`/(site)/tracking/[id]/page.tsx`)
  - Real-time status updates via Supabase Realtime
  - Visual progress indicators
  - Status flow: pending → preparing → ready → completed
  - Order details with item list

- **Database Schema**
  - `tables` - Restaurant tables with QR tokens
  - `menu_items` - Menu with bilingual names
  - `orders` - Customer orders with status tracking
  - Sample data included

- **Infrastructure**
  - Supabase client setup (browser, server, admin)
  - TypeScript types and interfaces
  - Telegram notification helper
  - Mobile-first CSS with Khmer fonts

### Documentation
- `SETUP.md` - Complete setup guide
- `QUICK-START.md` - 5-minute test guide
- `IMPLEMENTATION-GUIDE.md` - Architecture overview
- `AGENTS.md` - AI development guide
- `DATABASE.sql` - Schema + sample data

---

## Phase 2 - Coming Soon

### Planned Features

#### Menu Management
- Add/edit/delete menu items
- Upload images to Cloudflare R2
- Category management
- Price and availability controls
- Bulk operations

#### Kitchen Display System (KDS)
- Real-time order queue
- Status update buttons (pending → preparing → ready)
- Sound notifications
- Order completion time tracking
- Print order tickets

#### Analytics Dashboard
- Daily/weekly/monthly sales reports
- Popular items analysis
- Peak hours identification
- Revenue tracking
- Customer insights

#### Enhancements
- Telegram bot integration (order notifications)
- Multi-user authentication
- Staff role management
- Custom QR code branding
- Multi-language support (beyond Khmer)
- Payment integration

---

## Version History

### v0.2.0 - Admin QR Generation (Current)
- Date: 2026-10-04
- Features: Table management, QR generation, admin dashboard
- Status: Production-ready for QR codes

### v0.1.0 - Customer Ordering MVP
- Date: 2026-10-03
- Features: Customer ordering flow, real-time tracking
- Status: Production-ready for customer use

---

## Breaking Changes

None yet - first release

## Known Issues

- [ ] Image component warning (using `<img>` instead of Next.js `<Image />`)
- [ ] RLS policies not configured (for testing phase)
- [ ] No authentication on admin routes yet

## Migration Guide

### Upgrading from Phase 1 to Phase 1.5

No migration needed - new features added, no breaking changes.

Just update your code and run:
```bash
git pull
npm install
npm run dev
```

---

## Contributors

Built for Cambodian cafes and restaurants 🇰🇭

## License

MIT
