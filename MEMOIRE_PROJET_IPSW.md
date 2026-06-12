# 🧠 MÉMOIRE PROJET — Firmware Library (ipskzi.com)
_Dernière mise à jour : 2026-06-13_

---

## 📌 Informations essentielles

| Élément | Valeur |
|---|---|
| **Nom du projet** | Firmware Library |
| **Dépôt GitHub** | `merveille80/ipsw-library-kzi` |
| **URL de prod (Worker)** | https://ipsw-library-kzi.merveillesoft80.workers.dev/ |
| **URL domaine custom** | https://ipskzi.com/ _(domaine enregistré sur Hostinger)_ |
| **Hébergement** | Cloudflare Pages (déploiement auto depuis GitHub `main`) |
| **Stack** | HTML + CSS vanilla + JavaScript vanilla (pas de framework) |
| **API données** | https://api.ipsw.me/v4 (ipsw.me — firmwares Apple) |
| **Version assets** | v1.0.5 (CSS et JS busted à chaque refonte majeure) |

---

## 🏗️ Architecture du projet

```
ipsw-clone/
├── index.html          # Page unique (SPA)
├── app.js              # Toute la logique JS (v1.0.5)
├── styles.css          # Tout le CSS (v1.0.5, ~2170 lignes)
├── favicon.svg         # Icône téléchargement bleu
├── robots.txt
├── sitemap.xml
├── assets/
│   └── devices/        # Images webp des appareils Apple
│       ├── iphone.webp
│       ├── ipad.webp
│       ├── mac.webp
│       ├── watch_v2.webp
│       ├── appletv.webp
│       ├── homepod.webp
│       ├── ipod_v2.webp
│       └── vision.webp
├── functions/          # Cloudflare Pages Functions (proxy API si besoin)
├── deploy_cloudflare.sh
└── MEMOIRE_PROJET_IPSW.md  ← CE FICHIER
```

---

## ✅ Ce qui est TERMINÉ et FONCTIONNEL

### Design & UI (Silicon Valley Flat Design)
- Style épuré sans bordures dures — inspiré Apple/Linear/Vercel
- Mode sombre (fond noir pur `#000000`) + mode clair (fond blanc pur `#ffffff`)
- Toggle thème Soleil☀️/Lune🌙 animé dans la topbar (switch pill)
- Sélecteur de langue FR/EN — dropdown custom glassmorphism (PAS un `<select>` natif)
- Hero section avec :
  - Badge social proof ("Trusted by 10,000+ developers" + 3 avatars)
  - Titre gradient animé
  - Sous-titre
  - 8 boutons mini-produits (iPhone, iPad, Mac, Watch, Apple TV, Vision, HomePod, iPod)
  - 2 boutons d'action ("Commencer maintenant" + "Voir les produits")
  - Compteurs animés (500+ firmwares, 8 plateformes, 10K+ utilisateurs)
  - Indicateur de scroll animé
- Section témoignages (3 cartes avec photos Unsplash)
- Section SEO copy (3 cartes : iPhone/iOS, iPad/Mac/Watch/TV, IPSW/OTA)
- Footer avec liens API IPSW.me, IPSW.me, AppleDB
- Topbar sticky avec backdrop-filter blur
- Ambient glow orbs en mode sombre (désactivés en mode clair)

### Fonctionnalités JS
- Navigation 3 étapes : **Catégorie → Modèle → Firmware**
- Étape 1 : Galerie de 8 familles de produits (family-gallery)
- Étape 2 : Grille de modèles avec pagination (60 + "Afficher plus" par +40)
- Étape 3 : Tableau des firmwares avec skeleton loader shimmer
- Toggle IPSW / OTA
- Barre de recherche avec sync URL (`?q=...`)
- Vérification de signature (badge vert Signé / rouge Non signé)
- Bouton retour (back) entre les étapes
- Navigation par dots de progression (3 dots)
- Internationalisation FR/EN complète (toutes les chaînes traduites)
- Sauvegarde localStorage : thème (`ipsw-theme`) + langue (`ipsw-lang`)
- Boutons quick-select dans le hero cliquables → scroll vers explorer

### SEO & Meta
- `<title>` + meta description/keywords/robots/googlebot/bingbot
- Open Graph complet (og:title, og:url, og:description, og:image, og:locale)
- Twitter Card (summary_large_image)
- Schema.org JSON-LD : Organization, WebSite (SearchAction), SoftwareApplication, FAQPage
- Canonical + hreflang (fr, en, x-default)
- `<meta name="color-scheme" content="light dark">`
- sitemap.xml et robots.txt présents

### Mobile & Responsive
- Responsive 3 breakpoints : 1024px, 768px, 480px
- Tableau firmware → cartes empilées sur mobile (thead masqué, tbody en grid)
- Boutons tactiles min-height 44px
- **Fix FOUC dark mode mobile** (voir section ci-dessous)

