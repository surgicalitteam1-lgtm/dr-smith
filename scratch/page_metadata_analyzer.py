import os
import re

BASE_DIR = os.path.abspath('.')

pages = []

title_pat = re.compile(r'<title>(.*?)</title>', re.IGNORECASE | re.DOTALL)
desc_pat = re.compile(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)["\']', re.IGNORECASE)
canonical_pat = re.compile(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']*)["\']', re.IGNORECASE)
script_pat = re.compile(r'<script[^>]+src=["\']([^"\']+)["\']', re.IGNORECASE)
css_pat = re.compile(r'<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+)["\']', re.IGNORECASE)

for root, dirs, files in os.walk(BASE_DIR):
    if '.git' in root or 'node_modules' in root or 'scratch' in root:
        continue
    for f in files:
        if f.endswith('.html'):
            full = os.path.join(root, f)
            rel = os.path.relpath(full, BASE_DIR).replace('\\', '/')
            with open(full, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
            t_match = title_pat.search(c)
            title = t_match.group(1).strip() if t_match else "NO TITLE"
            d_match = desc_pat.search(c)
            desc = d_match.group(1).strip() if d_match else "NO DESCRIPTION"
            c_match = canonical_pat.search(c)
            canonical = c_match.group(1).strip() if c_match else "NO CANONICAL"
            scripts = [m.group(1) for m in script_pat.finditer(c)]
            styles = [m.group(1) for m in css_pat.finditer(c)]
            
            # Product card count
            prod_count = len(re.findall(r'class=["\'][^"\']*product-card[^"\']*["\']', c, re.IGNORECASE))
            
            pages.append({
                'rel': rel,
                'title': title,
                'desc': desc,
                'canonical': canonical,
                'scripts': scripts,
                'styles': styles,
                'prod_count': prod_count,
                'size': len(c)
            })

pages.sort(key=lambda x: x['rel'])

print(f"Total Pages Analyzed: {len(pages)}")
for p in pages:
    print(f"\nPAGE: {p['rel']} (Size: {p['size']:,} bytes, Products: {p['prod_count']})")
    print(f"  Title: {p['title']}")
    print(f"  Canonical: {p['canonical']}")
    print(f"  Scripts: {len(p['scripts'])} scripts -> {p['scripts'][-3:]}")
