import os
import re

catalogue_dir = 'catalogue'

categories_to_process = []

for item in sorted(os.listdir(catalogue_dir)):
    cat_path = os.path.join(catalogue_dir, item)
    if not os.path.isdir(cat_path):
        continue
    index_path = os.path.join(cat_path, 'index.html')
    files = os.listdir(cat_path)
    screenshots = [f for f in files if (f.startswith('Screenshot') or f.startswith('723947790_')) and f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
    dr_smith = [f for f in files if f.startswith('dr-smith-')]
    
    if screenshots:
        categories_to_process.append((item, os.path.exists(index_path), len(screenshots), len(dr_smith), screenshots))

print(f"Total categories with screenshots: {len(categories_to_process)}")
for item, has_index, ss_count, dr_count, ss_list in categories_to_process:
    print(f"\n{item} (Index: {has_index}, Screenshots: {ss_count}, dr-smith: {dr_count})")
    for s in ss_list[:5]:
        print(f"  - {s}")
    if len(ss_list) > 5:
        print(f"  ... and {len(ss_list)-5} more")
