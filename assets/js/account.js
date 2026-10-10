/* Log in / register with validation. Accounts live in localStorage (demo). */
document.addEventListener("DOMContentLoaded", () => {
  const { $, $$ } = CX;

  if (CX.auth.current()) {
    location.replace("profile.html");
    return;
  }

  const tabs = $$('[role="tab"]');
  function select(name) {
    tabs.forEach((t) => {
      const on = t.dataset.tab === name;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      $("#" + t.getAttribute("aria-controls")).hidden = !on;
    });
    history.replaceState(null, "", name === "register" ? "#register" : location.pathname);
  }
  tabs.forEach((t) => {
    t.addEventListener("click", () => select(t.dataset.tab));
    t.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const next = tabs[(tabs.indexOf(t) + 1) % tabs.length];
        select(next.dataset.tab);
        next.focus();
      }
    });
  });
  $$("[data-switch]").forEach((b) => b.addEventListener("click", () => {
    select(b.dataset.switch);
    $(`[data-tab="${b.dataset.switch}"]`).focus();
  }));
  select(location.hash === "#register" ? "register" : "login");

  // Show / hide password
  $$(".password-wrap .btn-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.previousElementSibling;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.textContent = show ? "Hide" : "Show";
      btn.setAttribute("aria-pressed", String(show));
    });
  });

  function validate(rules) {
    let firstInvalid = null;
    Object.entries(rules).forEach(([id, rule]) => {
      const input = $("#" + id);
      const msg = rule(input.value.trim(), input.value);
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      $("#" + id + "-error").textContent = msg;
      if (msg && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  function afterAuth() {
    const next = CX.store.get("cx_after_login", null);
    CX.store.remove("cx_after_login");
    if (next === "checkout") {
      location.href = "shop.html?cart=open";
    } else {
      location.href = next || "profile.html";
    }
  }

  $("#login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    $("#login-alert").textContent = "";
    const ok = validate({
      "login-email": (v) => (!emailOk(v) ? "Enter the email you registered with." : ""),
      "login-password": (v, raw) => (!raw ? "Enter your password." : "")
    });
    if (!ok) return;
    try {
      await CX.auth.login($("#login-email").value, $("#login-password").value);
      afterAuth();
    } catch (err) {
      $("#login-alert").textContent = err.message;
    }
  });

  $("#register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    $("#register-alert").textContent = "";
    const ok = validate({
      "reg-username": (v) =>
        !/^[a-zA-Z0-9._]{3,20}$/.test(v) ? "Use 3–20 letters, numbers, dots or underscores." : "",
      "reg-email": (v) => (!emailOk(v) ? "Enter an email like name@example.com." : ""),
      "reg-phone": (v) =>
        v && !/^(\+27|0)[6-8][0-9]{8}$/.test(v.replace(/\s/g, "")) ? "Enter a South African mobile number, e.g. 082 123 4567." : "",
      "reg-password": (v, raw) =>
        raw.length < 8 || !/[0-9]/.test(raw) || !/[a-zA-Z]/.test(raw) ? "Use at least 8 characters with a letter and a number." : "",
      "reg-confirm": (v, raw) => (raw !== $("#reg-password").value ? "Passwords don't match." : "")
    });
    if (!ok) return;
    try {
      await CX.auth.register({
        username: $("#reg-username").value,
        email: $("#reg-email").value,
        phone: $("#reg-phone").value,
        password: $("#reg-password").value
      });
      afterAuth();
    } catch (err) {
      $("#register-alert").textContent = err.message;
    }
  });

  // Live password strength hint
  $("#reg-password").addEventListener("input", (e) => {
    const v = e.target.value;
    const score = [v.length >= 8, /[0-9]/.test(v), /[a-zA-Z]/.test(v), /[^a-zA-Z0-9]/.test(v), v.length >= 12].filter(Boolean).length;
    $("#strength").textContent = v ? ["Too weak", "Too weak", "Weak", "Okay", "Strong", "Very strong"][score] : "At least 8 characters with a letter and a number.";
  });
});
