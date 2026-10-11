import os
import re
from urllib.parse import unquote

broken = []
for root, dirs, files in os.walk('.'):
    if '.git' in root:
        continue
    for f in files:
        if f.endswith('.html'):
            html_path = os.path.join(root, f)
            with open(html_path, 'r', encoding='utf-8', errors='ignore') as fp:
                content = fp.read()
            imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content, re.IGNORECASE)
            for img in imgs:
                if img.startswith('http') or img.startswith('data:'):
                    continue
                clean_img = unquote(img.split('?')[0])
                target = os.path.normpath(os.path.join(root, clean_img))
                if not os.path.exists(target):
                    broken.append((html_path, img, target))

print(f"Total broken images found: {len(broken)}")
for h, i, t in broken:
    print(f"HTML: {h}\n  SRC: {i}\n  TARGET: {t}\n")
