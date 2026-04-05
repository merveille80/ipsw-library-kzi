# Mémoire Projet - IPSW Library Kzi

Mise à jour: 5 avril 2026

## 1. Contexte

IPSW Library Kzi est une interface moderne inspirée de `ipsw.me` pour faciliter la recherche et le téléchargement des firmwares Apple. Le site est géré par **Apple Store Kolwezi** et offre une expérience premium, fluide et bilingue.

Le parcours principal est guidé en 3 niveaux:
1. Produit (famille Apple)
2. Modèle (appareil)
3. Fichiers système (IPSW/OTA + téléchargement)

## 2. Objectifs du projet

- Offrir une expérience claire, rapide et visuelle.
- Style Apple "Premium" (minimaliste, animations fluides, mode sombre/clair).
- **Navigation Multilingue (FR/EN)** avec détection et sauvegarde de la langue.
- **Utilisation d'Iconographie Réelle** (Photos officielles Apple) pour un aspect professionnel.
- Permettre le téléchargement direct des fichiers système officiels via `api.ipsw.me`.

## 3. Fonctionnalités livrées (État Final)

- **Branding & Design** : Hero moderne "Apple Store Kolwezi" avec fond dégradé dynamique.
- **Multi-langue** : Système complet (FR/EN) avec sélecteur de langue dans la barre supérieure.
- **Catalogue Complet** : Toutes les catégories Apple (iPhone, iPad, Mac, Watch, Vision Pro, Apple TV, HomePod, iPod).
- **Photos Officielles** : Utilisation de fichiers `.webp` haute qualité localisés dans `/assets/devices/` pour chaque famille de produits.
- **Recherche en Temps Réel** : Filtrage par nom ou identifiant de modèle.
- **Gestion des Firmwares** : Distinction claire entre IPSW et OTA, vérification du statut de signature (`Signed` / `Unsigned`).
- **Performance & SEO** : 
  - Balises Meta SEO complètes (Open Graph, Twitter Cards).
  - Image de partage sociale (`og-image.png`) personnalisée.
  - Sitemaps et robots.txt optimisés.
- **Interface Adaptive (Responsive)** : Utilisable parfaitement sur iPhone, iPad et Desktop.

## 4. Architecture technique

Projet frontend moderne hébergé sur **Cloudflare Pages** :

- `index.html` : Structure sémantique optimisée pour le SEO.
- `styles.css` : Design System basé sur des variables CSS, gérant les thèmes et les animations.
- `app.js` : Cœur de l'application (Système de traduction, logique de rendu, appels API directs).
- `assets/devices/` : Bibliothèque locale d'icônes officielles Apple.
- `functions/_middleware.js` : Logique serveur pour la redirection `www` vers le domaine racine.

## 5. API et flux de données

Le projet utilise désormais l'**Accès Direct aux Données (Direct API)** :
- **Endpoint Upstream** : `https://api.ipsw.me/v4/`
- **CORS** : Les appels sont faits directement depuis le navigateur car l'API de `ipsw.me` supporte désormais le partage de ressources entre origines (CORS). Cela élimine les erreurs de proxying.
- **Robustesse** : Suppression des dépendances de proxy (`/api/*`) pour une fiabilité maximale.

## 6. UX / UI (Finition Premium)

- **Animations** : Transitions douces lors du changement de vue, effets de survol (hover) premium sur les cartes.
- **Code Clean** : Suppression totale des anciennes références (`backBtn`, anciennes méthodes de navigation) pour un code léger et rapide.
- **Accessibilité** : Respect des contrastes, support du mode sombre automatique.

## 7. État de déploiement (Avril 2026)

- **Domaine Principal** : `https://ipskzi.com`
- **Hébergement** : Cloudflare Pages avec déploiement continu via GitHub (`merveille80/ipsw-library-kzi`).
- **CDN** : Cache actif pour les assets et les scripts pour un temps de chargement éclair.

## 8. Conclusion

Le projet **IPSW Library Kzi** est désormais en version de production stable. Il combine l'esthétique Apple officielle avec une efficacité technique moderne, offrant un outil indispensable pour les utilisateurs et clients d'Apple Store Kolwezi.
