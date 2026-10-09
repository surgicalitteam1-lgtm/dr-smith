import re
import os

content = open('index.html', encoding='utf-8').read()
imgs = re.findall(r'<img[^>]+src="([^"]+)"', content)

print(f"Total <img> tags found: {len(imgs)}")
all_valid = True
for idx, src in enumerate(imgs):
    path = src.split('?')[0]
    exists = os.path.exists(path)
    size = os.path.getsize(path) if exists else 0
    if not exists:
        all_valid = False
    print(f"[{idx+1:02d}] exists={exists} ({size/1024:6.1f} KB) -> {src}")

if all_valid:
    print("\nALL IMAGES EXIST AND ARE VALID!")
else:
    print("\nWARNING: SOME IMAGES ARE MISSING!")
