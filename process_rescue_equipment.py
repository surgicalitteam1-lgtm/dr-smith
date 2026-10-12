import os
from PIL import Image

cat = 'rescue-equipment'
dir_path = os.path.join('catalogue', cat)

mapping = {
    'Screenshot 2026-10-11 121928.png': 'dr-smith-spine-board-immobilizer-swm-11079.png',
    'Screenshot 2026-10-11 121932.png': 'dr-smith-scoop-stretcher-split-swm-11080.png',
    'Screenshot 2026-10-11 121936.png': 'dr-smith-two-fold-emergency-stretcher-swm-11081.png',
    'Screenshot 2026-10-11 121940.png': 'dr-smith-four-fold-compact-stretcher-swm-11082.png',
    'Screenshot 2026-10-11 121944.png': 'dr-smith-mobile-bowl-basin-stand-swm-11083.png',
    'Screenshot 2026-10-11 121948.png': 'dr-smith-surgical-kick-bucket-castors-swm-11084.png',
    'Screenshot 2026-10-11 121952.png': 'dr-smith-emergency-laryngoscope-set-swm-11085.png',
    'Screenshot 2026-10-11 121956.png': 'dr-smith-silicone-resuscitator-ambu-bag-swm-11086.png',
    'Screenshot 2026-10-11 122002.png': 'dr-smith-emergency-portable-suction-unit.png',
    'Screenshot 2026-10-11 122006.png': 'dr-smith-multi-parameter-patient-monitor-12inch.png',
    'Screenshot 2026-10-11 122011.png': 'dr-smith-12-channel-diagnostic-ecg-machine.png',
    'Screenshot 2026-10-11 122015.png': 'dr-smith-biphasic-defibrillator-monitor-swm-11090.png',
}

for src, dst in mapping.items():
    src_p = os.path.join(dir_path, src)
    dst_p = os.path.join(dir_path, dst)
    if os.path.exists(src_p):
        im = Image.open(src_p)
        w, h = im.size
        crop_h = 40 if h > 100 else 0
        cropped = im.crop((0, 0, w, h - crop_h))
        cropped.save(dst_p, 'PNG', optimize=True)
        print(f"Cropped and saved: {dst} ({w}x{h-crop_h})")

# Update index.html
index_p = os.path.join(dir_path, 'index.html')
with open(index_p, 'r', encoding='utf-8') as f:
    content = f.read()

for src, dst in mapping.items():
    content = content.replace(src, dst)

with open(index_p, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated rescue-equipment/index.html successfully!")
