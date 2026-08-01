#!/usr/bin/env bash
# Publica o app em https://gstirma.github.io/strung/
#
# Uso:  ./deploy.sh "descrição da mudança"
#
# Faz o build estático, envia o código para a main e a pasta gerada
# para o branch gh-pages, que é o que o GitHub Pages serve.

set -euo pipefail

cd "$(dirname "$0")"
MSG="${1:-Atualiza o app}"
REPO="https://github.com/gstirma/strung.git"

echo "→ Salvando o código na main…"
git add -A
git diff --cached --quiet || git commit -m "$MSG"
git push origin main

echo "→ Gerando o site…"
NEXT_PUBLIC_BASE_PATH=/strung npx next build

echo "→ Publicando no GitHub Pages…"
TMP="$(mktemp -d)"
cp -r out/. "$TMP/"
touch "$TMP/.nojekyll"
(
  cd "$TMP"
  git init -q -b gh-pages
  git add -A
  git commit -qm "$MSG"
  git remote add origin "$REPO"
  git push -qf origin gh-pages
)
rm -rf "$TMP"

echo "✓ No ar: https://gstirma.github.io/strung/"
echo "  (o GitHub leva ~1 minuto para atualizar)"
