# Memoire Projet - IPSW Library Kzi

Mise a jour: 9 mars 2026

## 1. Contexte

IPSW Library Kzi est une interface moderne inspiree de `ipsw.me` pour faciliter la recherche et le telechargement des firmwares Apple.

Le parcours principal est guide en 3 niveaux:
1. Produit (famille Apple)
2. Modele (appareil)
3. Fichiers systeme (IPSW/OTA + telechargement)

## 2. Objectifs du projet

- Offrir une experience claire, rapide et visuelle.
- Garder un style Apple moderne (fluide, minimaliste, lisible).
- Conserver un vrai workflow "dossier successif".
- Permettre le telechargement direct des fichiers systeme officiels.
- Fournir un mode `Light` et `Dark` avec preference enregistree.

## 3. Fonctionnalites livrees (etat actuel)

- Hero modernise avec branding `Apple Store Kolwezi`.
- Rebranding top bar: `IPSW Library Kzi`.
- Fond unique degrade anime adapte au mode clair/sombre.
- Petites icones produit decoratives de part et d'autre du hero (animation douce).
- Recherche en temps reel (nom appareil ou identifiant).
- Selection du type de firmware `IPSW` / `OTA`.
- Grille produits (iPhone, iPad, Mac, Vision, Apple TV, HomePod, iPod, Watch, etc.).
- Liste modeles avec chargement progressif (`Afficher plus`).
- Tableau firmwares avec:
  - version
  - build
  - date
  - taille
  - statut signature (`Signed` / `Unsigned`)
  - bouton `Telecharger`
- Vue mobile adaptee: action de telechargement conservee.
- Pas de bouton `Source API` expose dans l'interface publique.
- Footer personnalise: `@2026 Merveille Tambwe/Apple Store Kzi`.
- Favicon personnalisee (`favicon.svg`).
- SEO on-page ajoute (meta robots, keywords multilingues, Open Graph, Twitter card, JSON-LD).
- Fichier `robots.txt` ajoute pour le crawl de base.
- `canonical`, `og:url`, `twitter:url` configures sur `https://ipskzi.com/`.
- `sitemap.xml` ajoute et lie dans `robots.txt`.
- Redirection canonique `www.ipskzi.com` vers `ipskzi.com`.
- Section SEO/FAQ visible ajoutee en bas de la home.
- Support de recherche URL `?q=` pour renforcer l'indexation des intentions de recherche.

## 4. Architecture technique

Projet frontend statique:

- `index.html`: structure et sections UI
- `styles.css`: design system, themes, responsive, animations
- `app.js`: logique metier, rendu dynamique, appels vers `/api`
- `functions/api/[[path]].js`: proxy edge Cloudflare vers API IPSW
- `functions/_middleware.js`: redirection host canonique (`www` -> racine)
- `favicon.svg`: icone du site
- `deploy_cloudflare.sh`: script deploy Pages (token API requis)

Execution locale:

```bash
python3 -m http.server 4173 --directory ipsw-clone
```

URL locale:

- `http://localhost:4173`

## 5. API et flux de donnees

Endpoints utilises:

- Cote frontend:
  - `GET /api/devices`
  - `GET /api/device/{identifier}?type=ipsw|ota`
- Fallback local (developpement sans proxy):
  - `https://api.ipsw.me/v4/*`
- Cote proxy (upstream):
  - `GET https://api.ipsw.me/v4/devices`
  - `GET https://api.ipsw.me/v4/device/{identifier}?type=ipsw|ota`

Flux applicatif:

1. Chargement de tous les devices.
2. Normalisation + dedoublonnage + classement par famille.
3. Filtrage par famille et/ou recherche.
4. Ouverture d'un modele.
5. Chargement des firmwares a la demande.
6. Rendu des lignes + action telechargement.

## 6. UX/UI (version en production locale)

### 6.1 Direction visuelle

