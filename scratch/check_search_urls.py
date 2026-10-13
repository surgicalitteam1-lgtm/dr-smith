import os
import re

with open('assets/js/global-search.js', 'r', encoding='utf-8') as f:
    c = f.read()

urls = re.findall(r'url:\s*["\']([^"\']+)["\']', c)
print(f"Total URLs in SEARCH_INDEX: {len(urls)}")
broken = []
for u in urls:
    full = os.path.normpath(os.path.join('.', u))
    if not os.path.exists(full):
        broken.append((u, full))

print(f"Broken URLs in SEARCH_INDEX: {len(broken)}")
for u, f in broken:
    print(f"  - {u} -> {f}")
