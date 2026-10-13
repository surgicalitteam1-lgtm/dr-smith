import os
import re

js_files = []
for root, dirs, files in os.walk('.'):
    if '.git' in root or 'scratch' in root:
        continue
    for f in files:
        if f.endswith('.js'):
            full = os.path.join(root, f)
            rel = os.path.relpath(full, '.')
            js_files.append((full, rel))

print(f"Analyzing {len(js_files)} JS files...")

endpoints = []
storage_keys = []
globals_assigned = []
dom_listeners = []

for full, rel in sorted(js_files, key=lambda x: x[1]):
    with open(full, 'r', encoding='utf-8', errors='ignore') as fp:
        c = fp.read()
    
    # Endpoints
    fetches = re.findall(r'fetch\s*\(\s*[`\'"]([^`\'"]+)[`\'"]', c)
    for fe in fetches:
        endpoints.append((rel, 'fetch', fe))
    
    # Storage keys
    lstore = re.findall(r'(?:localStorage|sessionStorage)\.(?:getItem|setItem|removeItem)\s*\(\s*[\'"]([^\'"]+)[\'"]', c)
    for sk in lstore:
        storage_keys.append((rel, sk))
        
    # Window globals
    w_globals = re.findall(r'window\.([a-zA-Z0-9_$]+)\s*=', c)
    for g in w_globals:
        globals_assigned.append((rel, g))

print("\n=== STORAGE KEYS USED IN JS ===")
for r, k in sorted(set(storage_keys)):
    print(f"  [{k}] in {r}")

print("\n=== GLOBAL FUNCTIONS / OBJECTS EXPOSED ON WINDOW ===")
for r, g in sorted(set(globals_assigned)):
    print(f"  [window.{g}] in {r}")

print("\n=== HARDCODED HTTP/API ENDPOINTS IN JS ===")
for r, meth, ep in endpoints:
    print(f"  [{meth}] {ep} (in {r})")
