#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="${PROJECT_NAME:-ipsw-library-kzi}"

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "Erreur: CLOUDFLARE_API_TOKEN est requis."
  echo "Exemple: export CLOUDFLARE_API_TOKEN='ton_token'"
  exit 1
fi

echo "Verification du compte Cloudflare..."
npx wrangler whoami

echo "Creation du projet Pages (ignoree s'il existe deja)..."
if ! npx wrangler pages project create "$PROJECT_NAME" --production-branch main; then
  echo "Projet deja existant ou creation non necessaire, on continue."
fi

echo "Deploy Pages..."
npx wrangler pages deploy . --project-name "$PROJECT_NAME"

echo "Deploy termine."
