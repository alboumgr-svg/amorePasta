# VOLTA — Premium Retail Template

A production-ready, fully config-driven static retail website template.  
Rebrand in under 10 minutes. Deploy in 2 minutes.

---

## File Structure

```
/
├── index.html              ← HTML skeleton (no hardcoded content)
├── styles.css              ← All styles + 2 theme presets
├── app.js                  ← Builds all sections from config
├── config.js               ← ★ EDIT THIS FILE ONLY ★
├── config.dark-preset.js   ← Ready-to-use dark theme
└── README.md
```

---

## Quick Rebrand (10 minutes)

1. Open `config.js`
2. Edit `business {}` block → name, email, phone, address
3. Set `theme: "light"` or `"dark"` (or `"custom"` + edit `colors {}`)
4. Replace `products []` with your inventory
5. Update `hero {}` text
6. Save → done

---

## Switching Themes

**Light (warm off-white):**
```js
theme: "light",
```

**Dark (deep charcoal):**
```js
theme: "dark",
```

**Dark preset (different branding):**  
Copy `config.dark-preset.js` → rename to `config.js` (overwrite).

**Custom:**
```js
theme: "custom",
colors: {
  primary:     "#2D1F14",
  accent:      "#FF6B35",
  bg:          "#FFF8F0",
  // ... see config.js for all keys
},
```

---

## Adding Products

Add an object to `products []` in `config.js`:

```js
{
  id: "p9",                         // unique string
  name: "My Product",
  category: "Ceramics",             // must match a string in categories[]
  price: 120,                       // number, or omit to hide price
  description: "Full description.", 
  image: "https://... or /assets/myimage.jpg",
  images: [],                       // extra gallery images (optional)
  tags: ["new"],                    // "new" | "bestseller" | "sale" | []
  available: true,
  options: [
    { label: "Size", choices: ["S", "M", "L"] },
  ],
},
```

That's it — the product appears in the grid automatically.

---

## Adding / Removing Categories

Edit `categories []`:
```js
categories: ["All", "Ceramics", "Lighting", "Furniture"],
```
"All" must always be the first entry.

---

## Enabling/Disabling Sections

```js
sections: {
  hero:         true,
  about:        false,   // ← hides the about section
  featured:     true,
  products:     true,
  testimonials: false,   // ← hides testimonials
  contact:      true,
  footer:       true,
},
```

---

## Reordering Sections

In `index.html`, cut and paste the `<section>` blocks in any order inside `<main>`.  
Each section has a comment marking its boundaries.

---

## Form / Order Submission

### Option 1 — mailto (default, zero setup)
```js
form: {
  submitMethod: "mailto",
  mailtoAddress: "you@yourbusiness.com",
}
```
Opens the user's email client. Works everywhere, no account needed.

### Option 2 — Formspree (recommended, free tier available)
1. Sign up at https://formspree.io
2. Create a new form → copy the form ID (e.g. `xrgzqwop`)
3. Set:
```js
form: {
  submitMethod: "formspree",
  formspreeId:  "xrgzqwop",
}
```

### Option 3 — Netlify Forms (when deployed on Netlify)
```js
form: {
  submitMethod: "netlify",
}
```
No extra setup needed — Netlify detects the form automatically on deploy.

---

## Swapping Images

Any image URL works — remote (Unsplash, CDN) or local:

```js
// Remote
image: "https://images.unsplash.com/photo-xxx?w=800&q=80",

// Local (put files in /assets/)
image: "/assets/my-product.jpg",
```

Recommended image sizes:
- Product cards: 800×800px (1:1)
- Hero background: 1600×900px min
- About: 900×1100px (portrait)

---

## Deploying to Render

1. Push files to a GitHub repo
2. Go to https://render.com → New → Static Site
3. Connect your repo
4. Build command: *(leave blank)*
5. Publish directory: `.` (root) or the folder containing `index.html`
6. Click Deploy

**Netlify:**
Drag and drop the folder at https://app.netlify.com/drop

**Vercel:**
```bash
npx vercel --prod
```

---

## Fonts

Default fonts are loaded from Google Fonts in `index.html`.  
To change them:

1. Pick fonts at https://fonts.google.com
2. Replace the `<link>` tag in `index.html`
3. Update `fonts {}` in `config.js`:
```js
fonts: {
  display: "'Your Heading Font', serif",
  body:    "'Your Body Font', sans-serif",
}
```

---

## Map

Replace `mapEmbedUrl` in `config.js` with any Google Maps embed URL:
1. Go to https://maps.google.com
2. Search your address
3. Share → Embed a map → Copy the `src="..."` URL
4. Paste into `mapEmbedUrl`

Set `mapEmbedUrl: ""` to hide the map entirely.

---

## Social Links

Leave any social value empty `""` to hide that icon:
```js
social: {
  instagram: "https://instagram.com/yourhandle",
  facebook:  "",          // hidden
  twitter:   "",          // hidden
  pinterest: "...",
}
```

---

## License

Template for commercial use. Sell the built sites — just don't resell the template source code directly.
