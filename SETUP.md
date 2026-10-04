# 🚀 Setup Guide - Cafe QR App

## Prerequisites
- Node.js 20+ installed
- Supabase account (free tier works)
- Telegram Bot (optional, for notifications)

## Step 1: Database Setup

1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Copy contents from `DATABASE.sql` and run it
4. Verify tables created in **Table Editor**

## Step 2: Configure Environment

Update `.env.local` with your actual values:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Get these from Supabase Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Optional: Cloudflare R2 (for image uploads)
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=cafe-images
NEXT_PUBLIC_R2_PUBLIC_DOMAIN=https://pub-xxx.r2.dev

# Optional: Telegram Bot (for order notifications)
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
TELEGRAM_CHAT_ID=-100123456789
```

## Step 3: Install & Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Step 4: Test the Flow

### Test URL with QR params:
```
http://localhost:3000/?table=T1&token=abc123xyz
```

This simulates scanning a QR code at Table 1.

### Expected Flow:
1. **Landing page** → Shows "Start Order" button
2. **Order page** → Browse menu, add to cart
3. **Submit order** → Redirects to tracking page
4. **Tracking page** → Shows real-time status updates

## Testing Without QR Code

To test menu browsing without QR:
```
http://localhost:3000/order?table=T1&token=abc123xyz
```

## Supabase Realtime Setup

1. Go to **Supabase Dashboard > Database > Replication**
2. Enable **Realtime** for the `orders` table
3. Save changes

## Next Steps

### Add Images to Menu Items

1. Upload images to Cloudflare R2 or use URLs
2. Update `menu_items` table:
```sql
UPDATE menu_items 
SET image_url = 'https://example.com/coffee.jpg'
WHERE name_en = 'Black Coffee';
```

### Test Order Status Updates

In Supabase SQL Editor:
```sql
-- Change order status to test realtime updates
UPDATE orders 
SET status = 'preparing', updated_at = NOW()
WHERE id = 'your-order-id';

-- Then change to ready
UPDATE orders 
SET status = 'ready', updated_at = NOW()
WHERE id = 'your-order-id';
```

The tracking page should update automatically! 🎉

## Troubleshooting

**Menu not loading?**
- Check Supabase connection in browser console
- Verify `menu_items` table has data
- Check RLS policies (disable for testing)

**Realtime not working?**
- Enable Realtime in Supabase Dashboard
- Check browser console for subscription errors
- Verify `ALTER PUBLICATION` was run in DATABASE.sql

**Cart not working?**
- Clear browser localStorage
- Check for JavaScript errors in console

## What's Built

✅ Customer landing page with QR support  
✅ Menu browsing with categories  
✅ Shopping cart with quantity management  
✅ Order submission  
✅ Real-time order tracking  
✅ Mobile-responsive design  
✅ Khmer language support  

## What's Next (Admin Dashboard)

- [ ] Staff login
- [ ] Kitchen Display System (KDS)
- [ ] Menu management (CRUD)
- [ ] Table & QR code generation
- [ ] Sales analytics

---

**Built with:** Next.js 16, Supabase, TailwindCSS 4
