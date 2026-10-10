/* Support: contact form validation. */
document.addEventListener("DOMContentLoaded", () => {
  const { $ } = CX;
  const form = $("#contact-form");
  const user = CX.auth.current();
  if (user) {
    $("#c-name").value = user.username;
    $("#c-email").value = user.email;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const rules = {
      "c-name": (v) => (v.length < 2 ? "Enter your name." : ""),
      "c-email": (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter an email like name@example.com." : ""),
      "c-topic": (v) => (!v ? "Choose what your message is about." : ""),
      "c-message": (v) => (v.length < 15 ? "Tell us a bit more (at least 15 characters)." : "")
    };
    let firstInvalid = null;
    Object.entries(rules).forEach(([id, rule]) => {
      const input = $("#" + id);
      const msg = rule(input.value.trim());
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      $("#" + id + "-error").textContent = msg;
      if (msg && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) return firstInvalid.focus();

    const email = $("#c-email").value.trim();
    const ref = "SUP-" + Math.floor(100000 + Math.random() * 900000);
    form.innerHTML = `<h3>Message sent</h3><p>Your reference is <strong>${ref}</strong>. We reply to ${CX.escape(email)} within one working day.</p>`;
    form.setAttribute("tabindex", "-1");
    form.focus();
  });
});
