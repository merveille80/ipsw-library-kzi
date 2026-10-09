#!/usr/bin/env bash
set -euo pipefail

# ipskzi.com is served by this Worker; wrangler.jsonc defines the build and domain.
# Authentication can use either `wrangler login` or CLOUDFLARE_API_TOKEN.
npx wrangler whoami
npx wrangler deploy
