import os
import re

issues = []

for root, dirs, files in os.walk('.'):
    if '.git' in root or 'scratch' in root:
        continue
    for f in files:
        if f.endswith('.html'):
            full = os.path.join(root, f)
            rel = os.path.relpath(full, '.')
            with open(full, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
            
            # Check doctype
            if not c.strip().lower().startswith('<!doctype html>'):
                issues.append((rel, 'Missing or misplaced <!DOCTYPE html>'))
            
            # Check charset
            if 'charset=' not in c.lower():
                issues.append((rel, 'Missing meta charset'))
                
            # Check viewport
            if 'name="viewport"' not in c.lower() and "name='viewport'" not in c.lower():
                issues.append((rel, 'Missing meta viewport'))
                
            # Check title
            if '<title>' not in c.lower():
                issues.append((rel, 'Missing <title>'))
                
            # Check favicon
            if 'favicon' not in c.lower():
                issues.append((rel, 'Missing favicon'))

            # Check meta description
            if 'name="description"' not in c.lower() and "name='description'" not in c.lower():
                issues.append((rel, 'Missing meta description'))

print(f"Total HTML standard compliance issues found: {len(issues)}")
for rel, issue in issues:
    print(f"  [{rel}]: {issue}")
