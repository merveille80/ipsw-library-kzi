const API_BASE = "https://api.ipsw.me/v4";
const INITIAL_VISIBLE_DEVICES = 60;
const DEVICES_INCREMENT = 40;
const INITIAL_VISIBLE_FIRMWARES = 28;

const FAMILY_META = {
  iphone: { label: "iPhone", image: "assets/devices/iphone.webp" },
  ipad: { label: "iPad", image: "assets/devices/ipad.webp" },
  mac: { label: "Mac", image: "assets/devices/mac.webp" },
  vision: { label: "Vision", image: "assets/devices/vision.webp" },
  appletv: { label: "Apple TV", image: "assets/devices/appletv.webp" },
  homepod: { label: "HomePod", image: "assets/devices/homepod.webp" },
  ipod: { label: "iPod touch", image: "assets/devices/ipod.webp?v=2" },
  watch: { label: "Apple Watch", image: "assets/devices/watch.webp?v=2" },
  other: { label: "Autres", image: "" },
  all: { label: "Tous les appareils", image: "" },
};

const FAMILY_ORDER = [
  "iphone",
  "ipad",
  "mac",
  "vision",
  "appletv",
  "homepod",
  "ipod",
  "watch",
  "other",
];

const state = {
  devices: [],
  filteredDevices: [],
  currentStep: 1,
  family: "",
  query: "",
  firmwareType: "ipsw",
  selectedIdentifier: "",
  selectedDetails: null,
  visibleDevices: INITIAL_VISIBLE_DEVICES,
  showAllFirmwares: false,
  theme: "light",
  lang: "fr",
};

const TRANSLATIONS = {
  fr: {
    hero_title: 'Accède au <span class="hero__title-gradient">firmware Apple parfait</span> en quelques clics.',
    hero_subtitle: 'Navigation fluide par dossiers successifs, vérification de signature et téléchargement direct des fichiers système.',
    hero_explore: 'Commencer maintenant',
    hero_products: 'Voir les produits',
    search_placeholder: 'Rechercher un modèle ou un identifier (ex: iPhone16,2)',
    view_title_default: 'Produits Apple',
    step_1_scope: 'Étape 1: ouvre un dossier produit',
    step_1_status: 'Étape 1: choisis une catégorie.',
    step_2_scope: 'Étape 2: sélectionne un modèle',
    step_2_status: 'Étape 2: ouvre un modèle pour voir ses fichiers système.',
    step_3_scope: 'Étape 3: sélectionne et télécharge le fichier',
    step_3_status: 'Type de firmware: ',
    devices_indexed: 'modèles indexés',
    no_models: 'Aucun modèle dans ce dossier.',
    loading_firmwares: 'Récupération des fichiers système en cours.',
    loading: 'Chargement...',
    version: 'Version',
    build: 'Build',
    date: 'Date',
    size: 'Taille',
    signature: 'Signature',
    action: 'Action',
    download: 'Télécharger',
    show_more: 'Afficher plus',
    show_all: 'Afficher tous les fichiers',
    show_less: 'Afficher moins',
    empty_firmwares: 'Aucune version disponible pour cet appareil.',
    seo_title: 'Site pour télécharger les systèmes iPhone et firmwares Apple',
    seo_desc: 'IPSW Library Kzi te permet de trouver rapidement le bon firmware Apple officiel. Recherche par produit, modèle, version, build et signature pour télécharger le bon fichier IPSW ou OTA.',
    seo_card_1_title: 'iPhone et iOS',
    seo_card_1_desc: 'Télécharge les fichiers système iPhone (IPSW) et retrouve les versions iOS stables ou anciennes, modèle par modèle.',
    seo_card_2_title: 'iPad, Mac, Watch, TV',
    seo_card_2_desc: 'Accède aussi aux firmwares iPadOS, macOS, watchOS et tvOS dans une navigation simple en dossiers successifs.',
    seo_card_3_title: 'IPSW et OTA officiels',
    seo_card_3_desc: 'Bascule en un clic entre IPSW et OTA, vérifie le statut de signature et lance le téléchargement direct.',
  },
  en: {
    hero_title: 'Access the <span class="hero__title-gradient">perfect Apple firmware</span> in a few clicks.',
    hero_subtitle: 'Fluid navigation through successive folders, signature verification, and direct download of system files.',
    hero_explore: 'Start now',
    hero_products: 'See products',
    search_placeholder: 'Search for a model or identifier (ex: iPhone16,2)',
    view_title_default: 'Apple Products',
    step_1_scope: 'Step 1: open a product folder',
    step_1_status: 'Step 1: choose a category.',
    step_2_scope: 'Step 2: select a model',
    step_2_status: 'Step 2: open a model to see its system files.',
    step_3_scope: 'Step 3: select and download the file',
    step_3_status: 'Firmware type: ',
    devices_indexed: 'indexed models',
    no_models: 'No models in this folder.',
    loading_firmwares: 'Retrieving system files...',
    loading: 'Loading...',
    version: 'Version',
    build: 'Build',
    date: 'Date',
    size: 'Size',
    signature: 'Signature',
    action: 'Action',
    download: 'Download',
    show_more: 'Show more',
    show_all: 'Show all files',
    show_less: 'Show less',
    empty_firmwares: 'No versions available for this device.',
    seo_title: 'Site to download iPhone systems and Apple firmwares',
    seo_desc: 'IPSW Library Kzi allows you to quickly find the correct official Apple firmware. Search by product, model, version, build, and signature to download the right IPSW or OTA file.',
    seo_card_1_title: 'iPhone and iOS',
    seo_card_1_desc: 'Download iPhone system files (IPSW) and find stable or older iOS versions, model by model.',
    seo_card_2_title: 'iPad, Mac, Watch, TV',
    seo_card_2_desc: 'Also access iPadOS, macOS, watchOS, and tvOS firmwares in a simple successive folder navigation.',
    seo_card_3_title: 'Official IPSW and OTA',
    seo_card_3_desc: 'Switch between IPSW and OTA in one click, check signature status, and start direct download.',
  },
};

