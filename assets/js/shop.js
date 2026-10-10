/* Retail page: search, filter and sort ComputiX-tested stock. */
document.addEventListener("DOMContentLoaded", () => {
  const { $, $$, categories, products, productCard } = CX;
  const form = $("#filters");
  const grid = $("#results");
  const count = $("#result-count");
  const params = new URLSearchParams(location.search);

  // Build category checkboxes
  $("#cat-options").innerHTML = categories
    .map(
      (c) => `<label class="check"><input type="checkbox" name="cat" value="${c.id}"> ${CX.escape(c.name)}</label>`
    )
    .join("");

  // Restore state from the URL so filtered views can be shared
  $("#q").value = params.get("q") || "";
  (params.get("cat") || "").split(",").filter(Boolean).forEach((id) => {
    const box = $(`input[name="cat"][value="${id}"]`);
    if (box) box.checked = true;
  });
  (params.get("grade") || "").split(",").filter(Boolean).forEach((g) => {
    const box = $(`input[name="grade"][value="${g}"]`);
    if (box) box.checked = true;
  });
  if (params.get("max")) $("#max").value = params.get("max");
  if (params.get("sort")) $("#sort").value = params.get("sort");

  const maxPrice = Math.max(...products.map((p) => p.price));
  $("#max").max = maxPrice;
  if (!params.get("max")) $("#max").value = maxPrice;

  function state() {
    return {
      q: $("#q").value.trim().toLowerCase(),
      cats: $$('input[name="cat"]:checked').map((i) => i.value),
      grades: $$('input[name="grade"]:checked').map((i) => i.value),
      max: Number($("#max").value),
      sort: $("#sort").value
    };
  }

  function render() {
    const s = state();
    $("#max-out").textContent = CX.money(s.max);

    let list = products.filter((p) => {
      const text = `${p.name} ${p.brand} ${CX.categoryName(p.cat)} ${Object.values(p.specs).join(" ")}`.toLowerCase();
      return (
        (!s.q || s.q.split(/\s+/).every((w) => text.includes(w))) &&
        (!s.cats.length || s.cats.includes(p.cat)) &&
        (!s.grades.length || s.grades.includes(p.grade)) &&
        p.price <= s.max
      );
    });

    const sorters = {
      newest: (a, b) => b.added.localeCompare(a.added),
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      grade: (a, b) => a.grade.localeCompare(b.grade) || a.price - b.price
    };
    list.sort(sorters[s.sort]);

    count.textContent = `${list.length} ${list.length === 1 ? "part" : "parts"}`;
    grid.innerHTML = list.length
      ? list.map(productCard).join("")
      : `<div class="empty" style="grid-column:1/-1">
           <p>No parts match these filters.</p>
           <button class="btn btn-small" type="button" id="reset-inline">Clear filters</button>
         </div>`;

    // Reflect state in the URL without reloading
    const out = new URLSearchParams();
    if (s.q) out.set("q", s.q);
    if (s.cats.length) out.set("cat", s.cats.join(","));
    if (s.grades.length) out.set("grade", s.grades.join(","));
    if (s.max < maxPrice) out.set("max", s.max);
    if (s.sort !== "newest") out.set("sort", s.sort);
    history.replaceState(null, "", out.toString() ? `?${out}` : location.pathname);
  }

  function reset() {
    form.reset();
    $("#q").value = "";
    $("#max").value = maxPrice;
    render();
  }

  form.addEventListener("input", render);
  form.addEventListener("submit", (e) => e.preventDefault());
  $("#q").addEventListener("input", render);
  $("#sort").addEventListener("change", render);
  $("#reset").addEventListener("click", reset);
  grid.addEventListener("click", (e) => { if (e.target.id === "reset-inline") reset(); });

  $(".filters-toggle").addEventListener("click", (e) => {
    const open = $(".filters").classList.toggle("is-open");
    e.currentTarget.setAttribute("aria-expanded", String(open));
  });

  render();
});
