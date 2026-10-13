import os
from PIL import Image

ui = Image.open('C:/Users/SSTS/.gemini/antigravity/brain/36671754-e619-4678-aed6-622f1739b984/.user_uploaded/media_1791929021795_6951e92f.jpg')
w, h = ui.size

os.makedirs('assets/img/ui-design', exist_ok=True)

# 1. Hero background scene (the high-tech OT room on the right and ambient lighting)
# In the UI, the hero area is from y=0 to y=318
hero = ui.crop((0, 0, w, 320))
hero.save('assets/img/ui-design/hero_full.jpg', quality=95)

# Just the OT room portion (right half of hero)
ot_room = ui.crop((380, 48, w, 320))
ot_room.save('assets/img/ui-design/hero_ot_room.jpg', quality=95)

# 2. Category Cards
# In the UI, "Shop by Category" starts around y=320, cards are from y=348 to y=438
# There are 6 cards horizontally across w=1024
# Margins: left ~ 24, right ~ 1000. Total width ~ 976.
# Each card ~ 158px wide with gap ~ 6px
card_y1 = 345
card_y2 = 442
cards_coords = [
    (24, card_y1, 182, card_y2, "cat_1_monitoring.png"),
    (187, card_y1, 345, card_y2, "cat_2_ot_equipment.png"),
    (350, card_y1, 508, card_y2, "cat_3_infant_care.png"),
    (513, card_y1, 671, card_y2, "cat_4_diagnostics.png"),
    (676, card_y1, 834, card_y2, "cat_5_cssd.png"),
    (839, card_y1, 998, card_y2, "cat_6_furniture.png"),
]

for x1, y1, x2, y2, fname in cards_coords:
    c = ui.crop((x1, y1, x2, y2))
    c.save(f'assets/img/ui-design/{fname}', quality=95)

# 3. Why Choose Us Timeline / Infographic
# From y=445 to y=575
why_choose = ui.crop((0, 445, w, 575))
why_choose.save('assets/img/ui-design/why_choose_timeline.jpg', quality=95)

# Center "Why Choose Us" orb
orb = ui.crop((445, 455, 575, 570))
orb.save('assets/img/ui-design/why_choose_orb.png', quality=95)

print("Extracted UI components successfully into assets/img/ui-design/")
