with open('assets/css/apple-theme.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if any(k in line for k in ['apple-globalnav-inner', 'hero-split-container', 'container', 'padding-left', 'margin-left', 'apple-footer-inner']):
        if not line.strip().startswith('/*'):
            print(f'{idx+1}: {line.strip()}')
