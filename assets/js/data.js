/* Demo catalogue for ComputiX. In production this would come from an API. */
window.CX = window.CX || {};

CX.categories = [
  { id: "gpu", name: "Graphics cards" },
  { id: "cpu", name: "Processors" },
  { id: "ram", name: "Memory" },
  { id: "storage", name: "Storage" },
  { id: "motherboard", name: "Motherboards" },
  { id: "psu", name: "Power supplies" }
];

CX.grades = {
  A: "Like new. Fully stress-tested, no visible wear.",
  B: "Light wear. Passes all tests, minor cosmetic marks.",
  C: "Works, visibly used. Tested, priced for budget builds."
};

/* ComputiX-tested retail stock (prices in ZAR) */
CX.products = [
  { id: "p01", cat: "gpu", name: "NVIDIA GeForce RTX 3060 12GB", brand: "MSI Ventus 2X", grade: "A", price: 4200, specs: { VRAM: "12 GB GDDR6", Tested: "3 h FurMark, 72°C" }, added: "2026-10-08" },
  { id: "p02", cat: "gpu", name: "AMD Radeon RX 6600 8GB", brand: "Sapphire Pulse", grade: "B", price: 3100, specs: { VRAM: "8 GB GDDR6", Tested: "3 h FurMark, 69°C" }, added: "2026-10-06" },
  { id: "p03", cat: "gpu", name: "NVIDIA GeForce RTX 3070 8GB", brand: "Gigabyte Gaming OC", grade: "B", price: 5800, specs: { VRAM: "8 GB GDDR6", Tested: "3 h FurMark, 74°C" }, added: "2026-10-01" },
  { id: "p04", cat: "gpu", name: "NVIDIA GTX 1660 Super 6GB", brand: "Palit StormX", grade: "C", price: 1950, specs: { VRAM: "6 GB GDDR6", Tested: "2 h FurMark, 70°C" }, added: "2026-09-27" },
  { id: "p05", cat: "cpu", name: "AMD Ryzen 5 5600", brand: "AMD", grade: "A", price: 1700, specs: { Cores: "6 / 12 threads", Socket: "AM4" }, added: "2026-10-09" },
  { id: "p06", cat: "cpu", name: "Intel Core i5-12400F", brand: "Intel", grade: "A", price: 1900, specs: { Cores: "6 / 12 threads", Socket: "LGA1700" }, added: "2026-10-04" },
  { id: "p07", cat: "cpu", name: "AMD Ryzen 7 5700X3D", brand: "AMD", grade: "B", price: 3600, specs: { Cores: "8 / 16 threads", Socket: "AM4" }, added: "2026-09-30" },
  { id: "p08", cat: "cpu", name: "Intel Core i7-10700K", brand: "Intel", grade: "C", price: 2400, specs: { Cores: "8 / 16 threads", Socket: "LGA1200" }, added: "2026-09-22" },
  { id: "p09", cat: "ram", name: "Corsair Vengeance LPX 16GB (2×8)", brand: "Corsair", grade: "A", price: 480, specs: { Type: "DDR4-3200", Tested: "4 passes MemTest86" }, added: "2026-10-07" },
  { id: "p10", cat: "ram", name: "G.Skill Trident Z5 32GB (2×16)", brand: "G.Skill", grade: "A", price: 1650, specs: { Type: "DDR5-6000", Tested: "4 passes MemTest86" }, added: "2026-10-02" },
  { id: "p11", cat: "storage", name: "Samsung 970 EVO Plus 1TB", brand: "Samsung", grade: "A", price: 850, specs: { Type: "NVMe M.2", Health: "96% (SMART)" }, added: "2026-10-05" },
  { id: "p12", cat: "storage", name: "Crucial MX500 500GB", brand: "Crucial", grade: "B", price: 420, specs: { Type: "2.5\" SATA SSD", Health: "91% (SMART)" }, added: "2026-09-29" },
  { id: "p13", cat: "storage", name: "WD Blue 2TB 7200rpm", brand: "Western Digital", grade: "C", price: 550, specs: { Type: "3.5\" HDD", Health: "No bad sectors" }, added: "2026-09-18" },
  { id: "p14", cat: "motherboard", name: "MSI MAG B550 Tomahawk", brand: "MSI", grade: "B", price: 1800, specs: { Socket: "AM4", Form: "ATX" }, added: "2026-10-03" },
  { id: "p15", cat: "motherboard", name: "ASUS Prime B450M-A II", brand: "ASUS", grade: "C", price: 950, specs: { Socket: "AM4", Form: "Micro-ATX" }, added: "2026-09-25" },
  { id: "p16", cat: "psu", name: "Corsair RM750x 750W", brand: "Corsair", grade: "A", price: 1300, specs: { Rating: "80+ Gold", Modular: "Fully" }, added: "2026-10-06" },
  { id: "p17", cat: "psu", name: "Seasonic Focus GX-650", brand: "Seasonic", grade: "B", price: 1000, specs: { Rating: "80+ Gold", Modular: "Fully" }, added: "2026-09-20" }
];

