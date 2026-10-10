import os, re

count = 0
for root, dirs, files in os.walk('.'):
    for f in files:
        if f.endswith('.html'):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8') as fp:
                content = fp.read()
            new_content = re.sub(r'apple-theme\.css\?v=[0-9\.]+', 'apple-theme.css?v=69.0', content)
            new_content = re.sub(r'main\.js\?v=[0-9\.]+', 'main.js?v=69.0', new_content)
            if new_content != content:
                with open(p, 'w', encoding='utf-8') as fp:
                    fp.write(new_content)
                count += 1

print(f'Updated {count} HTML files to v=69.0')
