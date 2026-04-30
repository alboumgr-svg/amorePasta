/**
 * app.js — Retail Template
 * ============================================================
 * KEY ADDITIONS vs. previous version:
 *  - resolvePrice()    → reads priceModifiers[] from options in config.js
 *  - createCard()      → inline option chips + qty stepper + live price
 *  - saveCart/loadCart → localStorage persistence across refreshes
 *  - generateOrderId() → unique #ID per submission
 *  - handleFormSubmit  → invoice-style Formspree payload + optional EmailJS
 *  - showOrderSuccess  → full-screen confirmation overlay
 * ============================================================
 */

(function () {
  "use strict";

  const C = window.__SITE_CONFIG;
  if (!C) { console.error("config.js not loaded."); return; }

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const el = (tag, cls, inner) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (inner !== undefined) e.innerHTML = inner;
    return e;
  };
  const fmt = price =>
    typeof price === "number"
      ? "$" + price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : "";

  /**
   * resolvePrice — dynamic pricing engine.
   *
   * Checks each option on a product for a priceModifiers[] array.
   * priceModifiers maps 1-to-1 with choices[], so selecting choices[1]
   * uses priceModifiers[1] as the unit price.
   *
   * Falls back to product.price if no priceModifiers found.
   *
   * HOW TO USE IN config.js:
   *   options: [
   *     {
   *       label: "Size",
   *       choices:        ["0.5 lb", "1 lb",  "2 lb"],
   *       priceModifiers: [5.00,     8.00,    15.00],  ← same length as choices
   *     }
   *   ]
   * For options that don't affect price (color, finish, etc.),
   * simply omit priceModifiers from that option object.
   */
  function resolvePrice(product, selectedOptions) {
    for (const opt of product.options || []) {
      if (!opt.priceModifiers) continue;
      const selected = selectedOptions[opt.label];
      if (selected !== undefined) {
        const idx = opt.choices.indexOf(selected);
        if (idx !== -1 && opt.priceModifiers[idx] !== undefined) {
          return opt.priceModifiers[idx];
        }
      }
      // Nothing selected yet — return first modifier as default display price
      if (opt.priceModifiers.length > 0) return opt.priceModifiers[0];
    }
    return product.price || 0;
  }

  /* ── Cart persistence key (unique per business name) ── */
  const STORAGE_KEY = "cart_" +
    (C.business.name || "store").replace(/\W+/g, "_").toLowerCase();

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
      if (!enabled) $$(map[key] || "").forEach(s => s && (s.style.display = "none"));
    });
  }

  /* ── 1. THEME ─────────────────────────────────────────── */
  function applyTheme() {
    const body = document.body;
    if (C.theme === "dark") body.classList.add("theme-dark");
    else if (C.theme === "light") body.classList.add("theme-light");
    else {
      const vars = C.colors || {};
      const style = document.createElement("style");
      style.textContent = `:root {
        ${vars.primary      ? `--color-primary: ${vars.primary};`            : ""}
        ${vars.primaryHover ? `--color-primary-hover: ${vars.primaryHover};` : ""}
        ${vars.accent       ? `--color-accent: ${vars.accent};`              : ""}
        ${vars.accentHover  ? `--color-accent-hover: ${vars.accentHover};`   : ""}
        ${vars.bg           ? `--color-bg: ${vars.bg};`                      : ""}
        ${vars.bgAlt        ? `--color-bg-alt: ${vars.bgAlt};`               : ""}
        ${vars.surface      ? `--color-surface: ${vars.surface};`            : ""}
        ${vars.text         ? `--color-text: ${vars.text};`                  : ""}
        ${vars.textMuted    ? `--color-text-muted: ${vars.textMuted};`       : ""}
        ${vars.border       ? `--color-border: ${vars.border};`              : ""}
        ${vars.navBg        ? `--color-nav-bg: ${vars.navBg};`               : ""}
        ${vars.footerBg     ? `--color-footer-bg: ${vars.footerBg};`         : ""}
        ${vars.footerText   ? `--color-footer-text: ${vars.footerText};`     : ""}
      }`;
      document.head.appendChild(style);
    }
    const fonts = C.fonts || {};
    const fontStyle = document.createElement("style");
    fontStyle.textContent = `:root {
      ${fonts.display ? `--font-display: ${fonts.display};` : ""}
      ${fonts.body    ? `--font-body: ${fonts.body};`       : ""}
      ${fonts.mono    ? `--font-mono: ${fonts.mono};`       : ""}
    }`;
    document.head.appendChild(fontStyle);
    document.title = `${C.business.name} — ${C.business.tagline}`;

    // Load EmailJS SDK — initialises once public key is set in config.js
    const ejsScript = document.createElement("script");
    ejsScript.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    ejsScript.onload = () => {
      if (C.form?.emailjs?.publicKey) emailjs.init(C.form.emailjs.publicKey);
    };
    document.head.appendChild(ejsScript);
  }

  /* ── 2. NAV ───────────────────────────────────────────── */
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

  /* ── 3. HERO ──────────────────────────────────────────── */
  function buildHero() {
    const hero = C.hero;
    if (!hero) return;
    const section = $("#hero");
    if (hero.bgImage) section.style.backgroundImage = `url('${hero.bgImage}')`;
    $("#hero-overlay").style.opacity = hero.overlayOpacity ?? 0.5;
    $("#hero-eyebrow").textContent  = C.business.tagline || "";
    $("#hero-headline").textContent = hero.headline || "";
    $("#hero-sub").textContent      = hero.subheadline || "";
    const ctaP = $("#hero-cta-primary");
    ctaP.textContent = hero.ctaPrimary?.text || "Shop";
    ctaP.href        = hero.ctaPrimary?.href || "#products";
    const ctaS = $("#hero-cta-secondary");
    ctaS.textContent = hero.ctaSecondary?.text || "About";
    ctaS.href        = hero.ctaSecondary?.href || "#about";
  }

  /* ── 4. ABOUT ─────────────────────────────────────────── */
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
      div.innerHTML = `<span class="stat-value">${s.value}</span><span class="stat-label">${s.label}</span>`;
      statsEl.appendChild(div);
    });
  }

  /* ── TAG BADGE ────────────────────────────────────────── */
  function tagBadges(tags = []) {
    return tags.map(t => `<span class="tag tag-${t}">${t}</span>`).join("");
  }

  /* ─────────────────────────────────────────────────────────
     PRODUCT CARD
     - Inline option chips with live price update
     - Qty stepper
     - Add to Cart (no modal needed)
     - Image/name still open modal for detail view
   ───────────────────────────────────────────────────────── */
  function createCard(product) {
    const card = el("div", `product-card${!product.available ? " unavailable" : ""}`);
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "article");
    card.setAttribute("aria-label", product.name);
    card.dataset.id = product.id;

    // Per-card state
    const cardState = { options: {}, qty: 1 };

    /* Image — click opens modal */
    const imgDiv = el("div", "card-image");
    imgDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      <div class="card-tags">${tagBadges(product.tags)}</div>
      <button class="card-overlay-btn" tabindex="-1" aria-hidden="true">Quick View</button>
    `;
    imgDiv.addEventListener("click", e => { e.stopPropagation(); showModal(product.id); });
    card.appendChild(imgDiv);

    /* Info section */
    const infoDiv = el("div", "card-info");
    infoDiv.appendChild(el("p", "card-category", product.category));

    const nameP = el("p", "card-name", product.name);
    nameP.style.cursor = "pointer";
    nameP.addEventListener("click", e => { e.stopPropagation(); showModal(product.id); });
    infoDiv.appendChild(nameP);

    /* Inline option chips per option group */
    (product.options || []).forEach(opt => {
      const optGroup = el("div", "card-option-group");
      optGroup.appendChild(el("span", "card-option-label", opt.label));

      const chipsWrap = el("div", "card-option-chips");
      opt.choices.forEach((choice, idx) => {
        // Show price hint if priceModifiers defined
        const priceHint = opt.priceModifiers?.[idx] !== undefined
          ? ` <span class="chip-price">${fmt(opt.priceModifiers[idx])}</span>`
          : "";
        const chip = el("button", "card-chip");
        chip.type = "button";
        chip.innerHTML = choice + priceHint;

        // Pre-select first choice
        if (idx === 0) {
          chip.classList.add("selected");
          cardState.options[opt.label] = choice;
        }

        chip.addEventListener("click", e => {
          e.stopPropagation();
          $$(".card-chip", chipsWrap).forEach(c => c.classList.remove("selected"));
          chip.classList.add("selected");
          cardState.options[opt.label] = choice;
          priceP.textContent = fmt(resolvePrice(product, cardState.options));
        });
        chipsWrap.appendChild(chip);
      });
      optGroup.appendChild(chipsWrap);
      infoDiv.appendChild(optGroup);
    });

    /* Live price */
    const priceP = el("p", "card-price", fmt(resolvePrice(product, cardState.options)));
    infoDiv.appendChild(priceP);

    /* Qty stepper */
    const qtyWrap = el("div", "card-qty-wrap");
    qtyWrap.appendChild(el("span", "card-qty-label", "Qty"));

    const qtyMinus = el("button", "card-qty-btn", "−");
    qtyMinus.type = "button";
    qtyMinus.setAttribute("aria-label", "Decrease quantity");

    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.min  = "1";
    qtyInput.value = "1";
    qtyInput.className = "card-qty-input";
    qtyInput.setAttribute("aria-label", "Quantity");

    const qtyPlus = el("button", "card-qty-btn", "+");
    qtyPlus.type = "button";
    qtyPlus.setAttribute("aria-label", "Increase quantity");

    const nudgeQty = delta => {
      const v = Math.max(1, (parseInt(qtyInput.value) || 1) + delta);
      qtyInput.value = v;
      cardState.qty  = v;
    };
    qtyMinus.addEventListener("click", e => { e.stopPropagation(); nudgeQty(-1); });
    qtyPlus.addEventListener ("click", e => { e.stopPropagation(); nudgeQty(+1); });
    qtyInput.addEventListener("input", e => {
      e.stopPropagation();
      cardState.qty = Math.max(1, parseInt(qtyInput.value) || 1);
    });
    qtyInput.addEventListener("click", e => e.stopPropagation());

    qtyWrap.appendChild(qtyMinus);
    qtyWrap.appendChild(qtyInput);
    qtyWrap.appendChild(qtyPlus);
    infoDiv.appendChild(qtyWrap);

    /* Add to Cart button */
    const addBtn = el("button", "card-add-btn", "+ Add to Cart");
    addBtn.setAttribute("aria-label", `Add ${product.name} to cart`);
    addBtn.addEventListener("click", e => {
      e.stopPropagation();
      const price = resolvePrice(product, cardState.options);
      addToCart(product, cardState.qty, { ...cardState.options }, price);
      addBtn.textContent = "✓ Added!";
      addBtn.classList.add("added");
      setTimeout(() => {
        addBtn.textContent = "+ Add to Cart";
        addBtn.classList.remove("added");
      }, 1400);
    });
    infoDiv.appendChild(addBtn);

    card.appendChild(infoDiv);
    card.addEventListener("keydown", e => e.key === "Enter" && showModal(product.id));
    return card;
  }

  /* ── 5. FEATURED ──────────────────────────────────────── */
  function buildFeatured() {
    const grid = $("#featured-grid");
    if (!grid) return;

    grid.innerHTML = "";

    const items = C.featured || [];

    if (!items.length) {
      grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;opacity:0.7;">No current updates.</p>`;
      return;
    }

    items.forEach((item, i) => {
      const card = el("div", "product-card reveal");
      card.style.transitionDelay = `${i * 0.1}s`;

      const inner = el("div", "card-info");

      const title = el("p", "card-name", item.title || "");
      const body  = el("p", "card-category", item.body || "");

      card.style.cursor = "default"

      // Fix typography for body text
      body.style.textTransform = "none";     // kill uppercase
      body.style.fontFamily = "var(--font-body)";
      body.style.fontSize = "1rem";       // slightly more readable
      body.style.lineHeight = "1.3";
      body.style.letterSpacing = "normal";
      body.style.opacity = "0.9";
      
      // Override typography for featured titles
      title.style.fontFamily = "var(--font-display)";
      title.style.fontWeight = "700";
      title.style.fontSize = "1.3rem";   // bump it up from 1rem
      title.style.lineHeight = "1.3";
      title.style.letterSpacing = "0.02em"; // optional: cleaner display look

      inner.appendChild(title);
      inner.appendChild(body);

      if (item.mapEmbedUrl) {
        const iframe = document.createElement("iframe");
        iframe.src = item.mapEmbedUrl;
        iframe.style.width = "100%";
        iframe.style.height = "200px";
        iframe.style.border = "0";
        iframe.loading = "lazy";
        inner.appendChild(iframe);
      }

      card.appendChild(inner);
      grid.appendChild(card);
    });
  }

  /* ── 6. PRODUCT GRID + FILTER ─────────────────────────── */
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
      grid.innerHTML = `<p style="color:var(--color-text-muted);grid-column:1/-1;text-align:center;padding:3rem 0;">No products in this category.</p>`;
      return;
    }
    filtered.forEach((p, i) => {
      const card = createCard(p);
      card.style.animationDelay = `${i * 0.05}s`;
      grid.appendChild(card);
    });
    initScrollReveal();
  }

  function buildProductGrid() {
    $("#products-heading").textContent = "All Products";
    buildFilterBar();
    renderProductGrid();
  }

  /* ── 7. TESTIMONIALS ──────────────────────────────────── */
  function buildTestimonials() {
    const grid = $("#testimonial-grid");
    if (!grid) return;
    (C.testimonials || []).forEach((t, i) => {
      const card = el("div", "testimonial-card reveal");
      card.style.transitionDelay = `${i * 0.12}s`;
      card.innerHTML = `
        <p class="stars">${"★".repeat(t.stars || 5)}</p>
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

  /* ── 8. CONTACT ───────────────────────────────────────── */
  function buildContact() {
    const b = C.business;
    $("#contact-heading").textContent = "Get in Touch";
    const details = $("#contact-details");
    [
      { icon: "✉", label: b.email,   href: `mailto:${b.email}`  },
      { icon: "☎", label: b.phone,   href: `tel:${b.phone}`     },
      { icon: "⌖", label: b.address, href: null                 },
    ].filter(r => r.label).forEach(r => {
      const p = document.createElement("p");
      p.innerHTML = `
        <span class="contact-icon" aria-hidden="true">${r.icon}</span>
        ${r.href ? `<a href="${r.href}" rel="noopener">${r.label}</a>` : `<span>${r.label}</span>`}
      `;
      details.appendChild(p);
    });
    const hoursWrap = $("#hours-block");
    if (C.hours?.length) {
      hoursWrap.appendChild(el("h4", null, "Hours"));
      C.hours.forEach(h => {
        const row = el("div", "hours-row");
        row.innerHTML = `<span class="hours-day">${h.day}</span><span class="hours-time">${h.time}</span>`;
        hoursWrap.appendChild(row);
      });
    }
    const mapFrame = $("#map-iframe");
    if (b.mapEmbedUrl) mapFrame.src = b.mapEmbedUrl;
    else mapFrame.parentElement.style.display = "none";
  }

  /* ══════════════════════════════════════════════════════════
     9. CART SYSTEM
  ══════════════════════════════════════════════════════════ */

  const cart = [];

  /* ── Unique order ID e.g. #M3F2A1-XZ9K ── */
  function generateOrderId() {
    const ts   = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `#${ts}-${rand}`;
  }

  /* ── Save cart to localStorage ── */
  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(
        cart.map(({ product, qty, options, resolvedPrice, uid }) => ({
          productId: product.id, qty, options, resolvedPrice, uid,
        }))
      ));
    } catch (e) { /* localStorage unavailable */ }
  }

  /* ── Load cart from localStorage on page load ── */
  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      JSON.parse(raw).forEach(item => {
        const product = C.products.find(p => p.id === item.productId);
        if (product && item.qty > 0) {
          cart.push({ product, qty: item.qty, options: item.options || {},
            resolvedPrice: item.resolvedPrice, uid: item.uid });
        }
      });
      if (cart.length) { renderCart(); updateFAB(); }
    } catch (e) { /* corrupt storage — skip */ }
  }

  /* ── Add to cart ── */
  function addToCart(product, qty, options, resolvedPrice) {
    const price = (resolvedPrice !== undefined && resolvedPrice !== null)
      ? resolvedPrice
      : resolvePrice(product, options);
    cart.push({ product, qty: qty || 1, options: options || {}, resolvedPrice: price, uid: Date.now() });
    saveCart();
    renderCart();
    updateFAB();
  }

  /* ── Remove from cart ── */
  function removeFromCart(uid) {
    const i = cart.findIndex(x => x.uid === uid);
    if (i !== -1) cart.splice(i, 1);
    saveCart();
    renderCart();
    updateFAB();
  }

  /* ── Cart total ── */
  function getCartTotal() {
    return cart.reduce((sum, item) => {
      const p = item.resolvedPrice !== undefined ? item.resolvedPrice : (item.product.price || 0);
      return sum + p * item.qty;
    }, 0);
  }

  /* ── Cart lines for emails ── */
  function cartToLines() {
    return cart.map(item => {
      const price  = item.resolvedPrice !== undefined ? item.resolvedPrice : (item.product.price || 0);
      const optStr = Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(", ");
      return `${item.product.name}${optStr ? ` (${optStr})` : ""} × ${item.qty}  =  ${fmt(price * item.qty)}`;
    });
  }

  /* ── Render live cart panel ── */
  function renderCart() {
    const listEl   = $("#cart-list");
    const emptyMsg = $("#cart-empty-msg");
    const totalRow = $("#cart-total-row");
    const totalVal = $("#cart-total-val");
    if (!listEl) return;

    $$(".cart-item", listEl).forEach(n => n.remove());

    if (!cart.length) {
      if (emptyMsg) emptyMsg.style.display = "";
      if (totalRow) totalRow.style.display = "none";
      return;
    }
    if (emptyMsg) emptyMsg.style.display = "none";
    if (totalRow) totalRow.style.display = "flex";

    cart.forEach(item => {
      const unitPrice = item.resolvedPrice !== undefined
        ? item.resolvedPrice : (item.product.price || 0);
      const lineAmt = unitPrice * item.qty;
      const optStr  = Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(" · ");

      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <img class="cart-item-img" src="${item.product.image}" alt="${item.product.name}" loading="lazy" />
        <div>
          <p class="cart-item-name">${item.product.name}</p>
          <p class="cart-item-sub">Qty ${item.qty}${optStr ? " · " + optStr : ""}</p>
        </div>
        <div class="cart-item-right">
          <span class="cart-item-price">${unitPrice ? fmt(lineAmt) : "—"}</span>
          <button class="cart-remove-btn" aria-label="Remove ${item.product.name}">Remove</button>
        </div>
      `;
      row.querySelector(".cart-remove-btn").addEventListener("click", () => removeFromCart(item.uid));
      listEl.appendChild(row);
    });

    listEl.scrollTop = listEl.scrollHeight;
    if (totalVal) totalVal.textContent = fmt(getCartTotal());
  }

  /* ── Floating cart badge ── */
  function updateFAB() {
    const fab     = $("#cart-fab");
    const countEl = $("#cart-fab-count");
    if (!fab) return;
    const totalQty = cart.reduce((s, i) => s + i.qty, 0);
    if (totalQty === 0) { fab.hidden = true; return; }
    fab.hidden = false;
    countEl.textContent = totalQty;
    countEl.classList.remove("bump");
    void countEl.offsetWidth;
    countEl.classList.add("bump");
    setTimeout(() => countEl.classList.remove("bump"), 300);
  }

  function initFAB() {
    const fab = $("#cart-fab");
    if (!fab) return;
    fab.addEventListener("click", () =>
      document.querySelector("#order").scrollIntoView({ behavior: "smooth" })
    );
  }

  /* ── Order form wiring ── */
  function buildOrderForm() {
    const form = $("#order-form");
    if (form) form.addEventListener("submit", handleFormSubmit);
  }

  /* ── Order success overlay ── */
  function showOrderSuccess(orderId, customerEmail) {
    const overlay = $("#order-success");
    if (!overlay) return;
    $("#success-order-num").textContent = orderId;
    $("#success-email-val").textContent = customerEmail;

    const summaryEl = $("#success-summary");
    summaryEl.innerHTML = "";
    cartToLines().forEach(line => {
      const p = document.createElement("p");
      p.className = "success-line";
      p.textContent = line;
      summaryEl.appendChild(p);
    });
    const totalP = document.createElement("p");
    totalP.className = "success-total";
    totalP.innerHTML = `Total &nbsp;&nbsp; ${fmt(getCartTotal())}`;
    summaryEl.appendChild(totalP);

    overlay.hidden = false;
    document.body.style.overflow = "hidden";

    $("#success-close-btn").onclick = () => {
      overlay.hidden = true;
      document.body.style.overflow = "";
      cart.length = 0;
      saveCart();
      renderCart();
      updateFAB();
      const form = $("#order-form");
      if (form) form.reset();
    };
  }

  /* ── Submit handler — EmailJS only ── */
  function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const fb   = $("#form-feedback");
    const btn  = $("#form-submit");

    // ── Guard: cart must have items ──
    if (!cart.length) {
      showFeedback(fb, "Please add at least one item to your cart first.", "error");
      return;
    }

    // ── Guard: required fields ──
    let valid = true;
    ["form-name", "form-email"].forEach(id => {
      const field = document.getElementById(id);
      if (!field || !field.value.trim()) {
        if (field) field.style.borderColor = "#E04E4E";
        valid = false;
      } else field.style.borderColor = "";
    });
    if (!valid) { showFeedback(fb, "Please fill in your name and email.", "error"); return; }

    // ── Guard: EmailJS must be configured ──
    const ejs = C.form?.emailjs || {};
    if (!ejs.publicKey || !ejs.serviceId || !ejs.orderTemplateId) {
      showFeedback(fb, "Email not configured yet — fill in form.emailjs in config.js.", "error");
      return;
    }

    const data            = new FormData(form);
    const orderId         = generateOrderId();
    const orderDate       = new Date().toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" });
    const customerName    = data.get("name");
    const customerEmail   = data.get("email");
    const customerPhone   = data.get("phone") || "Not provided";
    const customerAddress = data.get("address") || "Not provided";
    const notes           = data.get("notes") || "None";
    const lines           = cartToLines();
    const total           = getCartTotal();

    /*
     * Shared template variables — available in BOTH EmailJS templates.
     * In your EmailJS template editor, reference these as {{variable_name}}.
     *
     *   {{order_id}}         — e.g. #M3F2A1-XZ9K
     *   {{order_date}}       — e.g. June 12, 2025 at 3:42 PM
     *   {{customer_name}}    — customer's full name
     *   {{customer_email}}   — customer's email address
     *   {{customer_phone}}   — customer's phone (or "Not provided")
     *   {{customer_address}} — customers address
     *   {{cart_summary}}     — line-by-line itemised order
     *   {{order_total}}      — formatted total e.g. $23.00
     *   {{business_name}}    — from config.js → business.name
     *   {{business_email}}   — from config.js → business.email
     *   {{business_phone}}   — from config.js → business.phone
     *   {{notes}}            — customer's special requests
     */
    const templateVars = {
      order_id:       orderId,
      order_date:     orderDate,
      customer_name:  customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      cart_summary:   lines.join("\n"),
      order_total:    fmt(total),
      business_name:  C.business.name,
      business_email: C.business.email  || "",
      business_phone: C.business.phone  || "",
      notes,
    };

    btn.disabled = true;
    btn.textContent = "Sending…";

    /*
     * SEND 1 — Order invoice to the business owner.
     * Uses form.emailjs.orderTemplateId.
     * Set the "To email" in that EmailJS template to your business address
     * OR use {{business_email}} as the recipient.
     */
    const sendOrder = emailjs.send(ejs.serviceId, ejs.orderTemplateId, templateVars);

    /*
     * SEND 2 — Confirmation receipt to the customer (optional).
     * Only fires if confirmTemplateId is set in config.js.
     * Set the "To email" in that EmailJS template to {{customer_email}}.
     */
    const sendConfirm = ejs.confirmTemplateId
      ? emailjs.send(ejs.serviceId, ejs.confirmTemplateId, templateVars)
      : Promise.resolve();

    Promise.all([sendOrder, sendConfirm])
      .then(() => {
        showOrderSuccess(orderId, customerEmail);
      })
      .catch(err => {
        console.error("EmailJS error:", err);
        showFeedback(fb,
          "Something went wrong sending your order. Please try again or contact us directly.",
          "error"
        );
      })
      .finally(() => {
        btn.disabled = false;
        btn.textContent = "Send Order Request";
      });
  }

  function showFeedback(el, msg, type) {
    el.textContent = msg;
    el.className   = `form-feedback ${type}`;
    el.style.display = "block";
    setTimeout(() => { el.style.display = "none"; }, 8000);
  }

  /* ── 10. FOOTER ───────────────────────────────────────── */
  function buildFooter() {
    const b = C.business;
    $("#footer-logo-text").textContent = b.logoText || b.name;
    $("#footer-tagline").textContent   = b.tagline  || "";
    const socialWrap = $("#social-links");
    const socialMap  = { instagram: "IG", facebook: "FB", twitter: "TW", pinterest: "PT", tiktok: "TK" };
    Object.entries(C.social || {}).forEach(([key, url]) => {
      if (!url) return;
      const a = el("a", "social-link", socialMap[key] || key.toUpperCase());
      a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", key);
      socialWrap.appendChild(a);
    });
    const fc = $("#footer-contact-details");
    if (b.email)   fc.innerHTML += `<p><a href="mailto:${b.email}">${b.email}</a></p>`;
    if (b.phone)   fc.innerHTML += `<p><a href="tel:${b.phone}">${b.phone}</a></p>`;
    if (b.address) fc.innerHTML += `<p>${b.address}</p>`;
    $("#footer-copy").textContent = `© ${new Date().getFullYear()} ${b.name}. All rights reserved.`;
  }

  /* ── 11. MODAL ────────────────────────────────────────── */
  function initModal() {
    const overlay  = $("#modal-overlay");
    const closeBtn = $("#modal-close");
    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && !overlay.hidden) closeModal();
    });
  }

  function showModal(productId) {
    const p = C.products.find(x => x.id === productId);
    if (!p) return;
    const overlay  = $("#modal-overlay");
    const optsEl   = $("#modal-options");
    const modalPriceEl = $("#modal-price");

    $("#modal-img").src                  = p.image;
    $("#modal-img").alt                  = p.name;
    $("#modal-category").textContent     = p.category;
    $("#modal-product-name").textContent = p.name;
    $("#modal-desc").textContent         = p.description || "";
    $("#modal-tags").innerHTML           = tagBadges(p.tags || []);
    optsEl.innerHTML = "";

    const modalState = { options: {} };

    const updateModalPrice = () => {
      modalPriceEl.textContent = fmt(resolvePrice(p, modalState.options));
    };

    (p.options || []).forEach(opt => {
      const group = el("div", "option-group");
      group.innerHTML = `<label>${opt.label}</label>`;
      const choices = el("div", "option-choices");

      opt.choices.forEach((ch, idx) => {
        const priceHint = opt.priceModifiers?.[idx] !== undefined
          ? ` <span class="chip-price">${fmt(opt.priceModifiers[idx])}</span>`
          : "";
        const chip = el("button", "option-chip");
        chip.type = "button";
        chip.innerHTML = ch + priceHint;

        if (idx === 0) {
          chip.classList.add("selected");
          modalState.options[opt.label] = ch;
        }

        chip.addEventListener("click", () => {
          $$(".option-chip", group).forEach(c => c.classList.remove("selected"));
          chip.classList.add("selected");
          modalState.options[opt.label] = ch;
          updateModalPrice();
        });
        choices.appendChild(chip);
      });
      group.appendChild(choices);
      optsEl.appendChild(group);
    });

    updateModalPrice();

    const getOpts = () => ({ ...modalState.options });

    $("#modal-add-btn").onclick = () => {
      addToCart(p, 1, getOpts(), resolvePrice(p, getOpts()));
      closeModal();
    };
    $("#modal-checkout-btn").onclick = () => {
      addToCart(p, 1, getOpts(), resolvePrice(p, getOpts()));
      closeModal();
      document.querySelector("#order").scrollIntoView({ behavior: "smooth" });
    };

    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    $("#modal-close").focus();
  }

  function closeModal() {
    $("#modal-overlay").hidden = true;
    document.body.style.overflow = "";
  }

  /* ── 12. SCROLL REVEAL ────────────────────────────────── */
  function initScrollReveal() {
    const obs = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    $$(".reveal").forEach(item => obs.observe(item));
  }

  /* ── 13. NAV SCROLL ───────────────────────────────────── */
  function initNavScroll() {
    const nav = $("#navbar");
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ── 14. HAMBURGER ────────────────────────────────────── */
  function initHamburger() {
    const btn   = $("#hamburger");
    const links = $("#nav-links");
    btn.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      btn.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open);
    });
    links.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        links.classList.remove("open");
        btn.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ── 15. ACTIVE NAV ───────────────────────────────────── */
  function initActiveNav() {
    const navLinks = $$(".nav-links a:not(.btn)");
    const obs = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(a => {
            a.style.color = a.getAttribute("href") === `#${id}` ? "var(--color-text)" : "";
          });
        }
      }),
      { threshold: 0.4 }
    );
    $$("section[id]").forEach(s => obs.observe(s));
  }

  /* ── INIT ──────────────────────────────────────────────── */
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
    initFAB();
    loadCart();
    initScrollReveal();
    initNavScroll();
    initHamburger();
    initActiveNav();
  });

})();