- Style Apple moderne, contraste propre, effet glass leger.
- Typographie `SF Pro` (fallback systeme Apple).
- Hero plein largeur, rendu premium.
- Elimination des elements visuels juges trop charges.

### 6.2 Animations actives

- `pageGradientFlow`: animation du fond degrade global.
- `rise`: apparition progressive des sections.
- `pulseGlow`: accent visuel sur l'eyebrow hero.
- `heroSideGroupFloat` + `heroSideIconFloat`: mouvement subtil des petites icones laterales.
- `shimmer`: skeleton pendant chargement.
- `activeSweep`: reflet sur le bouton actif IPSW/OTA.

### 6.3 Responsive

- Adaptation desktop / laptop / tablette / mobile.
- Mise en carte des lignes firmware en viewport etroit.
- Bouton de telechargement conserve sur mobile.
- Decor hero masque sur ecrans etroits pour garder la lisibilite.

### 6.4 Accessibilite

- `aria-label` sur controles principaux.
- `aria-live` pour zones dynamiques.
- Etats actifs visibles (theme, type firmware, selection).
- Support `prefers-reduced-motion` pour limiter les animations.

## 7. Securite et robustesse

- `escapeHtml` sur contenus dynamiques.
- Validation stricte des liens (`https://`).
- Timeout reseau via `AbortController`.
- Gestion d'erreurs API et etats vides explicites.

## 8. Performance

- Chargement firmware uniquement a la selection d'un modele.
- Pagination locale des modeles.
- Tri local des firmwares par date.
- Images produits en `loading=\"lazy\"` quand applicable.

## 9. Limites / dette technique actuelle

- Dependance API IPSW + assets distants.
- Pas de base de donnees locale (tout repose sur API IPSW distante).
- Pas de suite de tests automatisee.
- Quelques hooks UI legacy dans `app.js` (wizard/breadcrumb/back) a nettoyer pour aligner avec le HTML actuel.

## 10. Etapes restantes (roadmap projet)

### Phase 1 - Stabilisation (priorite haute)

1. Nettoyer le code legacy non utilise dans `app.js` (wizard, breadcrumb, back).
2. Passer une QA complete multi-ecrans (Android, iPhone, iPad, Mac).
3. Verifier les contrastes WCAG du mode light/dark sur toutes les sections.

### Phase 2 - Fiabilite (priorite haute)

1. Ajouter tests unitaires sur helpers (`formatBytes`, `formatDate`, `sanitizeUrl`, `escapeHtml`).
2. Ajouter gestion de retry reseau (1 tentative supplementaire) sur erreurs temporaires.
3. Ajouter journal minimal des erreurs pour debug (console structuree ou endpoint futur).

### Phase 3 - Produit (priorite moyenne)

1. Ajouter tri/filtre avance des firmwares (signed only, plage date, version).
2. Ajouter page detail build (infos techniques supplementaires).
3. Ajouter export CSV/JSON de la liste filtree.

### Phase 4 - Mise en ligne (priorite moyenne)

1. Deployer sur hebergeur statique (Netlify/Vercel/Cloudflare Pages).
2. Ajouter cache edge ou proxy API pour meilleures performances et masquage partiel des appels.
3. Ajouter monitoring uptime + alertes basiques.

## 11. Conclusion

Le projet est fonctionnel et deja utilisable pour la recherche/telechargement firmware Apple avec une UX moderne.
La prochaine etape importante est la stabilisation technique (nettoyage + tests + QA) avant la mise en ligne finale.

## 12. Etat de deploiement (9 mars 2026)

- Projet Cloudflare Pages cree: `ipsw-library-kzi`
- Deploiement production effectue:
  - `https://992a51ab.ipsw-library-kzi.pages.dev`
- Proxy API edge actif (`/api/*`) et fonctionnel en production.
- SEO configure pour domaine cible: `https://ipskzi.com/`
- Domaine `ipskzi.com` connecte a Cloudflare (nameservers Cloudflare actifs).
