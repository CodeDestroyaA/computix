/* Classifieds: browse peer-to-peer ads, post an ad, message a seller. */
document.addEventListener("DOMContentLoaded", () => {
  const { $, categories, icons } = CX;
  const grid = $("#ads");
  const postDialog = $("#post-dialog");
  const msgDialog = $("#message-dialog");
  const catSelect = $("#ad-cat");
  const filter = $("#ad-filter");

  const options = categories.map((c) => `<option value="${c.id}">${CX.escape(c.name)}</option>`).join("");
  catSelect.innerHTML = `<option value="">Choose a category</option>${options}`;
  filter.innerHTML = `<option value="">All categories</option>${options}`;

  function card(ad) {
    const user = CX.auth.current();
    const own = user && ad.seller === user.username;
    return `
      <article class="item">
        <div class="item-top">
          <span class="item-cat">${CX.escape(CX.categoryName(ad.cat))}</span>
          ${CX.gradeStamp(ad.grade)}
        </div>
        <div class="item-art">${icons[ad.cat]}</div>
        <div class="item-body">
          <h3>${CX.escape(ad.title)}</h3>
          <p class="item-meta">${CX.escape(ad.location)}, posted ${CX.date(ad.posted)} by ${CX.escape(ad.seller)}</p>
          <p style="color:var(--solder);font-size:.95rem">${CX.escape(ad.description)}</p>
          <div class="item-foot">
            <div class="price">${CX.money(ad.price)}<small>Seller's own grade</small></div>
            ${
              own
                ? `<a class="btn btn-small" href="profile.html#ads">Manage</a>`
                : `<button class="btn btn-small" type="button" data-message="${ad.id}">Message seller</button>`
            }
          </div>
        </div>
      </article>`;
  }

  function render() {
    const cat = filter.value;
    const ads = CX.ads.all().filter((a) => !cat || a.cat === cat);
    $("#ad-count").textContent = `${ads.length} ${ads.length === 1 ? "ad" : "ads"}`;
    grid.innerHTML = ads.length
      ? ads.map(card).join("")
      : `<div class="empty" style="grid-column:1/-1"><p>No ads in this category yet.</p><button class="btn btn-small" type="button" data-open-post>Post the first one</button></div>`;
  }

  filter.addEventListener("change", render);

  // Open "Post an ad" — requires an account
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-open-post]")) return;
    if (!CX.auth.current()) {
      CX.store.set("cx_after_login", "classifieds.html");
      location.href = "account.html";
      return;
    }
    postDialog.showModal();
  });

  $("#post-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const rules = {
      "ad-title": (v) => (v.length < 8 ? "Write a title of at least 8 characters." : ""),
      "ad-cat": (v) => (!v ? "Choose a category." : ""),
      "ad-price": (v) => (!(Number(v) > 0) ? "Enter a price in rand, e.g. 1200." : ""),
      "ad-location": (v) => (v.length < 2 ? "Enter your suburb or town." : ""),
      "ad-desc": (v) => (v.length < 20 ? "Describe the part in at least 20 characters." : "")
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

    CX.ads.add({
      id: "u" + Date.now().toString(36),
      cat: $("#ad-cat").value,
      title: $("#ad-title").value.trim(),
      price: Math.round(Number($("#ad-price").value)),
      grade: form.querySelector('input[name="ad-grade"]:checked').value,
      location: $("#ad-location").value.trim(),
      seller: CX.auth.current().username,
      posted: new Date().toISOString().slice(0, 10),
      description: $("#ad-desc").value.trim()
    });
    form.reset();
    postDialog.close();
    filter.value = "";
    render();
    CX.toast("Ad published");
  });

  $("#post-cancel").addEventListener("click", () => postDialog.close());

  // Message a seller
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-message]");
    if (!btn) return;
    const ad = CX.ads.all().find((a) => a.id === btn.dataset.message);
    $("#message-title").textContent = `Message ${ad.seller}`;
    $("#message-about").textContent = `About: ${ad.title}`;
    $("#message-text").value = `Hi ${ad.seller}, is the ${ad.title.split(" — ")[0]} still available?`;
    msgDialog.showModal();
  });
  $("#message-form").addEventListener("submit", (e) => {
    e.preventDefault();
    msgDialog.close();
    CX.toast("Message sent");
  });
  $("#message-cancel").addEventListener("click", () => msgDialog.close());

  render();
  if (location.hash === "#post") $("[data-open-post]").click();
});
