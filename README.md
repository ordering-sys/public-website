# 🍽️ Cafe QR Ordering System

A modern, mobile-first restaurant ordering system where customers scan QR codes at their tables to browse menus and place orders directly from their phones.

**Built for Cambodian cafes/restaurants** with full Khmer language support.

## ✨ Features

### Customer-Facing (Phase 1) ✅
- **QR Code Ordering:** Scan table QR to start ordering
- **Bilingual Menu:** Khmer + English support
- **Smart Cart:** Add items, adjust quantities, add notes
- **Real-time Tracking:** Watch order status update live
- **Mobile-First:** Optimized for phones and tablets

### Admin Panel (Phase 1.5) ✅
- **Table Management:** Create, edit, delete tables
- **QR Code Generation:** Generate and download/print QR codes
- **Security Tokens:** Unique tokens per table, regeneration support

### Coming Soon (Phase 2)
- Menu Management (CRUD operations)
- Kitchen Display System (real-time order queue)
- Sales Analytics & Reports
- Telegram Bot Notifications

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Supabase account (free tier)
- Optional: Telegram Bot (for notifications)

### Installation

```bash
# Clone and install
git clone <your-repo>
cd cafe-qr-app
npm install

# Setup database
# 1. Go to Supabase Dashboard → SQL Editor
# 2. Run the contents of DATABASE.sql

# Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev
```

Visit:
- **Customer Site:** http://localhost:3000/?table=T1&token=abc123xyz
- **Admin Panel:** http://localhost:3000/admin/dashboard

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup instructions
- **[QUICK-START.md](./QUICK-START.md)** - Test customer flow in 5 minutes
- **[ADMIN-GUIDE.md](./ADMIN-GUIDE.md)** - Admin features & QR generation
- **[TEST-ADMIN.md](./TEST-ADMIN.md)** - Test admin panel in 3 minutes
- **[IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md)** - Architecture overview
- **[AGENTS.md](./AGENTS.md)** - AI development guide

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, TailwindCSS 4, Lucide Icons
- **Database:** Supabase (PostgreSQL + Realtime)
- **Storage:** Cloudflare R2 (S3-compatible)
- **QR Codes:** qrcode package
- **Language:** TypeScript

## 📱 Usage

### For Customers

1. **Scan QR code** at your table
2. **Browse menu** with categories
3. **Add items** to cart
4. **Submit order**
5. **Track status** in real-time

### For Restaurant Staff

1. **Create tables** in admin panel
2. **Generate QR codes**
3. **Print and place** on tables
4. **Monitor orders** (coming soon in KDS)

## 🏗️ Project Structure

```
cafe-qr-app/
├── app/
│   ├── (site)/              # Customer pages
│   │   ├── page.tsx         # Landing/welcome
│   │   ├── order/           # Menu & cart
│   │   └── tracking/[id]/   # Order tracking
│   ├── (admin)/             # Admin dashboard
│   │   ├── dashboard/       # Admin home
│   │   ├── tables/          # QR code management
│   │   ├── menu/            # Menu CRUD (coming soon)
│   │   └── kds/             # Kitchen display (coming soon)
│   └── api/                 # API routes
├── lib/
│   ├── supabase/            # Database clients
│   ├── types.ts             # TypeScript types
│   └── telegram.ts          # Notifications
├── components/              # React components
└── DATABASE.sql             # Schema + sample data
```

## 🗄️ Database Schema

### Tables
- `tables` - Restaurant tables with QR tokens
- `menu_items` - Menu with Khmer/English names
- `orders` - Customer orders with status tracking

See [DATABASE.sql](./DATABASE.sql) for complete schema.

## 🔧 Environment Variables

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Optional (for image uploads)
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=cafe-images
NEXT_PUBLIC_R2_PUBLIC_DOMAIN=https://pub-xxx.r2.dev

# Optional (for notifications)
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
TELEGRAM_CHAT_ID=-100123456789
```

## 🧪 Testing

```bash
# Run dev server
npm run dev

# Test customer flow
Visit: http://localhost:3000/?table=T1&token=abc123xyz

# Test admin panel
Visit: http://localhost:3000/admin/dashboard

# Type checking
npx tsc --noEmit

# Lint
npm run lint
```

See [QUICK-START.md](./QUICK-START.md) for detailed testing steps.

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Works on any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Docker

## 🔐 Security Notes

- Each table has unique security token
- Tokens can be regenerated if compromised
- Use HTTPS in production
- Configure Supabase RLS policies for production
- Never commit `.env.local` to git

## 🤝 Contributing

This is a custom project for Cambodian cafes. Contributions welcome!

## 📄 License

MIT License - feel free to use for your restaurant!

## 🆘 Support

- Check documentation files in this repo
- Review [AGENTS.md](./AGENTS.md) for technical details
- Test using guides in [TEST-ADMIN.md](./TEST-ADMIN.md)

## 🎯 Roadmap

- [x] Customer ordering flow
- [x] Real-time order tracking
- [x] Admin table management
- [x] QR code generation
- [ ] Menu CRUD interface
- [ ] Kitchen Display System
- [ ] Order analytics
- [ ] Telegram notifications
- [ ] Multi-language support (beyond Khmer)
- [ ] Payment integration

---

**Current Version:** Phase 1.5 (Customer + Admin QR)  
**Status:** Production-ready for QR generation  
**Next:** Menu Management or Kitchen Display System
