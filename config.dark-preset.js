/**
 * ============================================================
 *  PRESET: "OBSIDIAN" — Dark Luxury Retail Theme
 * ============================================================
 *  HOW TO USE:
 *    Rename this file to config.js (replace the default one).
 *    OR copy just the `theme` and `colors` + `business` sections
 *    into your existing config.js.
 * ============================================================
 */

const CONFIG = {

  theme: "dark",   // ← This activates the dark preset in styles.css

  fonts: {
    display: "'Playfair Display', Georgia, serif",
    body:    "'Inter', 'Helvetica Neue', sans-serif",
    mono:    "'Fira Code', monospace",
  },

  business: {
    name:        "NOIR",
    tagline:     "Premium Goods. No Compromise.",
    logoText:    "NOIR",
    logoUrl:     "",
    email:       "studio@noir.co",
    phone:       "+1 (310) 555-0144",
    address:     "800 S Grand Ave, Los Angeles CA 90017",
    mapEmbedUrl: "https://maps.google.com/maps?q=Los+Angeles+CA&output=embed",
  },

  hours: [
    { day: "Mon – Fri", time: "11:00 AM – 8:00 PM" },
    { day: "Saturday",  time: "11:00 AM – 9:00 PM" },
    { day: "Sunday",    time: "Closed" },
  ],

  social: {
    instagram: "https://instagram.com/",
    facebook:  "",
    twitter:   "https://twitter.com/",
    pinterest: "",
    tiktok:    "https://tiktok.com/",
  },

  sections: {
    hero:         true,
    about:        true,
    featured:     true,
    products:     true,
    testimonials: true,
    contact:      true,
    footer:       true,
  },

  hero: {
    headline:    "Crafted for the Relentless.",
    subheadline: "Precision tools, minimal objects, and exclusive accessories for those who demand more.",
    ctaPrimary:  { text: "Explore",     href: "#products" },
    ctaSecondary:{ text: "Learn More",  href: "#about"    },
    bgImage:     "https://images.unsplash.com/photo-1493957988430-a5f2e15f39a3?w=1600&q=80",
    overlayOpacity: 0.72,
  },

  about: {
    heading:   "Built Different. Sold Here.",
    body: [
      "NOIR is a Los Angeles concept store stocking the objects serious people rely on. We work with fewer than 30 suppliers globally, each chosen for obsessive quality control.",
      "Walk in knowing everything on the floor has survived our team's use before it reaches yours."
    ],
    image:     "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80",
    stats: [
      { value: "<30",  label: "Global Suppliers" },
      { value: "100%", label: "Staff Tested" },
      { value: "5yr",  label: "Avg. Product Lifespan" },
    ],
  },

  categories: ["All", "Tools", "Tech", "Apparel", "Bags", "Objects"],

  products: [
    {
      id: "n1",
      name: "Swiss Folding Knife",
      category: "Tools",
      price: 195,
      description: "156-layer Damascus steel blade. G10 handle. 5 functions. Lifetime guarantee. Made in Solothurn.",
      image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=800&q=80",
      images: [],
      tags: ["bestseller"],
      available: true,
      options: [
        { label: "Handle", choices: ["Black G10", "Carbon Fiber", "Raw Titanium"] },
      ],
    },
    {
      id: "n2",
      name: "Slim Leather Wallet",
      category: "Bags",
      price: 145,
      description: "5-card capacity. Full-grain vegetable-tanned Italian hide. RFID blocking liner. Gains character for life.",
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
      images: [],
      tags: ["new"],
      available: true,
      options: [
        { label: "Color", choices: ["Cognac", "Raven Black", "Tobacco"] },
      ],
    },
    {
      id: "n3",
      name: "Titanium Pen",
      category: "Objects",
      price: 220,
      description: "Grade 5 titanium body. Machined to ±0.001in tolerance. Accepts Parker refills. Clip doubles as a pry bar.",
      image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&q=80",
      images: [],
      tags: ["bestseller"],
      available: true,
      options: [
        { label: "Finish", choices: ["Natural Ti", "Stonewashed", "PVD Black"] },
      ],
    },
    {
      id: "n4",
      name: "Merino Base Layer",
      category: "Apparel",
      price: 165,
      description: "210gsm Merino wool. Temperature regulates -10°C to +20°C. Odour resistant. Ethical ZQ certified flock.",
      image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80",
      images: [],
      tags: [],
      available: true,
      options: [
        { label: "Size",  choices: ["XS", "S", "M", "L", "XL"] },
        { label: "Color", choices: ["Black", "Slate", "Stone"] },
      ],
    },
    {
      id: "n5",
      name: "Headlamp Pro",
      category: "Tech",
      price: 89,
      description: "1000 lumen output. Red night mode. 200m beam. IPX8 waterproof. USB-C rechargeable. 6h burn time.",
      image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
      images: [],
      tags: ["new"],
      available: true,
      options: [],
    },
    {
      id: "n6",
      name: "Waxed Canvas Tote",
      category: "Bags",
      price: 245,
      description: "Heavy 18oz waxed canvas. Bridle leather handles with brass hardware. Internal laptop sleeve. Made in Brooklyn.",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
      images: [],
      tags: ["sale"],
      available: true,
      options: [
        { label: "Color", choices: ["Dark Olive", "Black", "Waxed Navy"] },
      ],
    },
  ],

  featured: ["n1", "n3", "n2", "n6"],

  testimonials: [
    {
      name:   "Tyler M.",
      role:   "Architect + Gear Nerd",
      quote:  "NOIR is the only store I trust when I need something that works without thinking. The curation is merciless — that's a compliment.",
      avatar: "https://randomuser.me/api/portraits/men/52.jpg",
      stars:  5,
    },
    {
      name:   "Priya S.",
      role:   "Expedition Leader",
      quote:  "Bought the headlamp on a recommendation. It replaced two pieces of gear I'd been using for years. Instantly trust this store.",
      avatar: "https://randomuser.me/api/portraits/women/29.jpg",
      stars:  5,
    },
    {
      name:   "Dan C.",
      role:   "Verified Buyer",
      quote:  "The titanium pen is the best object I own. I've recommended it to eight people. No complaints from any of them.",
      avatar: "https://randomuser.me/api/portraits/men/74.jpg",
      stars:  5,
    },
  ],

  form: {
    submitMethod:  "formspree",
    mailtoAddress: "studio@noir.co",
    formspreeId:   "",
    emailjs: {
      enabled:    false,
      serviceId:  "",
      templateId: "",
      publicKey:  "",
    },
    netlify: false,
  },

};

window.__SITE_CONFIG = CONFIG;