import glob
import re

classes = set()
for f in glob.glob('**/*.html', recursive=True):
    with open(f, 'r', encoding='utf-8') as fp:
        html = fp.read()
    for m in re.finditer(r'class="([^"]+)"', html):
        for c in m.group(1).split():
            if 'container' in c or 'inner' in c or 'hero' in c or 'header' in c:
                classes.add(c)

print('Layout classes found:')
for c in sorted(classes):
    print(' -', c)
