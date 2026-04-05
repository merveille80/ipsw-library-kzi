# IPSW Library Kzi

Clone moderne de `ipsw.me` (frontend) avec:

- grille visuelle par grandes categories Apple (style assistant de selection)
- navigation en dossiers successifs: `Produit -> Modele -> Fichiers -> Telecharger`
- recherche appareils Apple
- parcours guide en 3 etapes (Produit -> Modele -> Version)
- mode `Light` / `Dark` avec preference enregistree
- switch `IPSW` / `OTA`
- table des versions avec statut de signature et lien de telechargement
- animations fluides (reveal, hover, skeleton, fond dynamique)
- favicon personnalisee (`favicon.svg`)
- SEO on-page (meta tags, Open Graph, Twitter card, JSON-LD)
- robots de base (`robots.txt`)
- sitemap (`sitemap.xml`) configure pour `https://ipskzi.com`
- redirection canonique `www.ipskzi.com -> ipskzi.com` via `functions/_middleware.js`
- support URL de recherche SEO: `https://ipskzi.com/?q=iphone`

## Lancer localement

Depuis la racine du workspace:

```bash
python3 -m http.server 4173 --directory ipsw-clone
```

Puis ouvrir:

- http://localhost:4173

## API utilisee

- `GET https://api.ipsw.me/v4/devices`
- `GET https://api.ipsw.me/v4/device/{identifier}?type=ipsw|ota`

## Deploy Cloudflare (Pages + Proxy API)

Le projet est prepare pour:
- frontend statique sur Cloudflare Pages
- proxy API via `functions/api/[[path]].js` (route locale `/api/*`)
- fallback developpement local: appel direct `https://api.ipsw.me/v4`

### 1. Login Cloudflare (une seule fois)

```bash
npx wrangler login
```

Verifier:

```bash
npx wrangler whoami
```

### 2. Creer le projet Pages (une fois)

```bash
npx wrangler pages project create ipsw-library-kzi --production-branch main
```

### 3. Deploy

Depuis le dossier `ipsw-clone`:

```bash
npx wrangler pages deploy . --project-name ipsw-library-kzi
```

Ou en une commande (avec token configure):

```bash
./deploy_cloudflare.sh
```

### 4. Domaine custom

Dans Cloudflare Dashboard:
- Pages > `ipsw-library-kzi` > Custom domains
- Ajouter ton domaine (ex: `ipskzi.com`)
- SSL sera gere automatiquement par Cloudflare

## Indexation Google (obligatoire pour apparaitre vite)

1. Ouvrir Google Search Console et ajouter la propriete `https://ipskzi.com`.
2. Soumettre le sitemap: `https://ipskzi.com/sitemap.xml`.
3. Utiliser "Inspection de l'URL" puis "Demander une indexation" pour la page d'accueil.
4. Verifier que la version canonique est `https://ipskzi.com/` (sans `www`).

## Memoire du projet

- `./MEMOIRE_PROJET_IPSW.md`

## URL de deploiement actuel

- Domaine principal: `https://ipskzi.com`
- Domaine secondaire (redirige vers principal): `https://www.ipskzi.com`
- Domaine Pages: `https://ipsw-library-kzi.pages.dev`
