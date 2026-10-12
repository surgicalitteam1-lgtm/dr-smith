import os
import re

hubs = [
    'catalogue/equipments/index.html',
    'catalogue/furniture/index.html',
    'catalogue/instruments/index.html',
    'catalogue/medical-disposables/index.html',
    'catalogue/nic-machines/index.html',
    'catalogue/radiology-equipments/index.html'
]

all_linked = set()

for hub in hubs:
    if not os.path.exists(hub):
        print(f"MISSING: {hub}")
        continue
    with open(hub, 'r', encoding='utf-8') as f:
        html = f.read()
    links = re.findall(r'href=["\']\.\./([^/]+)/index\.html["\']', html)
    # filter out 'index' or parent links
    links = [l for l in links if l not in ('..', 'index', 'catalogue')]
    print(f"\n{hub} ({len(links)} links):")
    for l in links:
        print(f"  - {l}")
        all_linked.add(l)

print(f"\nTotal unique subcategories linked by 6 hubs: {len(all_linked)}")

# Now find all directories in catalogue with index.html
base = 'catalogue'
all_dirs = [d for d in os.listdir(base) if os.path.isdir(os.path.join(base, d))]
all_with_html = [d for d in all_dirs if os.path.exists(os.path.join(base, d, 'index.html'))]

print(f"\nTotal directories in catalogue: {len(all_dirs)}")
print(f"Directories with index.html: {len(all_with_html)}")

hub_dirs = {'equipments', 'furniture', 'instruments', 'medical-disposables', 'nic-machines', 'radiology-equipments'}
unlinked_with_html = [d for d in all_with_html if d not in all_linked and d not in hub_dirs]
print(f"\nDirectories with index.html NOT linked by 6 hubs: {len(unlinked_with_html)}")
for d in unlinked_with_html:
    print(f"  * {d}")

no_html = [d for d in all_dirs if d not in all_with_html]
print(f"\nDirectories WITHOUT index.html: {len(no_html)}")
for d in no_html:
    print(f"  ! {d}")
