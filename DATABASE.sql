-- Cafe QR App Database Schema
-- Run this in your Supabase SQL Editor

-- Tables
CREATE TABLE IF NOT EXISTS tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL UNIQUE,
  token TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu Items
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_km TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id TEXT NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(available);

-- Enable Realtime for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE orders;

-- Sample Data
INSERT INTO tables (number, token) VALUES
  ('T1', 'abc123xyz'),
  ('T2', 'def456uvw'),
  ('T3', 'ghi789rst')
ON CONFLICT (number) DO NOTHING;

INSERT INTO menu_items (name_km, name_en, description, price, category, available) VALUES
  ('កាហ្វេខ្មៅ', 'Black Coffee', 'Strong Cambodian coffee', 2.50, 'ភេសជ្ជៈ', true),
  ('កាហ្វេទឹកដោះគោ', 'Iced Coffee', 'Coffee with condensed milk', 3.00, 'ភេសជ្ជៈ', true),
  ('ទឹកក្រូចឆ្មារ', 'Lime Juice', 'Fresh squeezed lime', 2.00, 'ភេសជ្ជៈ', true),
  ('បបរសាច់គោ', 'Beef Noodle Soup', 'Traditional noodle soup', 5.50, 'អាហារ', true),
  ('បាយឆាសាច់មាន់', 'Chicken Fried Rice', 'Fried rice with chicken', 4.50, 'អាហារ', true),
  ('នំបញ្ចុក', 'Num Banh Chok', 'Khmer noodles', 3.50, 'អាហារ', true),
  ('នំប៉័ង', 'French Bread', 'Fresh baguette', 1.50, 'បង្អែម', true),
  ('នំបុ័ងចូឡា', 'Chocolate Bread', 'Sweet chocolate bread', 2.00, 'បង្អែម', true)
ON CONFLICT DO NOTHING;