const homeBrandBtn = document.getElementById("homeBrandBtn");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const startExploreBtn = document.getElementById("startExploreBtn");
const jumpProductsBtn = document.getElementById("jumpProductsBtn");
const heroQuickProducts = document.getElementById("heroQuickProducts");
const searchInput = document.getElementById("searchInput");
const typeButtons = Array.from(document.querySelectorAll(".type-toggle__btn"));
const langSelect = document.getElementById("langSelect");
const familyStatus = document.getElementById("familyStatus");
const viewTitle = document.getElementById("viewTitle");
const deviceScope = document.getElementById("deviceScope");
const deviceCount = document.getElementById("deviceCount");
const categoryView = document.getElementById("categoryView");
const modelView = document.getElementById("modelView");
const fileView = document.getElementById("fileView");
const familyGallery = document.getElementById("familyGallery");
const deviceGrid = document.getElementById("deviceGrid");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const firmwarePlaceholder = document.getElementById("firmwarePlaceholder");
const firmwareContent = document.getElementById("firmwareContent");
const deviceTitle = document.getElementById("deviceTitle");
const deviceIdentifier = document.getElementById("deviceIdentifier");
const firmwareCount = document.getElementById("firmwareCount");
const firmwareTableBody = document.getElementById("firmwareTableBody");
const toggleRowsBtn = document.getElementById("toggleRowsBtn");
const explorerPanel = document.getElementById("explorerPanel");

init();

async function init() {
  applyInitialTheme();
  applyInitialLanguage();
  applyInitialQueryFromUrl();
  bindEvents();
  renderFamilySkeleton();
  await loadDevices();
}

