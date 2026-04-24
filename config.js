/**
 * ============================================================
 *  BUSINESS CONFIG — Edit everything here. Touch nothing else.
 * ============================================================
 *
 *  HOW TO REBRAND IN 10 MINUTES:
 *  1. Change BUSINESS section (name, tagline, logo, contact)
 *  2. Swap THEME to "dark" or "light" (or keep "custom")
 *  3. Update COLORS if using "custom" theme
 *  4. Replace PRODUCTS with your inventory
 *  5. Update HERO text
 *  Done. Deploy.
 */

const CONFIG = {

  /* ── THEME ────────────────────────────────────────────────
   *  Options: "light" | "dark" | "custom"
   *  "light" and "dark" auto-apply preset palettes.
   *  "custom" uses the COLORS block below.
   * ───────────────────────────────────────────────────────── */
  theme: "light",   // ← swap to "dark" for the dark preset

  /* ── COLORS (only used when theme: "custom") ────────────── */
  colors: {
    primary:        "#1A1A2E",
    primaryHover:   "#16213E",
    accent:         "#E94560",
    accentHover:    "#c73652",
    bg:             "#FAFAF8",
    bgAlt:          "#F0EFE9",
    surface:        "#FFFFFF",
    text:           "#1A1A1A",
    textMuted:      "#6B6B6B",
    border:         "#E2E2DC",
    navBg:          "rgba(250,250,248,0.92)",
    footerBg:       "#1A1A2E",
    footerText:     "#FFFFFF",
  },

  /* ── TYPOGRAPHY ─────────────────────────────────────────── */
  fonts: {
    display: "'Cormorant Garamond', Georgia, serif",     // headings
    body:    "'DM Sans', 'Helvetica Neue', sans-serif",  // body text
    mono:    "'JetBrains Mono', monospace",              // prices / labels
  },

  /* ── BUSINESS INFO ───────────────────────────────────────── */
  business: {
    name:        "Amore Pasta",
    tagline:     "Where the Pastabilities Are Endless",
    logoText:    "AMORE PASTA",               // shown if no logoUrl
    logoUrl:     "",                    // e.g. "/assets/logo.svg"
    email:       "Amore_Pasta_@outlook.com",
    phone:       "+1 (908) 635-2706",
    address:     "Somerville, NJ 08876",
    mapEmbedUrl: "https://maps.google.com/maps?q=Somerville+New+Jersey&output=embed",
  },

  /* ── HOURS ───────────────────────────────────────────────── 
  hours: [
    { day: "Monday – Friday", time: "10:00 AM – 7:00 PM" },
    { day: "Saturday",        time: "10:00 AM – 8:00 PM" },
    { day: "Sunday",          time: "12:00 PM – 6:00 PM" },
  ],
  */

  /* ── SOCIAL LINKS ────────────────────────────────────────── */
  social: {
    instagram: "https://www.instagram.com/amore_pasta_?igsh=MXFkYzR0NTZqM2k3NQ%3D%3D",
    facebook:  "",    // leave empty to hide
    twitter:   "",
    pinterest: "",
    tiktok:    "",
  },

  /* ── SECTIONS TOGGLE ─────────────────────────────────────── */
  sections: {
    hero:         true,
    about:        true,
    featured:     false,
    products:     true,
    testimonials: true,
    contact:      true,
    footer:       true,
  },

  /* ── HERO ─────────────────────────────────────────────────── */
  hero: {
    headline:    "Homeade Pasta Done Right.",
    subheadline: "Pure ingredients. Real Italian pasta.",
    ctaPrimary:  { text: "Shop Pastas", href: "#products" },
    ctaSecondary:{ text: "Our Story",       href: "#about"    },
    bgImage:     "/images/pasta2.jpg",
    overlayOpacity: 0.45,
  },

  /* ── ABOUT ───────────────────────────────────────────────── */
  about: {
    heading:   "We Believe Good Pasta Starts With Good Ingrediants.",
    body: [
      "Our pasta is crafted in small batches using carefully selected, high-quality ingredients and traditional Italian techniques—resulting in rich flavor, perfect texture, and an authentic experience in every bite.",
      "Each shape is carefully formed by hand, with attention to the details that define authentic Italian pasta—ensuring the perfect texture, structure, and ability to hold sauce just the way it should."
    ],
    image:     "/images/pasta3.jpg",
    stats: [
      { value: "4", label: "Ingrediants" },
      { value: "48",   label: "Batches Made" },
      { value: "4.9★", label: "Avg. Rating" },
    ],
  },

  /* ── CATEGORIES ──────────────────────────────────────────── */
  categories: ["All", "Penne", "Fusilli", "Spaghetti"],

  /* ── PRODUCTS ────────────────────────────────────────────── */
  /*
   *  Fields:
   *    id          – unique string
   *    name        – display name
   *    category    – must match a string in categories[] above
   *    price       – number (shown as $XX.XX) — omit to hide price
   *    description – shown in modal
   *    image       – primary image URL
   *    images      – [] extra gallery images (optional)
   *    tags        – [] e.g. ["bestseller","new","sale"]
   *    available   – true/false
   *    options     – [] {label, choices:[]} for size/color/etc.
   */
  products: [
    {
      id: "p1",
      name: "Penne per Pound",
      category: "Penne",
      price: 5,
      description: "Our classic Penne",
      image: "/images/pasta3.jpg",
      images: [],
      tags: ["bestseller"],
      available: true,
      options: [
        { label: "Size", choices: ["0.5 lb", "1 lb", "2 lb"] },
      ],
    },
    {
      id: "p2",
      name: "Fusilli per Pound",
      category: "Fusilli",
      price: 5,
      description: "Our classic Fusilli",
      image: "/images/pasta1.jpg",
      images: [],
      tags: ["new"],
      available: true,
      options: [
        { label: "Size", choices: ["0.5 lb", "1 lb", "2 lb"] },
      ],
    },
    {
      id: "p3",
      name: "Spaghetti per Pound",
      category: "Spaghetti",
      price: 5,
      description: "Our classic Spaghetti",
      image: "/images/pasta2.jpg",
      images: [],
      tags: ["classic"],
      available: true,
      options: [
        { label: "Size", choices: ["0.5 lb", "1 lb", "2 lb"] },
      ],
    },
  ],

  /* ── FEATURED (ids from products above) ─────────────────── */
  featured: ["p1", "p3", "p4", "p8"],

  /* ── TESTIMONIALS ────────────────────────────────────────── */
  testimonials: [
    {
      name:   "Margot L.",
      role:   "Chef, NYC",
      quote:  "Loved it",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      stars:  5,
    },
    {
      name:   "Margot L.",
      role:   "Chef, NYC",
      quote:  "Loved it",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      stars:  5,
    },
    {
      name:   "Sofia R.",
      role:   "Verified Buyer",
      quote:  "Loved it",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      stars:  5,
    },
  ],

  /* ── ORDER FORM ──────────────────────────────────────────── */
  /*
   *  submitMethod options:
   *    "mailto"    – opens default mail client (no server needed)
   *    "formspree" – set formspreeId to your Formspree form ID
   *    "netlify"   – add data-netlify="true" attribute automatically
   *    "emailjs"   – set emailjs config block
   */
  form: {
    submitMethod: "mailto",        // ← change this
    mailtoAddress: "hello@volta.store",
    formspreeId:   "",             // e.g. "xrgzqwop"
    emailjs: {
      serviceId:   "",
      templateId:  "",
      publicKey:   "",
    },
    netlify: false,
  },

};

/* ─── DO NOT EDIT BELOW THIS LINE ──────────────────────────── */
window.__SITE_CONFIG = CONFIG;
