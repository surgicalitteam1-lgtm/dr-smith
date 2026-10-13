import os
import re
from urllib.parse import urlparse, unquote

BASE_DIR = os.path.abspath('.')

# Collect all HTML files
html_files = {}
for root, dirs, files in os.walk(BASE_DIR):
    if '.git' in root or 'node_modules' in root or 'scratch' in root:
        continue
    for f in files:
        if f.endswith('.html'):
            full = os.path.join(root, f)
            rel = os.path.relpath(full, BASE_DIR).replace('\\', '/')
            with open(full, 'r', encoding='utf-8', errors='ignore') as fp:
                html_files[rel] = fp.read()

print(f"Loaded {len(html_files)} HTML files for deep link and anchor analysis.")

# Extract all IDs in each HTML file
page_ids = {}
id_pattern = re.compile(r'id=["\']([^"\']+)["\']', re.IGNORECASE)
for rel, content in html_files.items():
    ids = set(id_pattern.findall(content))
    page_ids[rel] = ids

# Check every href in every file
broken_anchors = []
internal_links_map = {}

href_pattern = re.compile(r'href=["\']([^"\']+)["\']', re.IGNORECASE)

for rel, content in html_files.items():
    dir_rel = os.path.dirname(rel)
    for m in href_pattern.finditer(content):
        href = m.group(1).strip()
        if not href or href.startswith(('http://', 'https://', 'mailto:', 'tel:', 'javascript:')):
            continue
        
        # Parse path and fragment
        parts = href.split('#')
        path_part = parts[0].split('?')[0]
        fragment = parts[1] if len(parts) > 1 else None
        
        # Determine target file
        if not path_part:
            # Anchor on same page
            target_file = rel
        elif path_part.startswith('/'):
            target_file = path_part.lstrip('/')
            if not target_file.endswith('.html'):
                if target_file == '' or target_file.endswith('/'):
                    target_file = target_file + 'index.html'
                else:
                    target_file = target_file + '/index.html'
        else:
            joined = os.path.normpath(os.path.join(dir_rel, path_part)).replace('\\', '/')
            if not joined.endswith('.html'):
                if os.path.isdir(os.path.join(BASE_DIR, joined)):
                    target_file = joined + '/index.html'
                else:
                    target_file = joined
            else:
                target_file = joined

        # Normalize target_file
        target_file = target_file.replace('\\', '/')
        if target_file.startswith('./'):
            target_file = target_file[2:]

        # Verify target file exists
        if target_file not in html_files:
            # Might be non-html file (like a pdf or image)
            full_disk_target = os.path.normpath(os.path.join(BASE_DIR, target_file))
            if not os.path.exists(full_disk_target):
                broken_anchors.append({
                    'source': rel,
                    'href': href,
                    'issue': f'File not found: {target_file}'
                })
                continue
        else:
            # If fragment is specified, check if ID exists on that page
            if fragment:
                # ignore common generic fragments like '!' or top
                if fragment not in ('', 'top', '!'):
                    if fragment not in page_ids.get(target_file, set()):
                        broken_anchors.append({
                            'source': rel,
                            'href': href,
                            'target_file': target_file,
                            'fragment': fragment,
                            'issue': f"Element ID '#{fragment}' not found in '{target_file}'"
                        })

print(f"Total Broken Anchors / Hash Fragment issues: {len(broken_anchors)}")
if broken_anchors:
    # Group by issue
    grouped = {}
    for b in broken_anchors:
        key = b['issue']
        if key not in grouped:
            grouped[key] = []
        grouped[key].append(b['source'])
    for issue, sources in sorted(grouped.items(), key=lambda x: len(x[1]), reverse=True):
        print(f"\nIssue: {issue}")
        print(f"Count: {len(sources)}")
        print(f"Sources (first 3): {sources[:3]}")
