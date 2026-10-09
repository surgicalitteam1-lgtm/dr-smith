import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

def add_cache_buster(match):
    src = match.group(1)
    if 'assets/img/' in src:
        base = src.split('?')[0]
        return f'src="{base}?v=6.0"'
    return match.group(0)

new_text = re.sub(r'src="([^"]+)"', add_cache_buster, text)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Updated index.html with universal ?v=6.0 cache busters on all images!')
