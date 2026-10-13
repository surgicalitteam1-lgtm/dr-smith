import os
import re
from urllib.parse import unquote

all_images = []
for root, dirs, files in os.walk('.'):
    if '.git' in root or 'scratch' in root:
        continue
    for f in files:
        if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif')):
            full = os.path.join(root, f)
            rel = os.path.relpath(full, '.').replace('\\', '/')
            all_images.append((full, rel, f))

# Read all code/markup files
all_code = ""
for root, dirs, files in os.walk('.'):
    if '.git' in root or 'scratch' in root:
        continue
    for f in files:
        if f.lower().endswith(('.html', '.js', '.css', '.json')):
            full = os.path.join(root, f)
            with open(full, 'r', encoding='utf-8', errors='ignore') as fp:
                all_code += " " + fp.read()

used_images = []
unused_images = []

for full, rel, filename in all_images:
    # Check if filename or rel is in all_code
    # Some images might be url-encoded or referenced relatively
    fn = filename
    if fn in all_code or unquote(fn) in all_code or rel in all_code:
        used_images.append(rel)
    else:
        unused_images.append(rel)

print(f"Total Images on Disk: {len(all_images)}")
print(f"Used Images in Code: {len(used_images)}")
print(f"Unused Images on Disk: {len(unused_images)}")

if unused_images:
    print("\n--- UNUSED IMAGES BY DIRECTORY ---")
    by_dir = {}
    for img in unused_images:
        d = os.path.dirname(img)
        by_dir[d] = by_dir.get(d, 0) + 1
    for d, c in sorted(by_dir.items(), key=lambda x: x[1], reverse=True):
        print(f"  {d}: {c} unused images")
        # print first 2 samples
        samples = [img for img in unused_images if os.path.dirname(img) == d][:2]
        for s in samples:
            print(f"     -> {os.path.basename(s)}")
