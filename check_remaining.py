import os

catalogue_dir = 'catalogue'
pending = []

for item in sorted(os.listdir(catalogue_dir)):
    cat_path = os.path.join(catalogue_dir, item)
    if not os.path.isdir(cat_path):
        continue
    index_path = os.path.join(cat_path, 'index.html')
    files = os.listdir(cat_path)
    screenshots = [f for f in files if f.startswith('Screenshot') and f.lower().endswith('.png')]
    dr_smith = [f for f in files if f.startswith('dr-smith-')]
    
    # Check if category has screenshots that haven't been processed or referenced
    if screenshots and len(dr_smith) == 0:
        pending.append((item, os.path.exists(index_path), len(screenshots)))

print(f"Total categories with unprocessed screenshots: {len(pending)}")
for item, has_index, ss_count in pending:
    print(f"  - {item:<28} (has_index: {has_index}, {ss_count} screenshots)")
