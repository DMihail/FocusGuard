#!/usr/bin/env bash
# Regenerates square Android launcher PNGs from the shield vector (no aspect stretch).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GEN_DIR="$ROOT/.icon-gen"
SVG="$GEN_DIR/icon.svg"
RES="$ROOT/app/src/main/res"

mkdir -p "$GEN_DIR"
cat > "$SVG" << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 96 96">
  <rect width="96" height="96" fill="#6750A4"/>
  <path d="M79.993,51.996c0,19.998 -13.999,29.997 -30.637,35.797a3.999,3.999 0,0 1,-2.68 -0.04c-16.679,-5.76 -30.677,-15.76 -30.677,-35.757V23.998a4,4 0,0 1,4 -4c7.999,0 17.998,-4.8 24.957,-10.879a4.68,4.68 0,0 1,6.08,0C58.035,15.24 67.994,20 75.993,20a4,4 0,0 1,4,3.999v27.998z" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
EOF

render_size() {
  local size="$1"
  local density="$2"
  qlmanage -t -s "$size" -o "$GEN_DIR" "$SVG" >/dev/null
  cp "$SVG.png" "$RES/mipmap-${density}/ic_launcher.png"
  cp "$SVG.png" "$RES/mipmap-${density}/ic_launcher_round.png"
}

render_size 48 mdpi
render_size 72 hdpi
render_size 96 xhdpi
render_size 144 xxhdpi
render_size 192 xxxhdpi

echo "Android launcher icons regenerated."
