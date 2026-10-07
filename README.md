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

## Déploiement Cloudflare Workers

Le domaine `https://ipskzi.com/` est servi par le Worker `ipsw-library-kzi`.
La configuration `wrangler.jsonc` publie les fichiers statiques depuis `dist`.
Le projet Pages du même nom est un projet séparé.

### Connexion et publication

```bash
npx wrangler login
npx wrangler whoami
npx wrangler deploy
```

Ou, après connexion :

```bash
./deploy_cloudflare.sh
```

Wrangler exécute `node scripts/build-static.mjs` avant le déploiement.
Ce script copie seulement les fichiers publics du site, les images et les polices.
Le dépôt Git, la documentation et les fichiers de configuration restent hors de `dist`.
Les fichiers de licence des polices sont inclus dans les assets.

Pour préparer le dossier sans publier :

```bash
node scripts/build-static.mjs
```

Le frontend appelle directement `https://api.ipsw.me/v4`.
Les fonctions dans `functions/` sont conservées pour l'ancien déploiement Pages ;
elles ne sont pas exécutées par le Worker statique.

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
