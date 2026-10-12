import os
import re

catalogue_dir = 'catalogue'

categories = [
    'autoclaves', 'boss-chairs', 'rescue-equipment', 'anesthesia-workstation', 
    'office-furniture', 'small-general-equipment'
]

for cat in categories:
    index_file = os.path.join(catalogue_dir, cat, 'index.html')
    if os.path.exists(index_file):
        with open(index_file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        cards = re.findall(r'<article class="catalogue-card">(.*?)</article>', content, re.DOTALL)
        print(f"\n=================== {cat.upper()} ({len(cards)} cards) ===================")
        for i, c in enumerate(cards, 1):
            img_m = re.search(r'<img[^>]+src="([^">]+)"', c)
            title_m = re.search(r'<h3>(.*?)</h3>', c)
            img = img_m.group(1) if img_m else "NO_IMG"
            title = title_m.group(1) if title_m else "NO_TITLE"
            print(f"[{i}] {img:<40} -> {title}")
