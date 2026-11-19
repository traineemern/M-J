# M&J Water Wells — Modern Website

A fast, mobile-first, professional website for **M&J Water Wells**, a family-owned rotary well drilling and repair company based at **1036 Truman Avenue, Casnovia, MI 49318**. Serving Casnovia, Sand Lake, Newaygo, Fremont & Hesperia, and across West Michigan.

---

## 🚀 Quick Start (Development & Building)

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev
# → http://localhost:5173

# 3. Run automated tests
npm test

# 4. Build for production (compiles TypeScript, bundles assets, generates sitemap & robots)
npm run build
```

---

## 📋 Plain-English Editing Guide (For the Business Owner)

**You do NOT need to write code to change text, phone numbers, addresses, FAQ answers, or colors.** All content is stored in clean data files in `src/data/` and `src/styles/index.css`.

### 1. How to Change Phone Number, Address, and Email
Open **`src/data/site.ts`**:
```ts
// Update your phone number (will update everywhere, tap-to-call enabled):
phone: '(616) 675-4875',
phoneClean: '+16166754875',

// Update your email:
email: 'info@MandJWaterWells.com',

// Update your address:
address: {
  street: '1036 Truman Avenue',
  city: 'Casnovia',
  state: 'MI',
  zip: '49318',
  full: '1036 Truman Avenue, Casnovia, MI 49318',
},
```

### 2. How to Change Services & Descriptions
Open **`src/data/services.ts`**:
- Each service has a `title`, `shortDescription`, `fullDescription`, and bulleted `features`.
- Edit the text within the quotes.

### 3. How to Update or Add FAQ Questions & Answers
Open **`src/data/faq.ts`**:
- Edit existing questions and answers or copy/paste an item to add a new one.

### 4. How to Update the 8-Step Project Roadmap
Open **`src/data/roadmap.ts`**:
- Each step has a `title`, `description`, optional `link`, and optional `badge`.
- Review the `[CONFIRM]` notes (response time, permit filing responsibility, standard rotary methods, equipment brands, and future online portal plans).

### 5. How to Change Animated Counter Numbers
Open **`src/data/brands.ts`**:
- Update `animatedStats` with your confirmed numbers (years in business, wells drilled, feet drilled).

### 6. How to Change Brand Colors
Open **`src/styles/index.css`**:
- The color palette is defined in the `@theme` block:
```css
@theme {
  --color-brand-600: #C41E0F; /* Primary Brand Red */
  --color-brand-700: #9B1009; /* Dark Brand Red (Hero Background) */
  --color-ink: #4A4A4A;       /* Body Text */
  --color-surface-muted: #F2F2F2; /* Soft Gray Backgrounds */
  --color-button-dark: #3A3A3A;  /* Secondary Dark Buttons */
}
```

### 7. How to Replace Photos & Images
- Place your owner truck photo, rig photos, and company images in `public/images/`.
- Ensure photos are saved as `.webp` format for fast mobile loading.

### 8. Reviewing Roadmap [CONFIRM] Items
Open `src/data/roadmap.ts` and confirm:
1. Step 1: Response time for online estimate requests.
2. Step 3: Permitting responsibility (who files with county health dept).
3. Step 4: Standard rotary drilling methods used.
4. Step 6: Pump brands & water treatment offerings.
5. Step 8: Online service records customer portal timeline.

### 9. How to Connect the Contact Form
1. Create a free form at [Formspree.io](https://formspree.io).
2. Copy your form endpoint URL (e.g., `https://formspree.io/f/mqkenvbw`).
3. In your `.env` file (or host dashboard):
```env
VITE_FORM_ENDPOINT=https://formspree.io/f/YOUR_ACTUAL_ID
```

---

## 🗺️ Routes & 301 Redirects

| Route | Component | Page Purpose |
|---|---|---|
| `/` | `HomePage.tsx` | Hero with Dual CTAs, Services grid, Brand Marquee, Reviews, Contact Form |
| `/services` | `ServicesPage.tsx` | Commercial, residential, farm & irrigation, rotary drilling method, pump service |
| `/warranty` | `WarrantyPage.tsx` | 5-Year warranty terms for West Michigan customers |
| `/about` | `AboutPage.tsx` | Family story, equipment fleet, Michigan EGLE certifications |
| `/faq` | `FaqPage.tsx` | Questions & Answers accordion with category filtering |
| `/contact` | `ContactPage.tsx` | Full contact form, address, tap-to-call phone, hours, map placeholder |
| `/areas/newaygo` | `NewaygoAreaPage.tsx` | Dedicated Newaygo County local service page |
| `*` | `NotFoundPage.tsx` | Friendly 404 page with navigation links |

### 301 Redirects (in `vercel.json`)
- `/index.html` → `/`
- `/water-well-drilling-services-michigan.html` → `/services`
- `/well-drilling-grand-rapids-warranty.html` → `/warranty`
- `/well-drilling/water-well-drilling-west-michigan-contact-us.html` → `/contact`
- `/about-our-well-drilling-company.html` → `/about`
- `/well-drilling/newaygo-mi-well-drilling-contractor.html` → `/areas/newaygo`
- `/water-well-drilling-grand-rapids-questions-answers.html` → `/faq`
- `/water-well-drilling-questions-answers.html` → `/faq`
- `/well-drilling/water-well-drilling-questions-answers.html` → `/faq`

---

## 🔒 Deployment & Security Configuration

The site is configured for zero-configuration deployment on **Vercel** via `vercel.json`:
1. **Force HTTPS & HSTS**: Strict Transport Security (`max-age=63072000; includeSubDomains; preload`).
2. **Security Headers**:
   - `Content-Security-Policy`: restricts unauthorized scripts/styles/frames.
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY` (anti-clickjacking)
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Steps to Point `mandjwaterwells.com` to the New Host
1. Sign in to your domain registrar (GoDaddy, Namecheap, Network Solutions, etc.).
2. Go to **DNS Management** for `mandjwaterwells.com`.
3. Set the **A Record**:
   - Host: `@` (or blank)
   - Value: `76.76.21.21` (Vercel IP)
4. Set the **CNAME Record**:
   - Host: `www`
   - Value: `cname.vercel-dns.com`
5. In your Vercel Dashboard, under **Project Settings → Domains**, add `mandjwaterwells.com` and `www.mandjwaterwells.com`. SSL certificates are issued and renewed automatically at no cost.
