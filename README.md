# GlamHub 💜

**The beauty business command center for TikTok Live sellers, wig merchants, and online beauty brands.**

Built for the online hair and makeup merchant who streams TikTok Live, sells wigs, extensions, lashes, and runs giveaways — all in one place, no subscription required.

---

## What it does

### ✦ Dashboard
- Today's revenue and order count at a glance
- Low stock alerts with one-tap reorder routing
- Quick action buttons: start a live session, pick a giveaway winner, build a gift box, compare vendor prices
- Recent sales feed

### 🎥 Live Studio
- Build your product lineup for each TikTok Live session — check items off as you sell them
- Live talking points notepad — prep your script, CTAs, and promo codes
- In-session giveaway winner picker with animated spin wheel

### 📱 Content Studio
- Organize all content by type: **Ads**, **Demos**, **Lives**, **Tutorials**
- Track platform (TikTok, Instagram, YouTube, Facebook), status (draft, scheduled, published, running), views, and ROAS
- Filter by content type in one click

### 👜 Products & Inventory
- Track wigs, extensions, lashes, accessories, and care products
- Stock level badges — red alerts when running low
- Log a sale and auto-deduct stock in one step
- Filter by product category

### 💰 Vendor Price Comparison
- Add all your wholesale vendors and their prices per item
- Hit **Compare now** → instantly see which vendor is cheapest for any item
- Winner highlighted with 🏆, price difference shown for all others
- Add new vendors and update prices anytime

### 🎁 Giveaways
- Track entries, prize value, platform, and entry method
- Add entries manually (+1, +10, +100 buttons)
- Mark completed, record winners
- Full history of past giveaways and prize value given

### 📦 Gift Box Builder
- Build subscription box tiers (Basic, Premium, Elite)
- Drag products into each box with quantity
- Track subscribers per tier
- Auto-calculates monthly revenue per box and total MRR
- Pause or activate any tier instantly

---

## Tech stack

- **React 18** (Create React App)
- **localStorage** — all data persists across sessions, no backend needed
- **Zero dependencies** beyond React — no UI library, no external APIs
- **Inline styles** — no CSS files, no build config

---

## Getting started

### Option 1 — Deploy to Vercel (recommended)

1. Fork or clone this repo
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import this repo
4. Leave all settings as default
5. Click **Deploy**

Your app will be live at `yourapp.vercel.app` in under 2 minutes.

### Option 2 — Run locally

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

### Option 3 — Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `/build` folder after running `npm run build`
3. Done

---

## Customizing

All default data lives at the top of `src/App.js` in the `INIT_*` constants. Update them to match your real products, vendors, and content before deploying.

```js
// Example: change the default products
const INIT_PRODUCTS = [
  { id: tid(), name: "Your Wig Name", cat: "Wigs", stock: 10, price: 149, sku: "WIG-001" },
  // ...
];
```

### Adding your brand name

Change the logo in the header:
```js
// In App.js, find:
<div style={g.logo}>GLAMHUB</div>

// Replace with your brand name:
<div style={g.logo}>YOUR BRAND</div>
```

### Changing colors

All colors are defined in the `C` object at the top of `src/App.js`:
```js
const C = {
  purple: "#7C5CBF",   // primary accent
  pink: "#D4527A",     // secondary accent / giveaway
  gold: "#C9952A",     // vendor / revenue
  teal: "#2EC4B6",     // gift boxes
  // ...
};
```

---

## White label license

This template is sold under a **white label personal/commercial use license.**

**You may:**
- Use for personal or commercial projects
- Customize branding, colors, and content
- Deploy for client websites
- Launch as your own branded product

**You may not:**
- Resell or redistribute the source files
- Claim original authorship of the codebase

---

## Data & privacy

GlamHub stores all data in your browser's `localStorage`. Nothing is sent to any server. No accounts, no cloud sync, no third-party tracking. Your business data stays on your device.

> **Note:** Clearing your browser data will reset the app. For persistent storage across devices, a backend integration (Supabase, Firebase, etc.) would be the next step.

---

## Roadmap ideas

- [ ] CSV export for sales and inventory
- [ ] TikTok Live API integration for real-time viewer count
- [ ] Automated reorder alerts via email
- [ ] Multi-device sync via Supabase
- [ ] Shopify / Etsy inventory sync
- [ ] AI product description generator for listings

---

## Built by

**Faire Fare Travels / STV Digital**
[fairefaretravels.github.io](https://fairefaretravels.github.io)

---

*GlamHub is part of the white label app series — purpose-built tools for creators, sellers, and small business operators.*
