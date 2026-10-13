import os
from PIL import Image

ui = Image.open('C:/Users/SSTS/.gemini/antigravity/brain/36671754-e619-4678-aed6-622f1739b984/.user_uploaded/media_1791929021795_6951e92f.jpg')
print("UI loaded:", ui.size)

# Let's crop the hero background (right half of hero: x from 400 to 1024, y from 60 to 300)
hero_crop = ui.crop((400, 60, 1024, 310))
hero_crop.save('scratch/hero_sample.jpg')

# Let's crop the 6 category cards:
# y is approx 335 to 445
cards_crop = ui.crop((20, 330, 1004, 450))
cards_crop.save('scratch/cards_sample.jpg')

# Let's crop the Why Choose Us infographic:
# y is approx 450 to 570
why_crop = ui.crop((20, 450, 1004, 570))
why_crop.save('scratch/why_sample.jpg')

# Let's crop the bottom categories banner:
# y is approx 640 to 723
cat_banner = ui.crop((0, 640, 1024, 723))
cat_banner.save('scratch/cat_banner_sample.jpg')

print("Cropped samples saved to scratch/")
