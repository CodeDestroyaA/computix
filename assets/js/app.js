/* Shared behaviour: storage, auth, cart, header, toast, rendering helpers. */
(function () {
  "use strict";
  const CX = (window.CX = window.CX || {});

  /* ---------- Storage (fails soft if localStorage is blocked) ---------- */
  CX.store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        /* storage unavailable: the demo keeps working for this page view */
      }
    },
    remove(key) {
      try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
    }
  };

  /* ---------- Helpers ---------- */
  CX.$ = (sel, root) => (root || document).querySelector(sel);
  CX.$$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  CX.escape = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  CX.money = (n) => "R" + Number(n).toLocaleString("en-ZA", { maximumFractionDigits: 0 }).replace(/ /g, " ");

  CX.date = (iso) =>
    new Date(iso + (iso.length === 10 ? "T12:00:00" : "")).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });

  CX.categoryName = (id) => (CX.categories.find((c) => c.id === id) || { name: id }).name;

  CX.findProduct = (id) => CX.products.find((p) => p.id === id);

  /* ---------- Toast ---------- */
  let toastTimer;
  CX.toast = (message) => {
    let el = CX.$(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2600);
  };

  /* ---------- Auth (client-side demo only — see README) ---------- */
  async function hash(text) {
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    let h = 0;
    for (let i = 0; i < text.length; i++) h = (Math.imul(31, h) + text.charCodeAt(i)) | 0;
    return "fallback-" + h;
  }

  CX.auth = {
    users() { return CX.store.get("cx_users", {}); },
    current() {
      const email = CX.store.get("cx_session", null);
      return email ? this.users()[email] || null : null;
    },
    async register({ username, email, phone, password }) {
      const users = this.users();
      const key = email.trim().toLowerCase();
      if (users[key]) throw new Error("An account with this email already exists. Log in instead.");
      const taken = Object.values(users).some((u) => u.username.toLowerCase() === username.trim().toLowerCase());
      if (taken) throw new Error("That username is taken. Try another one.");
      users[key] = {
        username: username.trim(),
        email: key,
        phone: phone.trim(),
        passHash: await hash(password),
        joined: new Date().toISOString().slice(0, 10)
      };
      CX.store.set("cx_users", users);
      CX.store.set("cx_session", key);
      return users[key];
    },
    async login(email, password) {
      const user = this.users()[email.trim().toLowerCase()];
      if (!user || user.passHash !== (await hash(password))) {
        throw new Error("Email or password is incorrect.");
      }
      CX.store.set("cx_session", user.email);
      return user;
    },
    logout() { CX.store.remove("cx_session"); }
  };

  /* ---------- Cart (each used part is a single unit) ---------- */
  CX.cart = {
    ids() { return CX.store.get("cx_cart", []).filter((id) => CX.findProduct(id)); },
    has(id) { return this.ids().includes(id); },
    add(id) {
      const ids = this.ids();
      if (!ids.includes(id)) ids.push(id);
      CX.store.set("cx_cart", ids);
      renderCart();
    },
    remove(id) {
      CX.store.set("cx_cart", this.ids().filter((x) => x !== id));
      renderCart();
    },
    clear() { CX.store.set("cx_cart", []); renderCart(); },
    total() { return this.ids().reduce((sum, id) => sum + CX.findProduct(id).price, 0); }
  };

  CX.orders = {
    list(email) { return CX.store.get("cx_orders_" + email, []); },
    place(email, ids) {
      const orders = this.list(email);
      const order = {
        id: "CX-" + Date.now().toString(36).toUpperCase(),
        date: new Date().toISOString().slice(0, 10),
        items: ids,
        total: ids.reduce((s, id) => s + CX.findProduct(id).price, 0)
      };
      orders.unshift(order);
      CX.store.set("cx_orders_" + email, orders);
      return order;
    }
  };

  /* ---------- Classified ads ---------- */
  CX.ads = {
    mine() { return CX.store.get("cx_ads", []); },
    all() { return this.mine().concat(CX.seedAds); },
    add(ad) {
      const ads = this.mine();
      ads.unshift(ad);
      CX.store.set("cx_ads", ads);
    },
    remove(id) { CX.store.set("cx_ads", this.mine().filter((a) => a.id !== id)); }
  };

  /* ---------- Rendering ---------- */
  CX.gradeStamp = (grade) =>
    `<span class="grade-stamp" data-grade="${grade}" title="${CX.escape(CX.grades[grade])}"><b>${grade}</b>Grade ${grade}</span>`;

  CX.productCard = (p) => {
    const inCart = CX.cart.has(p.id);
    const specs = Object.entries(p.specs)
      .map(([k, v]) => `<dt>${CX.escape(k)}</dt><dd>${CX.escape(v)}</dd>`)
      .join("");
    return `
      <article class="item">
        <div class="item-top">
          <span class="item-cat">${CX.escape(CX.categoryName(p.cat))}</span>
          ${CX.gradeStamp(p.grade)}
        </div>
        <div class="item-art">${CX.icons[p.cat]}</div>
        <div class="item-body">
          <h3>${CX.escape(p.name)}</h3>
          <dl class="specs"><dt>Model</dt><dd>${CX.escape(p.brand)}</dd>${specs}</dl>
          <div class="item-foot">
            <div class="price">${CX.money(p.price)}<small>3-month warranty</small></div>
            <button class="btn btn-small" type="button" data-add="${p.id}" ${inCart ? "disabled" : ""}>
              ${inCart ? "In cart" : "Add to cart"}
            </button>
          </div>
        </div>
      </article>`;
  };

  /* ---------- Header: menu, account link, cart drawer ---------- */
  function setupHeader() {
    const toggle = CX.$(".menu-toggle");
    const nav = CX.$(".nav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }

    const user = CX.auth.current();
    const account = CX.$(".account-link");
    if (account) {
      account.href = user ? "profile.html" : "account.html";
      const label = CX.$(".account-label", account);
      if (label) label.textContent = user ? user.username : "Log in";
      account.setAttribute("aria-label", user ? "Your profile" : "Log in or register");
    }

    const drawer = CX.$(".drawer");
    const openBtn = CX.$(".cart-btn");
    if (!drawer || !openBtn) return;

    const open = () => {
      drawer.classList.add("is-open");
      drawer.removeAttribute("aria-hidden");
      openBtn.setAttribute("aria-expanded", "true");
      CX.$(".drawer-close", drawer).focus();
    };
    const close = () => {
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      openBtn.setAttribute("aria-expanded", "false");
      openBtn.focus();
    };
    openBtn.addEventListener("click", open);
    CX.$(".drawer-close", drawer).addEventListener("click", close);
    CX.$(".drawer-backdrop").addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) close();
    });

    drawer.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-remove]");
      if (btn) CX.cart.remove(btn.dataset.remove);
    });

    if (new URLSearchParams(location.search).get("cart") === "open") {
      open();
      const url = new URL(location.href);
      url.searchParams.delete("cart");
      history.replaceState(null, "", url.pathname + url.search);
    }

    CX.$(".checkout-btn", drawer).addEventListener("click", () => {
      const current = CX.auth.current();
      if (!current) {
        CX.store.set("cx_after_login", "checkout");
        window.location.href = "account.html";
        return;
      }
      const order = CX.orders.place(current.email, CX.cart.ids());
      CX.cart.clear();
      CX.toast(`Order ${order.id} placed`);
      setTimeout(() => (window.location.href = "profile.html#orders"), 900);
    });
  }

  function renderCart() {
    const ids = CX.cart.ids();
    CX.$$(".cart-count").forEach((el) => {
      el.textContent = ids.length;
      el.dataset.empty = String(ids.length === 0);
    });
    const body = CX.$(".drawer-body");
    if (!body) return;
    body.innerHTML = ids.length
      ? ids
          .map((id) => {
            const p = CX.findProduct(id);
            return `<div class="cart-line">
              <span class="name">${CX.escape(p.name)}</span>
              <span>${CX.money(p.price)}</span>
              <span class="sub">${CX.escape(CX.categoryName(p.cat))}, grade ${p.grade}</span>
              <button class="btn-link" type="button" data-remove="${p.id}">Remove</button>
            </div>`;
          })
          .join("")
      : `<div class="empty" style="margin-top:16px"><p>Your cart is empty.</p><a class="btn btn-small" href="shop.html">Browse tested parts</a></div>`;
    CX.$(".cart-total .price").textContent = CX.money(CX.cart.total());
    CX.$(".checkout-btn").disabled = ids.length === 0;

    // keep any visible "Add to cart" buttons in sync
    CX.$$("[data-add]").forEach((btn) => {
      const inCart = ids.includes(btn.dataset.add);
      btn.disabled = inCart;
      btn.textContent = inCart ? "In cart" : "Add to cart";
    });
  }
  CX.renderCart = renderCart;

  // Delegate "Add to cart" clicks anywhere on the page
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn || btn.disabled) return;
    CX.cart.add(btn.dataset.add);
    CX.toast("Added to cart");
  });

  document.addEventListener("DOMContentLoaded", () => {
    setupHeader();
    renderCart();
    const year = CX.$("[data-year]");
    if (year) year.textContent = new Date().getFullYear();
  });
})();
