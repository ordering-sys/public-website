# ⚡ Quick Start - Test in 5 Minutes

## Step 1: Setup Database (2 min)

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor**
3. Copy-paste contents from `DATABASE.sql`
4. Click **Run**
5. Go to **Table Editor** → verify 3 tables created

## Step 2: Configure (1 min)

Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

Get these from: **Supabase Dashboard → Settings → API**

## Step 3: Run (1 min)

```bash
npm install
npm run dev
```

## Step 4: Test (1 min)

### 🧪 Test URL:
```
http://localhost:3000/?table=T1&token=abc123xyz
```

### Expected Flow:

1. **Landing page** appears → Click "ចាប់ផ្តើមកុម្ម៉ង់"
2. **Menu loads** with 8 sample items
3. **Click +** on a few items → Cart badge appears
4. **Click cart button** → Drawer opens
5. **Click "ដាក់ការកុម្ម៉ង់"** → Redirects to tracking
6. **Tracking page** shows order status

### 🔄 Test Realtime Updates:

Keep tracking page open, then in **Supabase SQL Editor**:

```sql
-- Get your order ID
SELECT id FROM orders ORDER BY created_at DESC LIMIT 1;

-- Update status (paste your ID)
UPDATE orders SET status = 'preparing' WHERE id = 'paste-id-here';

-- Watch the page update automatically! 🎉

-- Try: ready, completed
UPDATE orders SET status = 'ready' WHERE id = 'paste-id-here';
```

## Troubleshooting

### Menu not showing?
```sql
-- Check if data exists
SELECT * FROM menu_items LIMIT 5;

-- If empty, rerun DATABASE.sql
```

### "Failed to load order"?
- Check browser console for errors
- Verify Supabase URL/keys in .env.local
- Try disabling RLS policies temporarily

### Realtime not working?
Go to: **Supabase → Database → Replication**
- Enable **Realtime** for `orders` table
- Save and refresh page

## What Works Now

✅ QR code landing page  
✅ Menu browsing with categories  
✅ Add to cart functionality  
✅ Order submission  
✅ Real-time status tracking  
✅ Mobile responsive design  
✅ Khmer + English bilingual  

## What's Not Built Yet

❌ Admin dashboard  
❌ Kitchen display system  
❌ Menu management UI  
❌ Image uploads  
❌ Telegram notifications  

These are Phase 2 (admin features).

## Sample Test Data

The database includes:

**Tables:**
- T1 (token: abc123xyz)
- T2 (token: def456uvw)  
- T3 (token: ghi789rst)

**Menu Items (8 items):**
- ភេសជ្ជៈ (Drinks): កាហ្វេខ្មៅ, កាហ្វេទឹកដោះគោ, ទឹកក្រូចឆ្មារ
- អាហារ (Food): បបរសាច់គោ, បាយឆាសាច់មាន់, នំបញ្ចុក
- បង្អែម (Desserts): នំប៉័ង, នំបុ័ងចូឡា

Prices range from $1.50 - $5.50

---

**Ready to test?** Run `npm run dev` and visit the test URL! 🚀
