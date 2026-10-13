import os
import re

cat_dir = 'catalogue'
subdirs = [d for d in os.listdir(cat_dir) if os.path.isdir(os.path.join(cat_dir, d)) and d not in ('css', 'img')]

results = []

for d in sorted(subdirs):
    html_path = os.path.join(cat_dir, d, 'index.html')
    if not os.path.exists(html_path):
        results.append({
            'dir': d,
            'exists': False
        })
        continue
    with open(html_path, 'r', encoding='utf-8', errors='ignore') as fp:
        c = fp.read()
    
    # Title
    t_m = re.search(r'<title>(.*?)</title>', c, re.I)
    title = t_m.group(1).strip() if t_m else ''
    
    # Card count
    cards = len(re.findall(r'class=["\'][^"\']*catalogue-grid-item[^"\']*["\']', c, re.I))
    subcat_cards = len(re.findall(r'class=["\'][^"\']*subcat-col[^"\']*["\']', c, re.I))
    
    # Image count in this dir
    imgs_in_dir = len([f for f in os.listdir(os.path.join(cat_dir, d)) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))])
    
    # Missing image tags in this html
    img_srcs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', c, re.I)
    broken_imgs = 0
    for s in img_srcs:
        if s.startswith(('http', 'data:')): continue
        clean_s = s.split('?')[0]
        full_s = os.path.normpath(os.path.join(cat_dir, d, clean_s))
        if not os.path.exists(full_s):
            broken_imgs += 1
            
    results.append({
        'dir': d,
        'exists': True,
        'title': title,
        'cards': cards,
        'subcat_cards': subcat_cards,
        'imgs_in_dir': imgs_in_dir,
        'broken_imgs': broken_imgs,
        'size': len(c)
    })

print(f"Total Catalogue Subdirectories Checked: {len(results)}")
print(f"{'Directory':<28} | {'Cards':<6} | {'Subcats':<7} | {'Imgs in Dir':<11} | {'Broken Imgs':<11} | Title")
print("-" * 100)
for r in results:
    if not r['exists']:
        print(f"{r['dir']:<28} | NO INDEX.HTML FOUND")
    else:
        print(f"{r['dir']:<28} | {r['cards']:<6} | {r['subcat_cards']:<7} | {r['imgs_in_dir']:<11} | {r['broken_imgs']:<11} | {r['title']}")