### Déploiement
- GitHub Actions / Cloudflare Pages : push sur `main` → déploiement automatique
- URL Worker : https://ipsw-library-kzi.merveillesoft80.workers.dev/ ✅ **FONCTIONNE**
- URL Custom : https://ipskzi.com/ ⚠️ **PARTIELLEMENT — voir statut domaine**

---

## ⚠️ Statut du domaine ipskzi.com

**Situation actuelle :**
- Le domaine `ipskzi.com` a été acheté sur **Hostinger**
- Cloudflare gère la zone DNS de `ipskzi.com` (le domaine a été délégué à Cloudflare)
- On a tenté d'ajouter `ipskzi.com` comme Custom Domain sur le Worker Cloudflare
- **Le domaine semble parfois résoudre vers le bon site, parfois vers l'ancienne version**
- La propagation DNS peut prendre jusqu'à 48h

**Ce qu'il faudra vérifier à la prochaine session :**
1. Aller sur https://dash.cloudflare.com → Zone `ipskzi.com` → DNS
2. Vérifier qu'il existe un enregistrement CNAME pointant vers `ipsw-library-kzi.merveillesoft80.workers.dev`
3. OU vérifier que le Worker a `ipskzi.com` dans ses Custom Domains
4. Sur https://ipskzi.com/ : vérifier que le nouveau design s'affiche bien

---

## 🔧 Fix Technique Important — Anti-FOUC Dark Mode (v1.0.5)

**Problème résolu :** Sur mobile, la page flashait en blanc avant d'appliquer le mode sombre (Flash of Unstyled Content).

**Solution implémentée :**

1. **Script inline dans `<head>` (index.html)** — s'exécute avant le rendu :
```html
<script>
  (function() {
    try {
      var stored = localStorage.getItem('ipsw-theme');
      var theme = (stored === 'dark' || stored === 'light')
        ? stored
        : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    } catch(e) {}
  })();
</script>
```

2. **`setTheme()` dans app.js** — applique sur `html` ET `body` :
```js
document.documentElement.setAttribute("data-theme", state.theme);
document.body.setAttribute("data-theme", state.theme);
```

3. **CSS** — sélecteurs `html[data-theme]` ajoutés en parallèle des `body[data-theme]` pour toutes les règles thème.

4. **`html { background: var(--bg-primary, #ffffff); }`** dans CSS — le fond s'applique dès le premier paint.

---

## 🚫 Ce qui N'existe PAS (pour éviter les hallucinations)

- ❌ Pas d'image `/assets/og-image.png` (référencée dans le HTML mais non créée)
- ❌ Pas de `manifest.json` (pas de PWA)
- ❌ Pas de Service Worker
- ❌ Pas de backend/base de données (tout vient de l'API ipsw.me)
- ❌ Pas d'authentification utilisateur
- ❌ Pas de page de détail séparée (SPA — une seule page)
- ❌ Pas de Tailwind (CSS vanilla uniquement)
- ❌ Pas de React/Vue/Angular (JS vanilla uniquement)
- ❌ Pas de filtre par version iOS
- ❌ Pas de bouton "Copier le lien"
- ❌ Pas d'historique de navigation persistant

---

## 📋 Ce qui reste à faire (prochaines sessions)

### Priorité haute
- [ ] Confirmer que `ipskzi.com` pointe bien vers le nouveau site Cloudflare
- [ ] Créer l'image OG `/assets/og-image.png` (1200×630px) pour les partages réseaux sociaux

### Priorité moyenne
- [ ] Ajouter `manifest.json` (PWA — "Ajouter à l'écran d'accueil" mobile)
- [ ] Soumettre `sitemap.xml` à Google Search Console
- [ ] Vérifier Core Web Vitals (PageSpeed Insights)

### Optionnel / Améliorations futures
- [ ] Filtre par version iOS dans le tableau firmware
- [ ] Bouton "Copier le lien de téléchargement"
- [ ] Historique des derniers appareils consultés (localStorage)
- [ ] Lazy loading sur les images webp des appareils

---

## 🎨 Design Tokens Clés (CSS Variables)

| Token | Light | Dark |
|---|---|---|
| `--bg-primary` | `#ffffff` | `#000000` |
| `--text` | `#1d1d1f` | `#f5f5f7` |
| `--text-soft` | `#86868b` | `#a1a1a6` |
| `--surface` | `#ffffff` | `#1c1c1e` |
| `--surface-strong` | `#f5f5f7` | `#2c2c2e` |
| `--blue` | `#0071e3` | `#0071e3` |
| `--control-bg` | `rgba(0,0,0,0.04)` | `rgba(255,255,255,0.08)` |
| `--line` | `transparent` | `transparent` |
| `--topbar-bg` | `rgba(255,255,255,0.72)` | `rgba(0,0,0,0.72)` |
