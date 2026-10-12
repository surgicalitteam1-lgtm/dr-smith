import os
import re

catalogue_dir = 'catalogue'
results = []
for item in sorted(os.listdir(catalogue_dir)):
    cat_path = os.path.join(catalogue_dir, item)
    if os.path.isdir(cat_path):
        index_file = os.path.join(cat_path, 'index.html')
        has_index = os.path.exists(index_file)
        files = os.listdir(cat_path)
        screenshots = [f for f in files if f.startswith('Screenshot') or f.startswith('723947790_')]
        dr_smith = [f for f in files if f.startswith('dr-smith-')]
        
        # count product cards in index.html if exists
        card_count = 0
        if has_index:
            with open(index_file, 'r', encoding='utf-8', errors='ignore') as f:
                html = f.read()
                card_count = len(re.findall(r'class="[^"]*product-card', html))
        
        results.append((item, has_index, len(screenshots), len(dr_smith), card_count))

print(f"{'Category':<32} | {'Index?':<6} | {'Screenshots':<11} | {'Dr-Smith Imgs':<13} | {'Cards'}")
print("-" * 75)
for item, has_index, ss, dr, cards in results:
    if ss > 0 or not has_index or dr > 0:
        print(f"{item:<32} | {str(has_index):<6} | {ss:<11} | {dr:<13} | {cards}")
