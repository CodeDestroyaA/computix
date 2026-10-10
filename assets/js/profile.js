/* Profile: account details, orders and the user's own ads. */
document.addEventListener("DOMContentLoaded", () => {
  const { $ } = CX;
  const user = CX.auth.current();
  if (!user) {
    CX.store.set("cx_after_login", "profile.html");
    location.replace("account.html");
    return;
  }

  $("#avatar").textContent = user.username.charAt(0).toUpperCase();
  $("#username").textContent = user.username;
  $("#joined").textContent = `Member since ${CX.date(user.joined)}`;
  $("#d-email").textContent = user.email;
  $("#d-phone").textContent = user.phone || "Not added";
  $("#d-member").textContent = "#CX-" + String(Object.keys(CX.auth.users()).indexOf(user.email) + 1).padStart(4, "0");

  function renderOrders() {
    const orders = CX.orders.list(user.email);
    $("#orders-list").innerHTML = orders.length
      ? orders
          .map(
            (o) => `<div class="order">
              <div class="order-head"><span>${o.id}</span><span>${CX.money(o.total)}</span></div>
              <span class="status">Placed ${CX.date(o.date)}, being tested for dispatch</span>
              <ul>${o.items.map((id) => `<li>${CX.escape((CX.findProduct(id) || { name: "Removed item" }).name)}</li>`).join("")}</ul>
            </div>`
          )
          .join("")
      : `<div class="empty"><p>You haven't ordered anything yet.</p><a class="btn btn-small" href="shop.html">Shop tested parts</a></div>`;
  }

  function renderAds() {
    const ads = CX.ads.mine().filter((a) => a.seller === user.username);
    $("#ads-list").innerHTML = ads.length
      ? ads
          .map(
            (a) => `<div class="order">
              <div class="order-head"><span>${CX.escape(a.title)}</span><span>${CX.money(a.price)}</span></div>
              <span class="status">Live since ${CX.date(a.posted)}, ${CX.escape(a.location)}</span>
              <div><button class="btn-link" type="button" data-delete="${a.id}">Remove ad</button></div>
            </div>`
          )
          .join("")
      : `<div class="empty"><p>You have no ads running.</p><a class="btn btn-small" href="classifieds.html#post">Post an ad</a></div>`;
  }

  $("#ads-list").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-delete]");
    if (!btn) return;
    CX.ads.remove(btn.dataset.delete);
    renderAds();
    CX.toast("Ad removed");
  });

  $("#logout").addEventListener("click", () => {
    CX.auth.logout();
    location.href = "index.html";
  });

  renderOrders();
  renderAds();
});