function bindEvents() {
  if (homeBrandBtn) {
    homeBrandBtn.addEventListener("click", (event) => {
      event.preventDefault();
      goToHome({ scrollTarget: "top" });
    });
  }

  themeToggleBtn.addEventListener("click", () => {
    const nextTheme = state.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });

  if (startExploreBtn) {
    startExploreBtn.addEventListener("click", () => {
      goToHome({ scrollTarget: "explorer" });
    });
  }

  if (jumpProductsBtn) {
    jumpProductsBtn.addEventListener("click", () => {
      explorerPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (heroQuickProducts) {
    heroQuickProducts.addEventListener("click", (event) => {
      const button = event.target.closest(".hero-mini-product[data-family]");
      if (!button) return;
      const family = button.dataset.family || "";
      if (!family) return;

      state.family = family;
      state.currentStep = 2;
      state.visibleDevices = INITIAL_VISIBLE_DEVICES;
      state.selectedIdentifier = "";
      state.selectedDetails = null;
      state.query = "";
      searchInput.value = "";
      applyDeviceFilters();
      renderAll();
      explorerPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  searchInput.addEventListener("input", (event) => {
    const rawQuery = event.target.value.trim();
    state.query = rawQuery.toLowerCase();

    if (state.currentStep === 1 && state.query) {
      state.family = "all";
      state.currentStep = 2;
      state.visibleDevices = INITIAL_VISIBLE_DEVICES;
      state.selectedIdentifier = "";
      state.selectedDetails = null;
    }

    if (state.currentStep >= 2) {
      state.visibleDevices = INITIAL_VISIBLE_DEVICES;
      applyDeviceFilters();
    }

    syncQueryToUrl(rawQuery);
    renderAll();
  });

  typeButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const nextType = button.dataset.type;
      if (nextType === state.firmwareType) return;

      state.firmwareType = nextType;
      state.showAllFirmwares = false;
      updateTypeToggle();

      if (state.currentStep === 3 && state.selectedIdentifier) {
        await loadDeviceDetails(state.selectedIdentifier);
      }
    });
  });

  if (langSelect) {
    langSelect.addEventListener("change", (event) => {
      setLanguage(event.target.value);
    });
  }

  familyGallery.addEventListener("click", (event) => {
    const card = event.target.closest(".family-card");
    if (!card) return;

    state.family = card.dataset.family || "all";
    state.currentStep = 2;
    state.visibleDevices = INITIAL_VISIBLE_DEVICES;
    state.selectedIdentifier = "";
    state.selectedDetails = null;
    state.showAllFirmwares = false;
    applyDeviceFilters();
    renderAll();
  });

  loadMoreBtn.addEventListener("click", () => {
    state.visibleDevices += DEVICES_INCREMENT;
    renderDevices();
  });

  deviceGrid.addEventListener("click", async (event) => {
    const card = event.target.closest(".device-card");
    if (!card) return;
    const identifier = card.dataset.identifier;
    if (!identifier) return;

    state.showAllFirmwares = false;
    await loadDeviceDetails(identifier);
  });

  toggleRowsBtn.addEventListener("click", () => {
    state.showAllFirmwares = !state.showAllFirmwares;
    renderFirmwareTable();
  });
}

function goToHome({ scrollTarget = "explorer" } = {}) {
  state.currentStep = 1;
  state.family = "";
  state.query = "";
  state.selectedIdentifier = "";
  state.selectedDetails = null;
  state.visibleDevices = INITIAL_VISIBLE_DEVICES;
  state.showAllFirmwares = false;
  searchInput.value = "";
  applyDeviceFilters();
  renderAll();

  if (scrollTarget === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  explorerPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function loadDevices() {
  try {
    const response = await fetchJson(`${API_BASE}/devices`);
    state.devices = normalizeDevices(response);
    applyDeviceFilters();
    renderAll();
  } catch (error) {
    familyGallery.innerHTML = `<div class="error-box">Impossible de charger les appareils: ${escapeHtml(
      error.message
    )}</div>`;
    deviceCount.textContent = "Erreur";
  }
}

function normalizeDevices(payload) {
  const map = new Map();
  const raw = Array.isArray(payload) ? payload : [];

  raw.forEach((item) => {
    if (!item || !item.identifier || !item.name) return;
    if (map.has(item.identifier)) return;
    map.set(item.identifier, {
      name: item.name,
      identifier: item.identifier,
      family: inferFamily(item.identifier, item.name),
    });
  });

  return Array.from(map.values()).sort((a, b) => {
    const nameCompare = a.name.localeCompare(b.name, "en");
    if (nameCompare !== 0) return nameCompare;
    return a.identifier.localeCompare(b.identifier, "en");
  });
}

function inferFamily(identifier, name) {
  const id = (identifier || "").toLowerCase();
  const deviceName = (name || "").toLowerCase();

  if (id.startsWith("iphone")) return "iphone";
  if (id.startsWith("ipad")) return "ipad";
  if (id.startsWith("ipod")) return "ipod";
  if (id.startsWith("watch")) return "watch";
  if (id.startsWith("appletv")) return "appletv";
  if (id.startsWith("audioaccessory")) return "homepod";
  if (id.startsWith("reality")) return "vision";
  if (
    id.startsWith("mac") ||
    deviceName.includes("macbook") ||
    deviceName.includes("imac") ||
    deviceName.includes("mac mini")
  ) {
    return "mac";
  }
  return "other";
}

function applyDeviceFilters() {
  let list = state.devices;

  if (state.family && state.family !== "all") {
    list = list.filter((device) => device.family === state.family);
  }

  if (state.query) {
    list = list.filter(
      (device) =>
        device.name.toLowerCase().includes(state.query) ||
        device.identifier.toLowerCase().includes(state.query)
    );
  }

  state.filteredDevices = list;
}

function renderAll() {
  applyTranslations();
  updateNavigation();
  updateExplorerView();
  updateTypeToggle();
  syncQueryToUrl(searchInput.value.trim());
}

function updateExplorerView() {
  const isStep1 = state.currentStep === 1;
  const isStep2 = state.currentStep === 2;
  const isStep3 = state.currentStep === 3;

  const dict = TRANSLATIONS[state.lang] || TRANSLATIONS.fr;

  categoryView.classList.toggle("hidden", !isStep1);
  modelView.classList.toggle("hidden", !isStep2);
  fileView.classList.toggle("hidden", !isStep3);

  if (isStep1) {
    viewTitle.textContent = dict.view_title_default || "Produits Apple";
    deviceScope.textContent = dict.step_1_scope || "Etape 1: ouvre un dossier produit";
    deviceCount.textContent = `${state.devices.length} ${dict.devices_indexed || "modeles indexes"}`;
    if (familyStatus) {
      familyStatus.textContent = dict.step_1_status || "Etape 1: choisis une categorie.";
    }
    renderFamilyGallery();
    return;
  }

  if (isStep2) {
    applyDeviceFilters();
    const familyLabel = FAMILY_META[state.family]?.label || "Appareils";
    viewTitle.textContent = `Dossier ${familyLabel}`;
    deviceScope.textContent = dict.step_2_scope || "Etape 2: selectionne un modele";
    if (familyStatus) {
      familyStatus.textContent = dict.step_2_status || "Etape 2: ouvre un modele pour voir ses fichiers systeme.";
    }
    renderDevices();
    return;
  }

  if (isStep3) {
    const title = state.selectedDetails?.name || "Fichiers systeme";
    viewTitle.textContent = `Fichiers ${title}`;
    deviceScope.textContent = dict.step_3_scope || "Etape 3: selectionne et telecharge le fichier";
    if (familyStatus) {
      familyStatus.textContent = `${dict.step_3_status || "Type de firmware: "}${state.firmwareType.toUpperCase()}`;
    }
    if (!state.selectedDetails) {
      deviceCount.textContent = `0 ${dict.action || "fichiers"}`;
      firmwarePlaceholder.classList.remove("hidden");
      firmwareContent.classList.add("hidden");
      return;
    }
    renderFirmwareTable();
  }
}

function updateNavigation() {
  // Navigation simplified: could be used for showing/hiding back button if needed in design
}

function applyInitialLanguage() {
  let lang = "fr";
  try {
    const stored = localStorage.getItem("ipsw-lang");
    if (stored === "en" || stored === "fr") {
      lang = stored;
    } else {
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang === "en") lang = "en";
    }
  } catch {
    lang = "fr";
  }
  setLanguage(lang);
}

function setLanguage(lang) {
  state.lang = lang;
  document.documentElement.lang = lang;
  if (langSelect) langSelect.value = lang;
  try {
    localStorage.setItem("ipsw-lang", lang);
  } catch {
    // no-op
  }
  applyTranslations();
}

function applyTranslations() {
  const dict = TRANSLATIONS[state.lang] || TRANSLATIONS.fr;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (!dict[key]) return;

    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      el.placeholder = dict[key];
    } else if (el.classList.contains("hero__title")) {
      el.innerHTML = dict[key];
    } else {
      el.textContent = dict[key];
    }
  });
}

