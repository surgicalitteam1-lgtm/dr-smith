import os
import re

found = []
for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root or 'scratch' in root:
        continue
    for f in files:
        if f.endswith('.html'):
            full = os.path.join(root, f)
            rel = os.path.relpath(full, '.')
            with open(full, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
            if re.search(r'class=["\'][^"\']*\bswiper\b', c, re.I):
                found.append(rel)

print(f"HTML pages with actual swiper class: {len(found)}")
for p in found:
    print(f"  - {p}")
