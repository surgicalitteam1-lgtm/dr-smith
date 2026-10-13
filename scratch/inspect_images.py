import os
from PIL import Image

def analyze_image(path):
    if not os.path.exists(path):
        return f"{path}: NOT FOUND"
    im = Image.open(path)
    return f"{path}: size={im.size}, mode={im.mode}, format={im.format}"

paths = [
    "main web products preview/1.jpg",
    "main web products preview/2.png",
    "main web products preview/3.png",
    "main web products preview/4.png",
    "main web products preview/5.png",
    "assets/img/hero-slides/1.jpg",
    "assets/img/hero-slides/1.png",
    "assets/img/hero-slides/2.png",
    "assets/img/hero-slides/3.png",
    "assets/img/hero-slides/4.png",
    "assets/img/hero-slides/5.png",
    "catalogue/why choose.png",
    "assets/img/why-choose-us.png",
    "assets/img/why-choose.png",
    "assets/img/logo.png"
]

for p in paths:
    print(analyze_image(p))
