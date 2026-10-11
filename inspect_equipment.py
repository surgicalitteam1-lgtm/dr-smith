import os
from PIL import Image

dirs_to_check = [
    'catalogue/autoclaves',
    'catalogue/baby-warmer',
    'catalogue/pediatric-beds',
    'catalogue/baby products',
    'catalogue/boss chairs',
    'catalogue/chair',
    'catalogue/instruments set',
    'catalogue/Rescue Equipment',
    'catalogue/trolley',
    'catalogue/machines',
    'catalogue/neuro machine',
    'catalogue/medical equipments',
    'catalogue/goods',
    'catalogue/scientific Goods',
    'catalogue/Hospital Screens',
    'catalogue/Stainless Steel Equipment',
    'catalogue/furniture',
    'catalogue/office-furniture'
]

for d in dirs_to_check:
    print(f"=== {d} ===")
    if not os.path.exists(d):
        print("  DOES NOT EXIST")
        continue
    files = sorted(os.listdir(d))
    for f in files:
        if f.endswith('.png') or f.endswith('.jpg'):
            p = os.path.join(d, f)
            try:
                im = Image.open(p)
                print(f"  {f}: size={im.size}")
            except Exception as e:
                print(f"  {f}: error={e}")