/* Peer-to-peer classifieds (seed data; user ads are added from localStorage) */
CX.seedAds = [
  { id: "a01", cat: "gpu", title: "RX 580 8GB — ran a 1080p setup for two years", price: 1100, grade: "C", location: "Randburg", seller: "thabo_builds", posted: "2026-10-09", description: "Repasted in August. Fans are a bit loud at full load. Collection only." },
  { id: "a02", cat: "cpu", title: "Ryzen 5 3600 with Wraith Stealth cooler", price: 1050, grade: "B", location: "Midrand", seller: "lerato.m", posted: "2026-10-07", description: "Upgraded to AM5. Comes in original box. Can meet at Mall of Africa." },
  { id: "a03", cat: "ram", title: "Kingston Fury 32GB DDR4-3600 (4×8)", price: 900, grade: "A", location: "Sandton", seller: "pc_doctor_jhb", posted: "2026-10-05", description: "No issues, selling because I moved to 2×16." },
  { id: "a04", cat: "storage", title: "2× Seagate IronWolf 4TB NAS drives", price: 2200, grade: "B", location: "Roodepoort", seller: "kgosi_nas", posted: "2026-10-02", description: "18 months in a Synology. SMART reports included. Selling as a pair." },
  { id: "a05", cat: "psu", title: "Cooler Master MWE 550W Bronze", price: 450, grade: "C", location: "Soweto", seller: "nandi_k", posted: "2026-09-28", description: "Works fine, non-modular. Cables cable-tied neatly." }
];

/* Line icons for each category (stroke uses currentColor) */
CX.icons = {
  gpu: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="12" width="40" height="22" rx="2"/><circle cx="17" cy="23" r="6"/><circle cx="33" cy="23" r="6"/><path d="M8 34v4h4v-4M16 34v4M20 34v4M24 34v4M28 34v4"/></svg>',
  cpu: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="12" y="12" width="24" height="24" rx="2"/><rect x="18" y="18" width="12" height="12"/><path d="M18 6v6M24 6v6M30 6v6M18 36v6M24 36v6M30 36v6M6 18h6M6 24h6M6 30h6M36 18h6M36 24h6M36 30h6"/></svg>',
  ram: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 14h40v16H26l-2 3-2-3H4z"/><rect x="9" y="18" width="6" height="8"/><rect x="18" y="18" width="6" height="8"/><rect x="27" y="18" width="6" height="8"/><path d="M36 18v8M8 30v4M14 30v4M20 30v4M30 30v4M36 30v4M40 30v4"/></svg>',
  storage: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="18" width="40" height="12" rx="2"/><rect x="9" y="21" width="10" height="6"/><rect x="22" y="21" width="6" height="6"/><circle cx="39" cy="24" r="1.5"/><path d="M44 21h-2v6h2"/></svg>',
  motherboard: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="6" y="6" width="36" height="36" rx="2"/><rect x="12" y="12" width="12" height="12"/><path d="M30 12v16M34 12v16M12 32h24M12 37h16M24 18h6"/></svg>',
  psu: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="10" width="40" height="28" rx="2"/><circle cx="20" cy="24" r="9"/><path d="M20 15v18M11 24h18M14 18l12 12M26 18L14 30"/><rect x="34" y="16" width="5" height="6"/><path d="M36.5 28v4"/></svg>'
};