function renderFamilySkeleton() {
  familyGallery.innerHTML = Array.from({ length: 8 }, () => '<div class="skeleton"></div>').join("");
}

function renderFamilyGallery() {
  const counts = state.devices.reduce((acc, device) => {
    acc[device.family] = (acc[device.family] || 0) + 1;
    return acc;
  }, {});

  familyGallery.innerHTML = FAMILY_ORDER.map((family, index) => {
    const meta = FAMILY_META[family];
    const count = counts[family] || 0;
    const imageMarkup = meta.image
      ? `<img class="family-card__image" src="${meta.image}" alt="${escapeHtml(meta.label)}" loading="lazy" onerror="this.onerror=null;this.src='';this.classList.add('hidden');">`
      : '<div class="family-card__fallback">+</div>';

    return `<button
      type="button"
      class="family-card reveal"
      data-family="${family}"
      style="animation-delay:${Math.min(index * 24, 220)}ms"
    >
      <div class="family-card__media">${imageMarkup}</div>
      <span class="family-card__label">${escapeHtml(meta.label)}</span>
      <span class="family-card__count">${count} modeles</span>
    </button>`;
  }).join("");
}

function renderDevices() {
  const total = state.filteredDevices.length;
  const visible = state.filteredDevices.slice(0, state.visibleDevices);

  if (total === 0) {
    deviceGrid.innerHTML = '<div class="empty-state" data-i18n="no_models">Aucun modele dans ce dossier.</div>';
    deviceCount.textContent = "0 / 0";
    loadMoreBtn.classList.add("hidden");
    return;
  }

  deviceGrid.innerHTML = visible
    .map((device, index) => {
      const selectedClass = state.selectedIdentifier === device.identifier ? "is-selected" : "";
      const imgUrl = `https://ipsw.me/assets/devices/${device.identifier}.png`;
      const fallbackUrl = FAMILY_META[state.family]?.image || "";

      return `<button
        type="button"
        class="device-card reveal ${selectedClass}"
        data-identifier="${device.identifier}"
        style="animation-delay:${Math.min(index * 14, 260)}ms"
      >
        <div class="device-card__img">
          <img src="${imgUrl}" alt="${escapeHtml(device.name)}" loading="lazy" 
               onerror="this.onerror=null;this.src='${fallbackUrl}';">
        </div>
        <div class="device-card__info">
          <p class="device-card__name">${escapeHtml(device.name)}</p>
          <p class="device-card__id">${escapeHtml(device.identifier)}</p>
        </div>
      </button>`;
    })
    .join("");

  deviceCount.textContent = `${Math.min(visible.length, total)} / ${total}`;
  loadMoreBtn.classList.toggle("hidden", total <= state.visibleDevices);
}

