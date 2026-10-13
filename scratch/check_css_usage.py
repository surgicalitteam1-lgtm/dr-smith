import os
import re

css_usage = {}
for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root or 'scratch' in root:
        continue
    for f in files:
        if f.endswith('.html'):
            full = os.path.join(root, f)
            rel = os.path.relpath(full, '.')
            with open(full, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
            # find all <link ...> tags with rel="stylesheet"
            links = re.findall(r'<link\b[^>]*>', c, re.I)
            for link in links:
                if 'stylesheet' in link:
                    m = re.search(r'href=["\']([^"\']+)["\']', link, re.I)
                    if m:
                        val = m.group(1).split('?')[0].split('/')[-1]
                        if val not in css_usage:
                            css_usage[val] = []
                        css_usage[val].append(rel)

print("=== CSS USAGE ACROSS HTML PAGES ===")
for css, pages in sorted(css_usage.items(), key=lambda x: len(x[1]), reverse=True):
    print(f"\n{css}: loaded by {len(pages)} pages")
    print(f"  Sample: {pages[:3]}")
