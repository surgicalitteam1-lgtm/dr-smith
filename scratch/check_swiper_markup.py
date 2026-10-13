import os

pages_with_swiper_markup = []
pages_with_swiper_script = []

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
                pages_with_swiper_script.append(rel)
                c_clean = c.replace('swiper-bundle.min.js', '').replace('swiper-bundle.min.css', '')
                if 'swiper' in c_clean.lower():
                    pages_with_swiper_markup.append(rel)

print(f"Total HTML pages loading swiper script: {len(pages_with_swiper_script)}")
print(f"Pages actually having 'swiper' markup in HTML: {len(pages_with_swiper_markup)}")
print("Pages with markup:", pages_with_swiper_markup)