async function loadDeviceDetails(identifier) {
  const device = state.devices.find((item) => item.identifier === identifier);
  if (!device) return;

  state.selectedIdentifier = identifier;
  state.currentStep = 3;

  firmwarePlaceholder.classList.remove("hidden");
  firmwarePlaceholder.innerHTML =
    "<h2>Chargement...</h2><p>Recuperation des fichiers systeme en cours.</p>";
  firmwareContent.classList.add("hidden");
  toggleRowsBtn.classList.add("hidden");
  renderAll();

  try {
    const url = `${API_BASE}/device/${encodeURIComponent(identifier)}?type=${encodeURIComponent(
      state.firmwareType
    )}`;
    const payload = await fetchJson(url);
    const firmwares = Array.isArray(payload.firmwares)
      ? payload.firmwares
          .slice()
          .sort(
            (a, b) =>
              new Date(b.releasedate || b.uploaddate || 0) -
              new Date(a.releasedate || a.uploaddate || 0)
          )
      : [];

    state.selectedDetails = {
      name: payload.name || device.name,
      identifier: payload.identifier || device.identifier,
      firmwares,
    };

    renderAll();
  } catch (error) {
    state.selectedDetails = null;
    firmwarePlaceholder.classList.remove("hidden");
    firmwareContent.classList.add("hidden");
    firmwarePlaceholder.innerHTML = `<div class="error-box">Impossible de charger les fichiers ${escapeHtml(
      state.firmwareType.toUpperCase()
    )} pour ${escapeHtml(identifier)}: ${escapeHtml(error.message)}</div>`;
  }
}

