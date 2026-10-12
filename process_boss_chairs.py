import os
from PIL import Image

cat = 'boss-chairs'
dir_path = os.path.join('catalogue', cat)

mapping = {
    'Screenshot 2026-10-11 125510.png': 'dr-smith-boss-high-back-executive-leatherette-chair.png',
    'Screenshot 2026-10-11 125513.png': 'dr-smith-luxury-director-reclining-executive-chair.png',
    'Screenshot 2026-10-11 125516.png': 'dr-smith-ergonomic-high-back-mesh-boss-chair.png',
    'Screenshot 2026-10-11 125520.png': 'dr-smith-orthopedic-lumbar-support-swivel-chair.png',
    'Screenshot 2026-10-11 125526.png': 'dr-smith-premium-brown-leatherette-director-chair.png',
    'Screenshot 2026-10-11 125530.png': 'dr-smith-modern-chrome-base-executive-boss-chair.png',
    'Screenshot 2026-10-11 125533.png': 'dr-smith-luxury-cushion-swivel-boss-chair.png',
    'Screenshot 2026-10-11 125540.png': 'dr-smith-doctor-consultation-high-back-chair.png',
    'Screenshot 2026-10-11 120211.png': 'dr-smith-patient-examination-recliner-chair.png',
    'Screenshot 2026-10-11 120249.png': 'dr-smith-phlebotomy-blood-donation-reclining-chair.png',
    'Screenshot 2026-10-11 124918.png': 'dr-smith-dental-operatory-consultation-chair.png',
}

for src, dst in mapping.items():
    src_p = os.path.join(dir_path, src)
    dst_p = os.path.join(dir_path, dst)
    if os.path.exists(src_p):
        im = Image.open(src_p)
        w, h = im.size
        # crop bottom 40px watermark bar if h > 60
        crop_h = 40 if h > 100 else 0
        cropped = im.crop((0, 0, w, h - crop_h))
        cropped.save(dst_p, 'PNG', optimize=True)
        print(f"Cropped and saved: {dst} ({w}x{h-crop_h})")

# Now update index.html
index_p = os.path.join(dir_path, 'index.html')
with open(index_p, 'r', encoding='utf-8') as f:
    content = f.read()

for src, dst in mapping.items():
    content = content.replace(src, dst)

with open(index_p, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated boss-chairs/index.html successfully!")
