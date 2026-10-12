import os
from PIL import Image

dirs = ['modular-ot', 'miscellaneous', 'medical-disposables', 'chair', 'neuro machine']

for d in dirs:
    dp = os.path.join('catalogue', d)
    if os.path.exists(dp):
        files = os.listdir(dp)
        print(f"\n=== {d} ({len(files)} files) ===")
        for f in files:
            fp = os.path.join(dp, f)
            if f.endswith(('.png', '.jpg', '.jpeg')):
                im = Image.open(fp)
                print(f"  {f}: size={im.size}")
            else:
                print(f"  {f}")
