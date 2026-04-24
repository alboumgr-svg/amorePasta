/**
 * app.js — VOLTA Retail Template
 * ============================================================
 * This file reads window.__SITE_CONFIG (set in config.js)
 * and dynamically builds every section.
 *
 * DO NOT hardcode anything here. Edit config.js only.
 *
 * Sections built:
 *   applyTheme()         → CSS variables & font injection
 *   buildNav()           → logo, hamburger
 *   buildHero()          → headline, CTA
 *   buildAbout()         → text, image, stats
 *   buildFeatured()      → filtered product cards
 *   buildProductGrid()   → filter bar + all products
 *   buildTestimonials()
 *   buildContact()       → details, hours, map
 *   buildOrderForm()     → product select, options, submit
 *   buildFooter()        → logo, links, social, copyright
 *   initModal()          → product detail overlay
 *   initScrollReveal()   → IntersectionObserver
 *   initNavScroll()      → sticky shadow
 *   initHamburger()      → mobile menu
 * ============================================================
 */

(function () {
  "use strict";

  const C = window.__SITE_CONFIG;
  if (!C) { console.error("config.js not loaded."); return; }

  /* ── Helpers ────────────────────────────────────────── */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const el = (tag, cls, inner) => {
    const e = document.createElement(tag);
    if (cls)   e.className = cls;
    if (inner !== undefined) e.innerHTML = inner;
    return e;
  };
  const fmt = price =>
    typeof price === "number"
      ? "$" + price.toLocaleString("en-US", { minimumFractionDigits: 0 })
      : "";

  /* ── Hide disabled sections ─────────────────────────── */
  function applySectionToggles() {
    const map = {
      hero:         "#hero",
      about:        "#about",
      featured:     "#featured",
      products:     "#products",
      testimonials: "#testimonials",
      contact:      "#contact, #order",
      footer:       "#footer",
    };
    Object.entries(C.sections).forEach(([key, enabled]) => {
      if (!enabled) {
        $$(map[key] || "").forEach(s => s && (s.style.display = "none"));
      }
    });
  }

  /* ── 1. THEME ────────────────────────────────────────── */
  function applyTheme() {
    const body = document.body;

    // Apply preset or custom
    if (C.theme === "dark")  body.classList.add("theme-dark");
    else if (C.theme === "light") body.classList.add("theme-light");
    else {
      // Custom — inject CSS variables from config
      const vars = C.colors || {};
      const style = document.createElement("style");
      style.textContent = `:root {
        ${vars.primary       ? `--color-primary: ${vars.primary};` : ""}
        ${vars.primaryHover  ? `--color-primary-hover: ${vars.primaryHover};` : ""}
        ${vars.accent        ? `--color-accent: ${vars.accent};` : ""}
        ${vars.accentHover   ? `--color-accent-hover: ${vars.accentHover};` : ""}
        ${vars.bg            ? `--color-bg: ${vars.bg};` : ""}
        ${vars.bgAlt         ? `--color-bg-alt: ${vars.bgAlt};` : ""}
        ${vars.surface       ? `--color-surface: ${vars.surface};` : ""}
        ${vars.text          ? `--color-text: ${vars.text};` : ""}
        ${vars.textMuted     ? `--color-text-muted: ${vars.textMuted};` : ""}
        ${vars.border        ? `--color-border: ${vars.border};` : ""}
        ${vars.navBg         ? `--color-nav-bg: ${vars.navBg};` : ""}
        ${vars.footerBg      ? `--color-footer-bg: ${vars.footerBg};` : ""}
        ${vars.footerText    ? `--color-footer-text: ${vars.footerText};` : ""}
      }`;
      document.head.appendChild(style);
    }

    // Inject custom font variables
    const fonts = C.fonts || {};
    const fontStyle = document.createElement("style");
    fontStyle.textContent = `:root {
      ${fonts.display ? `--font-display: ${fonts.display};` : ""}
      ${fonts.body    ? `--font-body: ${fonts.body};` : ""}
      ${fonts.mono    ? `--font-mono: ${fonts.mono};` : ""}
    }`;
    document.head.appendChild(fontStyle);

    // Page title
    document.title = `${C.business.name} — ${C.business.tagline}`;
  }

  /* ── 2. NAV ─────────────────────────────────────────── */
  function buildNav() {
    const logoImg  = $("#nav-logo-img");
    const logoText = $("#nav-logo-text");

    if (C.business.logoUrl) {
      logoImg.src = C.business.logoUrl;
      logoImg.alt = C.business.name;
      logoImg.style.display = "block";
      logoText.style.display = "none";
    } else {
      logoText.textContent = C.business.logoText || C.business.name;
    }
  }

  /* ── 3. HERO ─────────────────────────────────────────── */
  function buildHero() {
    const hero = C.hero;
    if (!hero) return;

    const section = $("#hero");
    if (hero.bgImage) {
      section.style.backgroundImage = `url('${hero.bgImage}')`;
    }

    const overlay = $("#hero-overlay");
    overlay.style.opacity = hero.overlayOpacity ?? 0.5;

    $("#hero-eyebrow").textContent   = C.business.tagline || "";
    $("#hero-headline").textContent  = hero.headline || "";
    $("#hero-sub").textContent       = hero.subheadline || "";

    const ctaP = $("#hero-cta-primary");
    ctaP.textContent = hero.ctaPrimary?.text || "Shop";
    ctaP.href        = hero.ctaPrimary?.href || "#products";

    const ctaS = $("#hero-cta-secondary");
    ctaS.textContent = hero.ctaSecondary?.text || "About";
    ctaS.href        = hero.ctaSecondary?.href || "#about";
  }

  /* ── 4. ABOUT ────────────────────────────────────────── */
  function buildAbout() {
    const a = C.about;
    if (!a) return;

    $("#about-heading").textContent = a.heading || "";

    const bodyEl = $("#about-body");
    (a.body || []).forEach(para => {
      const p = document.createElement("p");
      p.textContent = para;
      bodyEl.appendChild(p);
    });

    const img = $("#about-img");
    img.src = a.image || "";
    img.alt = "About " + C.business.name;

    const statsEl = $("#about-stats");
    (a.stats || []).forEach(s => {
      const div = el("div", "stat-item");
      div.innerHTML = `
        <span class="stat-value">${s.value}</span>
        <span class="stat-label">${s.label}</span>
      `;
      statsEl.appendChild(div);
    });
  }

  /* ── TAG BADGE ───────────────────────────────────────── */
  function tagBadges(tags = []) {
    return tags.map(t => `<span class="tag tag-${t}">${t}</span>`).join("");
  }

  /* ── PRODUCT CARD (reused in featured + grid) ────────── */
  function createCard(product, featured = false) {
    const card = el("div", `product-card${!product.available ? " unavailable" : ""}`);
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View ${product.name}`);
    card.dataset.id = product.id;

    card.innerHTML = `
      <div class="card-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <div class="card-tags">${tagBadges(product.tags)}</div>
        <button class="card-overlay-btn" tabindex="-1" aria-hidden="true">Quick View</button>
      </div>
      <div class="card-info">
        <p class="card-category">${product.category}</p>
        <p class="card-name">${product.name}</p>
        ${product.price ? `<p class="card-price">${fmt(product.price)}</p>` : ""}
      </div>
    `;

    // Open modal on click or Enter
    const openModal = () => showModal(product.id);
    card.addEventListener("click", openModal);
    card.addEventListener("keydown", e => e.key === "Enter" && openModal());

    return card;
  }

  /* ── 5. FEATURED ─────────────────────────────────────── */
  function buildFeatured() {
    const grid = $("#featured-grid");
    if (!grid) return;

    const ids = C.featured || [];
    const products = ids
      .map(id => C.products.find(p => p.id === id))
      .filter(Boolean);

    products.forEach((p, i) => {
      const card = createCard(p, true);
      card.classList.add("reveal");
      card.style.transitionDelay = `${i * 0.1}s`;
      grid.appendChild(card);
    });
  }

  /* ── 6. PRODUCT GRID + FILTER ────────────────────────── */
  let activeFilter = "All";

  function buildFilterBar() {
    const bar = $("#filter-bar");
    if (!bar) return;

    (C.categories || ["All"]).forEach(cat => {
      const btn = el("button", `filter-btn${cat === "All" ? " active" : ""}`, cat);
      btn.setAttribute("aria-pressed", cat === "All" ? "true" : "false");
      btn.addEventListener("click", () => {
        activeFilter = cat;
        $$(".filter-btn").forEach(b => {
          b.classList.toggle("active", b.textContent === cat);
          b.setAttribute("aria-pressed", b.textContent === cat ? "true" : "false");
        });
        renderProductGrid();
      });
      bar.appendChild(btn);
    });
  }

  function renderProductGrid() {
    const grid = $("#product-grid");
    grid.innerHTML = "";

    const filtered = activeFilter === "All"
      ? C.products
      : C.products.filter(p => p.category === activeFilter);

    if (!filtered.length) {
      grid.innerHTML = `<p style="color:var(--color-text-muted); grid-column:1/-1; text-align:center; padding:3rem 0;">No products in this category.</p>`;
      return;
    }

    filtered.forEach((p, i) => {
      const card = createCard(p);
      card.style.animationDelay = `${i * 0.05}s`;
      grid.appendChild(card);
    });

    // Re-observe for scroll reveal
    initScrollReveal();
  }

  function buildProductGrid() {
    $("#products-heading").textContent = "All Products";
    buildFilterBar();
    renderProductGrid();
  }

  /* ── 7. TESTIMONIALS ─────────────────────────────────── */
  function buildTestimonials() {
    const grid = $("#testimonial-grid");
    if (!grid) return;

    (C.testimonials || []).forEach((t, i) => {
      const stars = "★".repeat(t.stars || 5);
      const card = el("div", "testimonial-card reveal");
      card.style.transitionDelay = `${i * 0.12}s`;
      card.innerHTML = `
        <p class="stars">${stars}</p>
        <p class="testimonial-quote">"${t.quote}"</p>
        <div class="testimonial-author">
          <img src="${t.avatar}" alt="${t.name}" loading="lazy" />
          <div>
            <p class="testimonial-name">${t.name}</p>
            <p class="testimonial-role">${t.role}</p>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  /* ── 8. CONTACT ──────────────────────────────────────── */
  function buildContact() {
    const b = C.business;

    $("#contact-heading").textContent = "Get in Touch";

    const details = $("#contact-details");
    const rows = [
      { icon: "✉", label: b.email,   href: `mailto:${b.email}` },
      { icon: "☎", label: b.phone,   href: `tel:${b.phone}` },
      { icon: "⌖", label: b.address, href: null },
    ].filter(r => r.label);

    rows.forEach(r => {
      const p = document.createElement("p");
      p.innerHTML = `
        <span class="contact-icon" aria-hidden="true">${r.icon}</span>
        ${r.href
          ? `<a href="${r.href}" rel="noopener">${r.label}</a>`
          : `<span>${r.label}</span>`}
      `;
      details.appendChild(p);
    });

    // Hours
    const hoursWrap = $("#hours-block");
    if (C.hours?.length) {
      const h4 = el("h4", null, "Hours");
      hoursWrap.appendChild(h4);
      C.hours.forEach(h => {
        const row = el("div", "hours-row");
        row.innerHTML = `<span class="hours-day">${h.day}</span><span class="hours-time">${h.time}</span>`;
        hoursWrap.appendChild(row);
      });
    }

    // Map
    const mapFrame = $("#map-iframe");
    if (b.mapEmbedUrl) {
      mapFrame.src = b.mapEmbedUrl;
    } else {
      mapFrame.parentElement.style.display = "none";
    }
  }

  /* ── 9. ORDER FORM ───────────────────────────────────── */

  // Cart state — array of {product, qty, options, uid}
  const cart = [];

  function buildOrderForm() {
    const select = $("#form-product");

    // Populate product dropdown
    C.products.filter(p => p.available).forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = `${p.name}${p.price ? ` — ${fmt(p.price)}` : ""}`;
      select.appendChild(opt);
    });

    // On product change → rebuild options
    select.addEventListener("change", () => {
      const p = C.products.find(x => x.id === select.value);
      buildFormOptions(p);
    });

    // "Add to Order" button
    $("#form-add-btn").addEventListener("click", addToCart);

    // Form submit
    $("#order-form").addEventListener("submit", handleFormSubmit);
  }

  /* ── Add selected product to cart ── */
  function addToCart() {
    const select = $("#form-product");
    if (!select.value) {
      select.style.borderColor = "#E04E4E";
      select.focus();
      return;
    }
    select.style.borderColor = "";

    const product = C.products.find(p => p.id === select.value);
    const qty     = Math.max(1, parseInt($("#form-qty").value, 10) || 1);

    // Collect any option selects
    const options = {};
    $$("#form-options select").forEach(s => {
      if (s.value) options[s.getAttribute("aria-label")] = s.value;
    });

    cart.push({ product, qty, options, uid: Date.now() });
    renderCart();

    // Reset product picker + options (keep customer info intact)
    select.value = "";
    $("#form-options").innerHTML = "";
    $("#form-qty").value = 1;
  }

  /* ── Remove item from cart ── */
  function removeFromCart(uid) {
    const i = cart.findIndex(x => x.uid === uid);
    if (i !== -1) cart.splice(i, 1);
    renderCart();
  }

  /* ── Render the live cart list ── */
  function renderCart() {
    const listEl   = $("#cart-list");
    const emptyMsg = $("#cart-empty-msg");
    const totalRow = $("#cart-total-row");
    const totalVal = $("#cart-total-val");

    // Clear existing items (keep empty-msg node)
    $$(".cart-item", listEl).forEach(n => n.remove());

    if (!cart.length) {
      emptyMsg.style.display = "";
      totalRow.style.display = "none";
      return;
    }

    emptyMsg.style.display = "none";
    totalRow.style.display = "flex";

    let total = 0;
    cart.forEach(item => {
      const p       = item.product;
      const lineAmt = (p.price || 0) * item.qty;
      total += lineAmt;

      const optStr = Object.entries(item.options)
        .map(([k, v]) => `${k}: ${v}`).join(" · ");

      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <img class="cart-item-img" src="${p.image}" alt="${p.name}" loading="lazy" />
        <div>
          <p class="cart-item-name">${p.name}</p>
          <p class="cart-item-sub">Qty ${item.qty}${optStr ? " · " + optStr : ""}</p>
        </div>
        <div class="cart-item-right">
          <span class="cart-item-price">${p.price ? fmt(lineAmt) : "—"}</span>
          <button class="cart-remove-btn" aria-label="Remove ${p.name}">Remove</button>
        </div>
      `;
      row.querySelector(".cart-remove-btn").addEventListener("click", () => removeFromCart(item.uid));
      listEl.appendChild(row);
    });

    // Scroll to show newest item
    listEl.scrollTop = listEl.scrollHeight;
    totalVal.textContent = total ? fmt(total) : "—";
  }

  function buildFormOptions(product) {
    const wrap = $("#form-options");
    wrap.innerHTML = "";
    if (!product?.options?.length) return;

    product.options.forEach(opt => {
      const group = el("div", "field-group");
      const label = el("label", null, opt.label);
      const sel = el("select");
      sel.name = "option_" + opt.label.toLowerCase().replace(/\s+/g, "_");
      sel.setAttribute("aria-label", opt.label);

      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = `— ${opt.label} —`;
      sel.appendChild(placeholder);

      opt.choices.forEach(ch => {
        const o = document.createElement("option");
        o.value = ch;
        o.textContent = ch;
        sel.appendChild(o);
      });

      group.appendChild(label);
      group.appendChild(sel);
      wrap.appendChild(group);
    });
  }

  // Pre-fill form from modal → scrolls to order section
  window.__prefillForm = function (productId) {
    const sel = $("#form-product");
    sel.value = productId;
    sel.dispatchEvent(new Event("change"));
    document.querySelector("#order").scrollIntoView({ behavior: "smooth" });
  };

  function handleFormSubmit(e) {
    e.preventDefault();
    const form   = e.target;
    const fb     = $("#form-feedback");
    const btn    = $("#form-submit");
    const method = C.form?.submitMethod || "mailto";

    // Must have at least one cart item + customer name + email
    if (!cart.length) {
      showFeedback(fb, "Please add at least one item to your order.", "error");
      return;
    }
    const required = ["form-name", "form-email"];
    let valid = true;
    required.forEach(id => {
      const field = document.getElementById(id);
      if (!field.value.trim()) { field.style.borderColor = "#E04E4E"; valid = false; }
      else field.style.borderColor = "";
    });
    if (!valid) {
      showFeedback(fb, "Please fill in your name and email.", "error");
      return;
    }

    const data = new FormData(form);

    // Build cart summary for email body
    const cartLines = cart.map(item => {
      const optStr = Object.entries(item.options).map(([k,v]) => `${k}: ${v}`).join(", ");
      return `• ${item.product.name} x${item.qty}${optStr ? ` (${optStr})` : ""}${item.product.price ? " — " + fmt(item.product.price * item.qty) : ""}`;
    }).join("\n");

    if (method === "mailto") {
      const subject = encodeURIComponent(`Order Inquiry — ${C.business.name}`);
      const body = encodeURIComponent(
        `ORDER\n${cartLines}\n\n` +
        `Name: ${data.get("name")}\n` +
        `Email: ${data.get("email")}\n` +
        `Phone: ${data.get("phone") || "N/A"}\n` +
        `Notes: ${data.get("notes") || "N/A"}`
      );
      window.location.href = `mailto:${C.form.mailtoAddress}?subject=${subject}&body=${body}`;
      showFeedback(fb, "Your email client should open now. Thank you!", "success");
      return;
    }

    if (method === "formspree") {
      btn.disabled = true;
      btn.textContent = "Sending…";
      const cartInput = document.createElement("input");
      cartInput.type = "hidden"; cartInput.name = "cart"; cartInput.value = cartLines;
      form.appendChild(cartInput);
      fetch(`https://formspree.io/f/${C.form.formspreeId}`, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" },
      })
        .then(r => r.json())
        .then(json => {
          if (json.ok || json.next) {
            form.reset(); cart.length = 0; renderCart();
            showFeedback(fb, "Message sent! We'll be in touch within 24 hours.", "success");
          } else {
            showFeedback(fb, "Something went wrong. Please try again.", "error");
          }
        })
        .catch(() => showFeedback(fb, "Network error. Please try again.", "error"))
        .finally(() => { btn.disabled = false; btn.textContent = "Send Inquiry"; form.removeChild(cartInput); });
      return;
    }

    if (method === "netlify") {
      form.setAttribute("data-netlify", "true");
      form.setAttribute("name", "order");
      form.submit();
      return;
    }

    showFeedback(fb, "Form submission not configured. See config.js → form.submitMethod.", "error");
  }

  function showFeedback(el, msg, type) {
    el.textContent = msg;
    el.className = `form-feedback ${type}`;
    el.style.display = "block";
    setTimeout(() => { el.style.display = "none"; }, 7000);
  }

  /* ── 10. FOOTER ──────────────────────────────────────── */
  function buildFooter() {
    const b = C.business;

    $("#footer-logo-text").textContent = C.business.logoText || C.business.name;
    $("#footer-tagline").textContent   = C.business.tagline || "";

    // Social links
    const socialWrap = $("#social-links");
    const socialMap = {
      instagram: "IG",
      facebook:  "FB",
      twitter:   "TW",
      pinterest: "PT",
      tiktok:    "TK",
    };
    Object.entries(C.social || {}).forEach(([key, url]) => {
      if (!url) return;
      const a = el("a", "social-link", socialMap[key] || key.toUpperCase());
      a.href   = url;
      a.target = "_blank";
      a.rel    = "noopener noreferrer";
      a.setAttribute("aria-label", key);
      socialWrap.appendChild(a);
    });

    // Footer contact
    const fc = $("#footer-contact-details");
    if (b.email) fc.innerHTML += `<p><a href="mailto:${b.email}">${b.email}</a></p>`;
    if (b.phone) fc.innerHTML += `<p><a href="tel:${b.phone}">${b.phone}</a></p>`;
    if (b.address) fc.innerHTML += `<p>${b.address}</p>`;

    // Copyright
    const year = new Date().getFullYear();
    $("#footer-copy").textContent = `© ${year} ${b.name}. All rights reserved.`;
  }

  /* ── 11. MODAL ───────────────────────────────────────── */
  function initModal() {
    const overlay = $("#modal-overlay");
    const closeBtn = $("#modal-close");

    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", e => {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && !overlay.hidden) closeModal();
    });
  }

  function showModal(productId) {
    const p = C.products.find(x => x.id === productId);
    if (!p) return;

    const overlay = $("#modal-overlay");

    $("#modal-img").src           = p.image;
    $("#modal-img").alt           = p.name;
    $("#modal-category").textContent  = p.category;
    $("#modal-product-name").textContent = p.name;
    $("#modal-price").textContent  = p.price ? fmt(p.price) : "";
    $("#modal-desc").textContent   = p.description || "";

    // Tags
    const tagsEl = $("#modal-tags");
    tagsEl.innerHTML = tagBadges(p.tags || []);

    // Options
    const optsEl = $("#modal-options");
    optsEl.innerHTML = "";
    (p.options || []).forEach(opt => {
      const group = el("div", "option-group");
      group.innerHTML = `<label>${opt.label}</label>`;
      const choices = el("div", "option-choices");
      opt.choices.forEach(ch => {
        const btn = el("button", "option-chip", ch);
        btn.type = "button";
        btn.addEventListener("click", () => {
          $$(".option-chip", group).forEach(c => c.classList.remove("selected"));
          btn.classList.add("selected");
        });
        choices.appendChild(btn);
      });
      group.appendChild(choices);
      optsEl.appendChild(group);
    });

    // Order button → prefill form
    $("#modal-order-btn").onclick = () => {
      closeModal();
      window.__prefillForm(p.id);
    };

    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeModal() {
    const overlay = $("#modal-overlay");
    overlay.hidden = true;
    document.body.style.overflow = "";
  }

  /* ── 12. SCROLL REVEAL ───────────────────────────────── */
  function initScrollReveal() {
    const items = $$(".reveal");
    if (!items.length) return;

    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(item => obs.observe(item));
  }

  /* ── 13. NAV SCROLL ──────────────────────────────────── */
  function initNavScroll() {
    const nav = $("#navbar");
    const onScroll = () => {
      nav.classList.toggle("scrolled", window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ── 14. HAMBURGER ───────────────────────────────────── */
  function initHamburger() {
    const btn   = $("#hamburger");
    const links = $("#nav-links");

    btn.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      btn.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open);
    });

    // Close on link click
    links.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        links.classList.remove("open");
        btn.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ── 15. SMOOTH ACTIVE NAV (optional enhancement) ───── */
  function initActiveNav() {
    const sections = $$("section[id]");
    const navLinks = $$(".nav-links a:not(.btn)");

    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(a => {
              a.style.color = a.getAttribute("href") === `#${id}`
                ? "var(--color-text)"
                : "";
            });
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach(s => obs.observe(s));
  }

  /* ── INIT ─────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    applyTheme();
    applySectionToggles();
    buildNav();
    buildHero();
    buildAbout();
    buildFeatured();
    buildProductGrid();
    buildTestimonials();
    buildContact();
    buildOrderForm();
    buildFooter();
    initModal();
    initScrollReveal();
    initNavScroll();
    initHamburger();
    initActiveNav();
  });

})();