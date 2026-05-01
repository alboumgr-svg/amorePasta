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
    featured:     true,
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
      name: "Penne",
      category: "Penne",
      price: 5,
      description: "Our classic Penne",
      image: "/images/pasta3.jpg",
      images: [],
      tags: ["bestseller"],
      available: true,
      options: [
        { label: "Size", choices: ["0.5 lb", "1 lb", "2 lb"],
          // Maps directly to choices. Adds $0 for 12oz, $4 for 1lb, $18 for 2lb
          priceModifiers: [5, 8.00, 15.00]
         },
      ],
    },
    {
      id: "p2",
      name: "Fusilli",
      category: "Fusilli",
      price: 5,
      description: "Our classic Fusilli",
      image: "/images/pasta1.jpg",
      images: [],
      tags: ["new"],
      available: true,
      options: [
        { label: "Size", choices: ["0.5 lb", "1 lb", "2 lb"], 
          // Maps directly to choices. Adds $0 for 12oz, $4 for 1lb, $18 for 2lb
          priceModifiers: [5, 8.00, 15.00]
         },
      ],
    },
    {
      id: "p3",
      name: "Spaghetti",
      category: "Spaghetti",
      price: 5,
      description: "Our classic Spaghetti",
      image: "/images/pasta2.jpg",
      images: [],
      tags: ["classic"],
      available: true,
      options: [
        { label: "Size", choices: ["0.5 lb", "1 lb", "2 lb"],
          // Maps directly to choices. Adds $0 for 12oz, $4 for 1lb, $18 for 2lb
          priceModifiers: [5, 8.00, 15.00]
         },
      ],
    },
  ],

  /* ── FEATURED ─────────────────── */
  featured: [
    {
      date: "May 1st, 2026",
      title: "Now Selling at Norz Farms!",
      body: `
        You can find us at Norz Hill Farm & Market — stop by to pick up fresh pasta in person.<br><br>
        <button
          style="cursor:pointer;"
          onclick="
            const btn = this;
            navigator.clipboard.writeText('120 S Branch Rd, Hillsborough Township, NJ 08844')
              .then(() => {
                const original = btn.innerText;
                btn.innerText = 'Copied!';
                btn.disabled = true;
                setTimeout(() => {
                  btn.innerText = original;
                  btn.disabled = false;
                }, 1500);
              })
              .catch(() => {
                btn.innerText = 'Failed';
              });
          "
        >
          Copy Address
        </button>
        <br>
        <span id="norz-address">120 S Branch Rd, Hillsborough Township, NJ 08844</span>
        <br><br>
        <a href="https://maps.google.com/?q=120 S Branch Rd, Hillsborough Township, NJ 08844" target="_blank" rel="noopener">
          Open in Google Maps →
        </a>
      `,
      mapEmbedUrl: "https://maps.google.com/maps?q=Norz%20Hill%20Farm%20Market%20New%20Jersey&output=embed"
    },
    {
      date: "May 1st, 2026",
      title: "New Website Just Launched!",
      body: "If you're here, you already know! We are excited to present this new website as a means to show off our amazing pasta and get your orders to your doorstep!"
    },
    {
      date: "May 1st, 2026",
      title: "Now Offering Pickup or Delivery",
      body: "We offer local delivery and pickup options. Submit an order request and we’ll coordinate directly with you."
    }
  ],

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

  /* ── EMAIL (EmailJS — free, no backend needed) ───────────
   *
   *  SETUP (one-time, ~5 minutes):
   *  1. Create a free account at https://emailjs.com
   *  2. Add an Email Service (Gmail, Outlook, etc.) → copy the Service ID
   *  3. Create TWO email templates (see variables below) → copy each Template ID
   *  4. Go to Account → Public Key → copy it
   *  5. Paste all three values below and you're live.
   *
   *  FREE TIER: 200 emails/month (each order sends 2 — so ~100 orders/month free)
   *
   *  ── TEMPLATE VARIABLES ──────────────────────────────────
   *  Use these in your EmailJS template editor as {{variable_name}}:
   *
   *    {{order_id}}        — unique order number e.g. #M3F2A1-XZ9K
   *    {{order_date}}      — e.g. June 12, 2025 at 3:42 PM
   *    {{customer_name}}   — customer's full name
   *    {{customer_email}}  — customer's email address
   *    {{customer_phone}}  — customer's phone (or "Not provided")
   *    {{cart_summary}}    — full itemised order, one line per item
   *    {{order_total}}     — formatted total e.g. $23.00
   *    {{business_name}}   — pulled from business.name above
   *    {{business_email}}  — pulled from business.email above
   *    {{business_phone}}  — pulled from business.phone above
   *    {{notes}}           — customer's special requests
   *
   *  ── TEMPLATE 1: orderTemplateId (goes TO YOU) ───────────
   *  Subject:  New Order {{order_id}} — {{business_name}}
   *  To email: your business email (set in EmailJS template settings)
   *  Body: use all variables above to build your invoice layout
   *
   *  ── TEMPLATE 2: confirmTemplateId (goes TO CUSTOMER) ────
   *  Subject:  Your order is confirmed! {{order_id}}
   *  To email: {{customer_email}}  ← set this in EmailJS template settings
   *  Body: thank them, show {{cart_summary}}, {{order_total}}, {{order_id}}
   *  Leave confirmTemplateId empty ("") to skip customer confirmation emails.
   * ───────────────────────────────────────────────────────── */
  form: {
    emailjs: {
      publicKey:         "hneHyaX4JKNG9Ikdu",   // Account → Public Key
      serviceId:         "service_t6j82jr",   // Email Services → Service ID
      orderTemplateId:   "template_esqstrf",   // Template that sends TO YOU (the business)
      confirmTemplateId: "template_gm0dix6",   // Template that sends TO THE CUSTOMER (leave "" to skip)
    },
  },

};

/* ─── DO NOT EDIT BELOW THIS LINE ──────────────────────────── */
window.__SITE_CONFIG = CONFIG;