function renderFirmwareTable() {
  const details = state.selectedDetails;
  if (!details) return;

  const total = details.firmwares.length;
  const maxRows = state.showAllFirmwares ? total : INITIAL_VISIBLE_FIRMWARES;
  const rows = details.firmwares.slice(0, maxRows);

  deviceTitle.textContent = details.name;
  deviceIdentifier.textContent = details.identifier;
  firmwareCount.textContent = `${total} fichiers`;
  deviceCount.textContent = `${total} fichiers`;

  if (total === 0) {
    firmwareTableBody.innerHTML = `<tr><td class="full-row-cell" colspan="6"><div class="empty-state">Aucune version ${escapeHtml(
      state.firmwareType.toUpperCase()
    )} disponible pour cet appareil.</div></td></tr>`;
  } else {
    firmwareTableBody.innerHTML = rows
      .map((fw) => {
        const releaseDate = formatDate(fw.releasedate || fw.uploaddate);
        const build = fw.buildid || "-";
        const size = formatBytes(fw.filesize);
        const signed = Boolean(fw.signed);
        const badgeClass = signed ? "badge--signed" : "badge--unsigned";
        const badgeText = signed ? "Signed" : "Unsigned";
        const link = sanitizeUrl(fw.url);
        const version = fw.version || "-";

        return `<tr class="firmware-row">
          <td data-label="Version">${escapeHtml(version)}</td>
          <td class="mono" data-label="Build">${escapeHtml(build)}</td>
          <td data-label="Date">${escapeHtml(releaseDate)}</td>
          <td data-label="Taille">${escapeHtml(size)}</td>
          <td data-label="Signature"><span class="badge ${badgeClass}">${badgeText}</span></td>
          <td class="action-cell" data-label="Action">${
            link
              ? `<a class="download-link" href="${link}" target="_blank" rel="noreferrer">Telecharger</a>`
              : "-"
          }</td>
        </tr>`;
      })
      .join("");
  }

  if (total > INITIAL_VISIBLE_FIRMWARES) {
    toggleRowsBtn.textContent = state.showAllFirmwares
      ? `Afficher moins (${INITIAL_VISIBLE_FIRMWARES})`
      : `Afficher tous les fichiers (${total})`;
    toggleRowsBtn.classList.remove("hidden");
  } else {
    toggleRowsBtn.classList.add("hidden");
  }

  firmwarePlaceholder.classList.add("hidden");
  firmwareContent.classList.remove("hidden");
}

// Removed legacy wizard steps logic

function updateTypeToggle() {
  typeButtons.forEach((btn) => {
    const active = btn.dataset.type === state.firmwareType;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-selected", active ? "true" : "false");
  });
}

function applyInitialTheme() {
  let theme = "light";
  try {
    const stored = localStorage.getItem("ipsw-theme");
    if (stored === "dark" || stored === "light") {
      theme = stored;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme = "dark";
    }
  } catch {
    theme = "light";
  }
  setTheme(theme);
}

function setTheme(theme) {
  state.theme = theme === "dark" ? "dark" : "light";
  document.body.setAttribute("data-theme", state.theme);
  themeToggleBtn.textContent = state.theme === "dark" ? "Light" : "Dark";
  try {
    localStorage.setItem("ipsw-theme", state.theme);
  } catch {
    // no-op
  }
}

function applyInitialQueryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const rawQuery = (params.get("q") || "").trim();
  if (!rawQuery) return;

  state.query = rawQuery.toLowerCase();
  state.family = "all";
  state.currentStep = 2;
  searchInput.value = rawQuery;
}

function syncQueryToUrl(rawQuery) {
  const normalized = (rawQuery || "").trim();
  const url = new URL(window.location.href);

  if (normalized) {
    url.searchParams.set("q", normalized);
  } else {
    url.searchParams.delete("q");
  }

  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next !== current) {
    window.history.replaceState(null, "", next);
  }
}

async function fetchJson(url, timeout = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  let response;
  try {
    response = await fetch(url, { signal: controller.signal, cache: "no-store" });
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${response.status} ${response.statusText} ${body}`.trim());
  }

  const contentType = response.headers.get("content-type");
  if (contentType && !contentType.includes("application/json")) {
    const text = await response.text();
    if (text.trim().startsWith("<!doctype")) {
      throw new Error("L'API a renvoyé une page HTML au lieu de JSON. Vérifie tes redirections Cloudflare.");
    }
    throw new Error(`Réponse non-JSON reçue: ${contentType}`);
  }

  return response.json();

}

function formatBytes(bytes) {
  if (!bytes || Number.isNaN(Number(bytes))) return "-";
  const value = Number(bytes);
  const units = ["B", "KB", "MB", "GB", "TB"];
  let index = 0;
  let current = value;

  while (current >= 1024 && index < units.length - 1) {
    current /= 1024;
    index += 1;
  }

  const rounded = current >= 10 ? current.toFixed(1) : current.toFixed(2);
  return `${rounded} ${units[index]}`;
}

function formatDate(input) {
  if (!input) return "-";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

function sanitizeUrl(input) {
  if (typeof input !== "string") return "";
  if (!input.startsWith("https://")) return "";
  return input;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
