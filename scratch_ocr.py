import os
import subprocess
import glob

folders = [
    'bipap-cpap',
    'dialysis-machine',
    'c-arm-machine',
    'cabinets',
    'defibrillator-aed',
    'disposables',
    'syringe-infusion',
    'ultrasound'
]

for folder in folders:
    cdir = os.path.join('catalogue', folder)
    screenshots = glob.glob(os.path.join(cdir, 'Screenshot*.png'))
    for sc in screenshots:
        cmd = f'powershell -ExecutionPolicy Bypass -File test_ocr.ps1 -ImagePath "{sc}"'
        res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        print(f"File: {sc}")
        print(res.stdout.strip())
        print("-" * 50)
