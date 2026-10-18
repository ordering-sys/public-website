export type Lang = 'en' | 'km'

const strings = {
  /* ── Nav ── */
  navHome:        { en: 'Home',           km: 'ទំព័រដើម' },
  navMenu:        { en: 'Menu',           km: 'ម៉ឺនុយ' },
  navMap:         { en: 'Map',            km: 'ផែនទី' },
  navAbout:       { en: 'About',          km: 'អំពីយើង' },
  navContact:     { en: 'Contact',        km: 'ទំនាក់ទំនង' },
  navOrderNow:    { en: 'Order Now',      km: 'កុម្ម៉ង់ឥឡូវ' },
  cafeName:       { en: 'The Bean Haven', km: 'ហាងកាហ្វេ' },
  cafeTagline:    { en: 'Coffee · Food · Good Times', km: 'កាហ្វេ · អាហារ · ពេលវេលាល្អ' },

  /* ── Hero ── */
  heroBadge:      { en: 'Premium Coffee & Fresh Food', km: 'កាហ្វេពិសេស និងអាហារស្រស់' },
  heroTitle1:     { en: 'Good Coffee',    km: 'កាហ្វេល្អ' },
  heroTitle2:     { en: 'Better Days',    km: 'ថ្ងៃល្អជាង' },
  heroDesc:       { en: 'At The Bean Haven, we bring people together over perfectly brewed coffee, fresh bites and a cozy atmosphere. More than just a cafe — it\'s a feeling.',
                    km: 'នៅហាងរបស់យើង យើងធ្វើឱ្យមនុស្សជួបគ្នាតាមរយៈកាហ្វេឆ្ងាញ់ អាហារស្រស់ និងបរិយាកាសសង្ហា។ មិនមែនគ្រាន់តែជាហាងកាហ្វេ — វាជាអារម្មណ៍មួយ។' },
  heroExplore:    { en: 'Explore Our Menu →', km: 'មើលម៉ឺនុយ →' },
  heroBook:       { en: 'Visit Us',       km: 'មកលេងយើង' },
  tableSeated:    { en: 'You are seated at', km: 'អ្នកអង្គុយនៅ' },
  howBadge:       { en: 'Table-side ordering', km: 'កុម្ម៉ង់នៅតុ' },
  howTitle:       { en: 'Three steps to your cup', km: 'បីជំហានដល់ពែងរបស់អ្នក' },
  how1Title:      { en: 'Scan the QR',    km: 'ស្កេន QR' },
  how1Desc:       { en: 'Open the menu from the code on your table tent.', km: 'បើកម៉ឺនុយពីកូដនៅលើតុរបស់អ្នក។' },
  how2Title:      { en: 'Pick your order', km: 'ជ្រើសរើសមុខម្ហូប' },
  how2Desc:       { en: 'Coffee, food and notes — all from your phone.', km: 'កាហ្វេ អាហារ និងកំណត់ចំណាំ — ពីទូរស័ព្ទរបស់អ្នក។' },
  how3Title:      { en: 'We bring it over', km: 'យើងនាំមកជូន' },
  how3Desc:       { en: 'Track live status until it arrives at your table.', km: 'តាមដានស្ថានភាពផ្ទាល់រហូតដល់មកដល់តុ។' },

  /* ── Features row ── */
  feat1Title:     { en: 'Premium Quality',     km: 'គុណភាពខ្ពស់' },
  feat1Desc:      { en: 'Finest beans, expertly brewed', km: 'គ្រាប់កាហ្វេប្រណីត ឆ្ងាញ់ល្អ' },
  feat2Title:     { en: 'Fresh Ingredients',   km: 'គ្រឿងផ្សំស្រស់' },
  feat2Desc:      { en: 'Tasty, healthy, always fresh',  km: 'ឆ្ងាញ់ សុខភាព ស្រស់ស្ទើរ' },
  feat3Title:     { en: 'Cozy Atmosphere',     km: 'បរិយាកាសសង្ហា' },
  feat3Desc:      { en: 'A perfect place to relax',      km: 'កន្លែងល្អសម្រាប់ការសម្រាក' },
  feat4Title:     { en: 'Fast & Friendly Service', km: 'សេវាកម្មរហ័ស' },
  feat4Desc:      { en: 'Because you matter',   km: 'ព្រោះអ្នកសំខាន់' },

  /* ── Popular picks ── */
  popularBadge:   { en: 'Our Featured Menu',   km: 'ម៉ឺនុយពិសេសរបស់យើង' },
  popularTitle:   { en: 'Popular Picks',        km: 'ជម្រើសពេញនិយម' },
  viewFullMenu:   { en: 'View Full Menu →',     km: 'មើលម៉ឺនុយទាំងអស់ →' },
  addToCart:      { en: 'Add',                  km: 'បន្ថែម' },

  /* ── Story ── */
  storyBadge:     { en: 'About Us',             km: 'អំពីយើង' },
  storyTitle:     { en: 'Our Story',            km: 'រឿងរ៉ាវរបស់យើង' },
  storyQuote:     { en: 'A Space\nfor Good\nMoments ♡', km: 'កន្លែង\nសម្រាប់\nពេលល្អ ♡' },
  storyDesc:      { en: 'The Bean Haven was born from a simple idea — great coffee brings people together. What started as a small passion project has grown into a cozy cafe where every cup tells a story.',
                    km: 'ហាងរបស់យើងកើតមកពីគំនិតសាមញ្ញ — កាហ្វេល្អធ្វើឱ្យមនុស្សជួបគ្នា។ អ្វីដែលចាប់ផ្តើមជាគម្រោងចង់បានតូចមួយ បានក្លាយជាហាងកាហ្វេស្រួលដែលចាប់រៀបចំរឿងរ៉ាវគ្រប់ពែង។' },
  storyBtn:       { en: 'Learn More →',         km: 'ស្វែងយល់បន្ថែម →' },

  /* ── Newsletter ── */
  joinTitle:      { en: 'Join Our Coffee Club', km: 'ចូលក្លឹបកាហ្វេរបស់យើង' },
  joinDesc:       { en: 'Get exclusive offers, new menu updates and special events.', km: 'ទទួលការផ្តល់ជូនពិសេស ព័ត៌មានម៉ឺនុយថ្មី និងព្រឹត្តិការណ៍ពិសេស។' },
  joinPlaceholder:{ en: 'Your email address',   km: 'អាសយដ្ឋានអ៊ីមែលរបស់អ្នក' },
  joinBtn:        { en: 'Subscribe',            km: 'ជាវ' },

  /* ── Footer ── */
  footerTagline:     { en: 'Good Coffee, Good People ♡', km: 'កាហ្វេល្អ មនុស្សល្អ ♡' },
  footerDesc:        { en: 'Scan the QR at your table to order coffee, pastries and meals — no waiting, no app download.', km: 'ស្កេន QR នៅតុដើម្បីកុម្ម៉ង់កាហ្វេ នំ និងអាហារ — គ្មានរង់ចាំ គ្មានទាញកម្មវិធី។' },
  footerExplore:     { en: 'Explore',           km: 'រុករក' },
  footerVisit:       { en: 'Visit us',          km: 'មកលេងយើង' },
  footerHours:       { en: 'Opening hours',     km: 'ម៉ោងបើក' },
  footerHoursWeek:   { en: 'Mon – Fri',         km: 'ចន្ទ – សុក្រ' },
  footerHoursWeekVal:{ en: '7:00 AM – 9:00 PM', km: '៧:០០ ព្រឹក – ៩:០០ យប់' },
  footerHoursEnd:    { en: 'Sat – Sun',         km: 'សៅរ៍ – អាទិត្យ' },
  footerHoursEndVal: { en: '8:00 AM – 10:00 PM',km: '៨:០០ ព្រឹក – ១០:០០ យប់' },
  footerAddress:     { en: 'Street 240, BKK1, Phnom Penh', km: 'ផ្លូវ ២៤០ បឹងកេងកង ១ ភ្នំពេញ' },
  footerPhone:       { en: '+855 12 345 678',   km: '+855 12 345 678' },
  footerEmail:       { en: 'hello@beanhaven.cafe', km: 'hello@beanhaven.cafe' },
  footerFollow:      { en: 'Follow us',         km: 'តាមដានយើង' },
  footerScanHint:    { en: 'Order from your table — scan the QR on your table tent.', km: 'កុម្ម៉ង់ពីតុរបស់អ្នក — ស្កេន QR លើតុ។' },
  footerRights:      { en: '© 2026 The Bean Haven. All rights reserved.', km: '© 2026 ហាងកាហ្វេ។ រក្សាសិទ្ធិគ្រប់យ៉ាង។' },
  footerMade:        { en: 'Crafted for table-side ordering', km: 'ធ្វើឡើងសម្រាប់កុម្ម៉ង់នៅតុ' },

  /* ── Order page ── */
  menuTitle:      { en: 'Our Menu',             km: 'ម៉ឺនុយរបស់យើង' },
  menuSubtitle:   { en: 'Crafted with passion, served with love', km: 'ធ្វើដោយចំណង់ បម្រើដោយស្នេហ៍' },
  allCategories:  { en: 'All',                  km: 'ទាំងអស់' },
  tableLabel:     { en: 'Table',                km: 'តុ' },
  viewCart:       { en: 'View Cart',            km: 'មើលកន្ត្រក' },
  cartTitle:      { en: 'Your Order',           km: 'ការកុម្ម៉ង់របស់អ្នក' },
  cartEmpty:      { en: 'Your cart is empty',   km: 'កន្ត្រករបស់អ្នកទទេ' },
  total:          { en: 'Total',                km: 'សរុប' },
  placeOrder:     { en: 'Place Order',          km: 'ដាក់ការកុម្ម៉ង់' },
  placingOrder:   { en: 'Placing order…',       km: 'កំពុងដាក់…' },
  orderError:     { en: 'Something went wrong. Please try again.', km: 'មានបញ្ហា! សូមព្យាយាមម្តងទៀត' },
  items:          { en: 'items',                km: 'មុខ' },
  item:           { en: 'item',                 km: 'មុខ' },
  startOrder:     { en: 'Start Order',          km: 'ចាប់ផ្តើមកុម្ម៉ង់' },
  scanPrompt:     { en: 'Scan the QR code at your table to begin ordering', km: 'ស្កេន QR Code នៅតុដើម្បីចាប់ផ្តើមកុម្ម៉ង់' },
  welcomeLabel:   { en: 'Welcome',              km: 'សូមស្វាគមន៍' },
  landingDesc:    { en: 'Order food & drinks directly from your table — fast, easy, no waiting.', km: 'កុម្ម៉ង់អាហារ និងភេសជ្ជៈដោយផ្ទាល់ — លឿន ងាយ គ្មានរង់ចាំ។' },

  /* ── Tracking ── */
  orderLabel:     { en: 'Order',                km: 'ការកុម្ម៉ង់' },
  orderNotFound:  { en: 'Order not found',      km: 'មិនឃើញការកុម្ម៉ង់' },
  orderItems:     { en: 'Order Summary',        km: 'សង្ខេបការកុម្ម៉ង់' },
  callWaiter:     { en: 'Call Waiter',          km: 'ហៅបុគ្គលិក' },
  calling:        { en: 'Calling…',             km: 'កំពុងហៅ…' },
  waiterOnWay:    { en: 'Waiter is on the way!',km: 'បុគ្គលិកកំពុងមក!' },
  thankYou:       { en: 'Thank you! Enjoy your coffee ☕', km: 'អរគុណ! សូមរីករាយជាមួយកាហ្វេ ☕' },
  enjoyMeal:      { en: 'See you next time',    km: 'ជួបគ្នាពេលក្រោយ' },
  liveUpdates:    { en: 'Live order tracking',  km: 'តាមដានការកុម្ម៉ង់ផ្ទាល់' },
  loading:        { en: 'Loading…',             km: 'កំពុងផ្ទុក…' },

  statusPending:      { en: 'Order Received',   km: 'ទទួលការកុម្ម៉ង់' },
  statusPreparing:    { en: 'Preparing',        km: 'កំពុងចម្អិន' },
  statusReady:        { en: 'Ready! 🎉',         km: 'រួចរាល់! 🎉' },
  statusCompleted:    { en: 'Completed',        km: 'ចប់' },
  statusCancelled:    { en: 'Cancelled',        km: 'បានបោះបង់' },
  statusPendingStep:  { en: 'Received',         km: 'ទទួល' },
  statusPreparingStep:{ en: 'Preparing',        km: 'ចម្អិន' },
  statusReadyStep:    { en: 'Ready',            km: 'រួចរាល់' },

  /* ── Product detail modal ── */
  detailTitle:        { en: 'Item Detail',                     km: 'ព័ត៌មានមុខម្ហូប' },
  detailAddToOrder:   { en: 'Add to Order',                    km: 'បន្ថែមទៅការកុម្ម៉ង់' },
  detailAddMore:      { en: 'Added! Add more?',                km: 'បន្ថែមហើយ! បន្ថែមទៀត?' },
  detailClose:        { en: 'Close',                           km: 'បិទ' },
  detailQty:          { en: 'Quantity',                        km: 'បរិមាណ' },
  detailDescription:  { en: 'Description',                     km: 'ការពិពណ៌នា' },
  detailNoDesc:       { en: 'No description available.',       km: 'គ្មានការពិពណ៌នា។' },
  detailSubtotal:     { en: 'Subtotal',                        km: 'សរុបរង' },
  notesLabel:         { en: 'Special Request',                 km: 'សំណើរពិសេស' },
  notesPlaceholder:   { en: 'e.g. Less sugar, no ice, extra hot…', km: 'ឧ. ស្ករតិច គ្មានទឹកកក ក្ដៅណាស់…' },
  notesHint:          { en: 'Optional — sent directly to kitchen', km: 'ជម្រើស — ផ្ញើទៅផ្ទះបាយផ្ទាល់' },
  notesInCart:        { en: 'Note',                            km: 'កំណត់ចំណាំ' },
  available:          { en: 'Available',                       km: 'មានផ្គត់ផ្គង់' },
  unavailable:        { en: 'Not available',                   km: 'អស់ស្តុក' },
  tapForDetail:       { en: 'Tap for details',                 km: 'ចុចដើម្បីមើល' },
  inCartBadge:        { en: 'In cart',                         km: 'ក្នុងកន្ត្រក' },
} satisfies Record<string, { en: string; km: string }>

export type StringKey = keyof typeof strings

export function t(key: StringKey, lang: Lang): string {
  return strings[key][lang]
}
