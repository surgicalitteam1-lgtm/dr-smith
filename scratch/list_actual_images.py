import os

dirs = [
    'catalogue/beds',
    'catalogue/anesthesia-workstation',
    'catalogue/patient-monitor',
    'catalogue/c-arm-machine',
    'catalogue/autoclaves',
    'catalogue/surgical-instruments',
    'catalogue/rescue-equipment'
]

for d in dirs:
    if os.path.exists(d):
        files = [f for f in os.listdir(d) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
        print(f"\n{d}: ({len(files)} files)")
        for f in files[:4]:
            print(f"   '{f}'")
