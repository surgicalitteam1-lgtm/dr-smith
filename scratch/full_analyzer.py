import os
import re
from urllib.parse import urlparse, unquote

BASE_DIR = os.path.abspath('.')

html_files = []
js_files = []
css_files = []

for root, dirs, files in os.walk(BASE_DIR):
    if '.git' in root or 'node_modules' in root:
        continue
    for f in files:
        full = os.path.join(root, f)
        rel = os.path.relpath(full, BASE_DIR)
        if f.endswith('.html'):
            html_files.append((full, rel))
        elif f.endswith('.js'):
            js_files.append((full, rel))
        elif f.endswith('.css'):
            css_files.append((full, rel))

print(f"Total HTML: {len(html_files)}, JS: {len(js_files)}, CSS: {len(css_files)}")

# 1. Check all links, scripts, stylesheets, images in HTML
broken_internal_refs = []
external_links = set()
all_internal_links = set()
forms = []

# Regex patterns
href_pattern = re.compile(r'href=["\']([^"\']+)["\']', re.IGNORECASE)
src_pattern = re.compile(r'src=["\']([^"\']+)["\']', re.IGNORECASE)
form_pattern = re.compile(r'<form\b([^>]*)>', re.IGNORECASE)
action_pattern = re.compile(r'action=["\']([^"\']+)["\']', re.IGNORECASE)

def check_local_target(from_file, ref):
    clean = ref.split('?')[0].split('#')[0]
    if not clean or clean.startswith('mailto:') or clean.startswith('tel:') or clean.startswith('javascript:'):
        return True, "protocol/empty"
    
    clean_unquoted = unquote(clean)
    
    # Absolute path relative to web root vs relative to file
    from_dir = os.path.dirname(from_file)
    if clean_unquoted.startswith('/'):
        target = os.path.normpath(os.path.join(BASE_DIR, clean_unquoted.lstrip('/\\')))
    else:
        target = os.path.normpath(os.path.join(from_dir, clean_unquoted))
        
    if os.path.exists(target):
        return True, target
    
    # Maybe it's a directory referencing index.html?
    if os.path.isdir(target) and os.path.exists(os.path.join(target, 'index.html')):
        return True, os.path.join(target, 'index.html')
        
    return False, target

for full, rel in html_files:
    try:
        with open(full, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {rel}: {e}")
        continue
        
    # Check hrefs
    for match in href_pattern.finditer(content):
        val = match.group(1).strip()
        if not val:
            continue
        if val.startswith('http://') or val.startswith('https://') or val.startswith('//'):
            external_links.add((val, rel))
        elif val.startswith('#') or val.startswith('mailto:') or val.startswith('tel:') or val.startswith('javascript:'):
            pass
        else:
            all_internal_links.add((val, rel))
            ok, target = check_local_target(full, val)
            if not ok:
                broken_internal_refs.append({'type': 'href', 'source': rel, 'ref': val, 'target': target})

    # Check srcs
    for match in src_pattern.finditer(content):
        val = match.group(1).strip()
        if not val:
            continue
        if val.startswith('http://') or val.startswith('https://') or val.startswith('//'):
            external_links.add((val, rel))
        elif val.startswith('data:'):
            pass
        else:
            all_internal_links.add((val, rel))
            ok, target = check_local_target(full, val)
            if not ok:
                broken_internal_refs.append({'type': 'src', 'source': rel, 'ref': val, 'target': target})
                
    # Check forms
    for fmatch in form_pattern.finditer(content):
        attrs = fmatch.group(1)
        act_match = action_pattern.search(attrs)
        act = act_match.group(1) if act_match else ""
        forms.append({'file': rel, 'action': act, 'attrs': attrs.strip()})

print(f"\nChecked HTML references.")
print(f"Total Unique External URLs in HTML: {len(external_links)}")
print(f"Total Internal References in HTML: {len(all_internal_links)}")
print(f"Total Broken References in HTML: {len(broken_internal_refs)}")
if broken_internal_refs:
    print("\n--- BROKEN REFERENCES FOUND ---")
    for b in broken_internal_refs[:30]:
        print(f"[{b['type']}] in {b['source']} -> ref '{b['ref']}' -> target does not exist: {b['target']}")
    if len(broken_internal_refs) > 30:
        print(f"... and {len(broken_internal_refs) - 30} more.")

# 2. Check CSS url(...) references
broken_css_refs = []
css_url_pattern = re.compile(r'url\(\s*["\']?([^"\'\)\s]+)["\']?\s*\)', re.IGNORECASE)

for full, rel in css_files:
    try:
        with open(full, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        continue
    for match in css_url_pattern.finditer(content):
        val = match.group(1).strip()
        if val.startswith('http://') or val.startswith('https://') or val.startswith('data:'):
            if val.startswith('http'):
                external_links.add((val, rel))
            continue
        ok, target = check_local_target(full, val)
        if not ok:
            broken_css_refs.append({'source': rel, 'ref': val, 'target': target})

print(f"\nTotal Broken CSS url() references: {len(broken_css_refs)}")
for b in broken_css_refs:
    print(f"CSS in {b['source']} -> ref '{b['ref']}' -> {b['target']}")

# 3. Print Forms summary
print(f"\n--- FORMS FOUND ({len(forms)}) ---")
for frm in forms:
    print(f"File: {frm['file']} | Action: '{frm['action']}'")

