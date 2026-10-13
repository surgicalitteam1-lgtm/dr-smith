import os
import re

swiper_js = []
swiper_css = []

for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root or 'scratch' in root:
        continue
    for f in files:
        if f.endswith('.html'):
            full = os.path.join(root, f)
            rel = os.path.relpath(full, '.')
            with open(full, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
            if 'swiper-bundle.min.js' in c:
                swiper_js.append(rel)
            if 'swiper-bundle.min.css' in c:
                swiper_css.append(rel)

print(f"Pages with Swiper JS: {len(swiper_js)}")
print(f"Pages with Swiper CSS: {len(swiper_css)}")
missing_css = [p for p in swiper_js if p not in swiper_css]
print(f"Pages loading Swiper JS WITHOUT Swiper CSS ({len(missing_css)}):")
for p in missing_css:
    print(f"  - {p}")
