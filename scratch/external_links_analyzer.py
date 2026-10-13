import os
import re
from urllib.parse import urlparse

ext_urls = {}
file_count = 0

for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root or 'scratch' in root:
        continue
    for f in files:
        if f.endswith(('.html', '.js', '.css', '.json', '.txt', '.md', '.ps1')):
            file_count += 1
            full = os.path.join(root, f)
            with open(full, 'r', encoding='utf-8', errors='ignore') as fp:
                content = fp.read()
            urls = re.findall(r'https?://[^\s\"\'<>`\)\]]+', content)
            for u in urls:
                # clean trailing punctuation
                u = u.rstrip('.,;:')
                parsed = urlparse(u)
                domain = parsed.netloc.lower()
                if not domain:
                    continue
                if domain not in ext_urls:
                    ext_urls[domain] = {}
                if u not in ext_urls[domain]:
                    ext_urls[domain][u] = []
                rel = os.path.relpath(full, '.')
                if rel not in ext_urls[domain][u]:
                    ext_urls[domain][u].append(rel)

print(f"Scanned {file_count} files.")
print(f"Found {len(ext_urls)} external domains.")
print("\n" + "="*80)
print("EXTERNAL LINKS INVENTORY BY DOMAIN")
print("="*80)

for domain in sorted(ext_urls.keys()):
    urls = ext_urls[domain]
    print(f"\nDOMAIN: {domain} ({len(urls)} unique URLs)")
    for u, callers in sorted(urls.items()):
        caller_str = ", ".join(callers[:3]) + (f" (+{len(callers)-3} more)" if len(callers) > 3 else "")
        print(f"  • {u}")
        print(f"    referenced in: {caller_str}")
