import os
from PIL import Image

cat = 'autoclaves'
files = [f for f in sorted(os.listdir(os.path.join('catalogue', cat))) if f.startswith('Screenshot') or f.startswith('723947790_')]

print(f"Examining {cat}: {len(files)} files")
for f in files:
    fp = os.path.join('catalogue', cat, f)
    im = Image.open(fp)
    print(f"{f}: size={im.size}, mode={im.mode}")
