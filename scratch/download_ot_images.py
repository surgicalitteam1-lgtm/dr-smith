import urllib.request
import os
from PIL import Image

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

urls = [
    ("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=2000&q=85", "ot_suite_1.jpg"),
    ("https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=2000&q=85", "ot_suite_2.jpg"),
    ("https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=2000&q=85", "ot_suite_3.jpg"),
    ("https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=2000&q=85", "ot_suite_4.jpg"),
    ("https://upload.wikimedia.org/wikipedia/commons/e/ec/Operation_theater.jpg", "ot_wikimedia_1.jpg"),
    ("https://upload.wikimedia.org/wikipedia/commons/b/b5/Laparoscopic_operating_theatre.jpg", "ot_wikimedia_2.jpg")
]

os.makedirs('assets/img/modular-ot-bg', exist_ok=True)

for url, fname in urls:
    out_path = os.path.join('assets/img/modular-ot-bg', fname)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            with open(out_path, 'wb') as f:
                f.write(data)
        im = Image.open(out_path)
        print(f"Downloaded {fname}: size={im.size}, bytes={len(data)}")
    except Exception as e:
        print(f"Failed {fname} from {url}: {e}")
