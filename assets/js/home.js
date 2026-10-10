/* Home page: category counts and newest stock. */
document.addEventListener("DOMContentLoaded", () => {
  const { $, categories, products, icons, productCard } = CX;

  $("#bins").innerHTML = categories
    .map((c) => {
      const count = products.filter((p) => p.cat === c.id).length;
      return `<a class="bin" href="shop.html?cat=${c.id}">
        ${icons[c.id]}
        <strong>${CX.escape(c.name)}</strong>
        <span>${count} tested in stock</span>
      </a>`;
    })
    .join("");

  const newest = products.slice().sort((a, b) => b.added.localeCompare(a.added)).slice(0, 4);
  $("#newest").innerHTML = newest.map(productCard).join("");
});
