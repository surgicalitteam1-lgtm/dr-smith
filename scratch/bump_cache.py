import os, re

count = 0
for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith('.html'):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8') as fp:
                content = fp.read()
            new_content = re.sub(r'apple-theme\.css\?v=[0-9\.]+', 'apple-theme.css?v=64.0', content)
            if new_content != content:
                with open(p, 'w', encoding='utf-8') as fp:
                    fp.write(new_content)
                count += 1

print(f'Updated {count} HTML files to v=64.0')
