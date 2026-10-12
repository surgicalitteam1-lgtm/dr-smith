import os
from PIL import Image

cat = 'anesthesia-workstation'
dir_path = os.path.join('catalogue', cat)

crops = {
    '1.png': 'dr-smith-anesthesia-trolley-minor-ss.png',
    '2.png': 'dr-smith-anesthesia-trolley-major-ss.png',
    '3.png': 'dr-smith-anesthesia-workstation-prestige-plus.png',
    'Screenshot 2026-10-12 121438.png': 'dr-smith-anesthesia-machine-minor-ms-real.png',
    'Screenshot 2026-10-12 121500.png': 'dr-smith-anesthesia-workstation-prestige-deluxe.png',
    'Screenshot 2026-10-12 121520.png': 'dr-smith-anesthesia-workstation-ventilator-integrated.png',
    'Screenshot 2026-10-12 121538.png': 'dr-smith-anesthesia-workstation-digital-display.png',
    'Screenshot 2026-10-12 121558.png': 'dr-smith-datex-ohmeda-anesthesia-workstation.png',
    'Screenshot 2026-10-12 121619.png': 'dr-smith-bpl-penlon-flo6-anesthesia-workstation.png',
    'Screenshot 2026-10-11 124201.png': 'dr-smith-circle-absorber-system.png'
}

for src, dst in crops.items():
    src_p = os.path.join(dir_path, src)
    dst_p = os.path.join(dir_path, dst)
    if os.path.exists(src_p):
        im = Image.open(src_p)
        w, h = im.size
        crop_h = 40 if h > 100 else 0
        cropped = im.crop((0, 0, w, h - crop_h))
        cropped.save(dst_p, 'PNG', optimize=True)
        print(f"Saved {dst}: {cropped.size}")

# Update index.html
index_p = os.path.join(dir_path, 'index.html')
with open(index_p, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace Screenshot 2026-10-11 124201.png with dr-smith-circle-absorber-system.png
html = html.replace('Screenshot 2026-10-11 124201.png', 'dr-smith-circle-absorber-system.png')

# Update Card 1 (Prestige-I) to use dr-smith-anesthesia-workstation-prestige-plus.png
html = html.replace('src="anesthesia-workstation-prestige-1.png"', 'src="dr-smith-anesthesia-workstation-prestige-plus.png"')

# Update Card 3 (Pre-owned) to use dr-smith-datex-ohmeda-anesthesia-workstation.png
html = html.replace('src="anesthesia-workstation-preowned.png"', 'src="dr-smith-datex-ohmeda-anesthesia-workstation.png"')

# Update Card 8 (Minor MS) to use dr-smith-anesthesia-machine-minor-ms-real.png
html = html.replace('src="anesthesia-machine-minor-ms.png"', 'src="dr-smith-anesthesia-machine-minor-ms-real.png"')

# Update Card 10 (Minor SS) to use dr-smith-anesthesia-trolley-minor-ss.png
html = html.replace('src="anesthesia-machine-minor-ss.png"', 'src="dr-smith-anesthesia-trolley-minor-ss.png"')

# Update Card 11 (Major SS) to use dr-smith-anesthesia-trolley-major-ss.png
html = html.replace('src="anesthesia-machine-major-ss.png"', 'src="dr-smith-anesthesia-trolley-major-ss.png"')

# Update count from 12 to 15
html = html.replace('Showing <strong>12</strong> products', 'Showing <strong>15</strong> products')

# Add 3 new high-tech cards:
# 1. dr-smith-bpl-penlon-flo6-anesthesia-workstation.png
# 2. dr-smith-anesthesia-workstation-ventilator-integrated.png
# 3. dr-smith-anesthesia-workstation-prestige-deluxe.png

new_cards = '''                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="bpl penlon flo-6 anesthesia workstation ventilator" data-badge="bpl penlon flo-6">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View BPL Penlon Flo-6 Anesthesia Workstation on Instagram" title="View on Instagram">
                                    <img src="dr-smith-bpl-penlon-flo6-anesthesia-workstation.png" alt="BPL Penlon Flo-6 Anesthesia Workstation" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">BPL Penlon &bull; Flo-6</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Anesthesia & OT Platforms</span>
                                <h3>BPL Penlon Flo-6 Anesthesia Workstation</h3>
                                <p>Advanced multi-gas anesthesia workstation featuring integrated color ventilator display, twin pipeline pressure dials, precision flowmeters, and dual drawer base.</p>
                                <ul class="catalogue-card__details">
                                <li>Integrated high-performance ventilator with multi-mode volume and pressure support</li>
                                <li>Selectatec-compatible agent vaporizer interlock mounting system</li>
                                <li>Ergonomic writing surface, O2 flush control, and integrated circle absorber</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=BPL%20Penlon%20Flo-6%20Anesthesia%20Workstation">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith ventilator integrated anesthesia workstation" data-badge="touchscreen icu/ot">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith Ventilator Integrated Anesthesia Workstation on Instagram" title="View on Instagram">
                                    <img src="dr-smith-anesthesia-workstation-ventilator-integrated.png" alt="Dr. Smith Ventilator Integrated Anesthesia Workstation" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Touchscreen ICU/OT</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Dr. Smith Flagship</span>
                                <h3>Dr. Smith Integrated Ventilator Anesthesia Workstation</h3>
                                <p>Top-tier anesthesia delivery station with full color ventilator screen, 6-gauge pipeline monitoring array, ascending bellows, and dual deep equipment drawers.</p>
                                <ul class="catalogue-card__details">
                                <li>High-precision multi-parameter ventilator display tracking waveforms and loops</li>
                                <li>Hexagonal 6-gauge pressure monitoring console for O2, N2O, and medical air</li>
                                <li>Heavy-duty swivel castors with individual foot brake locks and antistatic wheels</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20Integrated%20Ventilator%20Anesthesia%20Workstation">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith prestige deluxe anesthesia station" data-badge="prestige deluxe">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith Prestige Deluxe Anesthesia Station on Instagram" title="View on Instagram">
                                    <img src="dr-smith-anesthesia-workstation-prestige-deluxe.png" alt="Dr. Smith Prestige Deluxe Anesthesia Station" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Prestige Deluxe &bull; 2-Drawer</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Anesthesia Delivery</span>
                                <h3>Dr. Smith Prestige Deluxe Anesthesia Station</h3>
                                <p>Comprehensive theatre anesthesia station with top digital monitor unit, multi-tube cascade rotameter block, and side-mounted dual canister circle absorber.</p>
                                <ul class="catalogue-card__details">
                                <li>Dual drawer lockable modular cabinet with auxiliary electrical power sockets</li>
                                <li>Cascade illuminated rotameter tubes with hypoxic guard safety mechanism</li>
                                <li>Integrated side mounting bracket for canister absorber and breathing circuit</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20Prestige%20Deluxe%20Anesthesia%20Station">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
'''

pos = html.rfind('</div>\n\n            </div>\n        </section>')
if pos != -1:
    html = html[:pos] + new_cards + html[pos:]
else:
    pos2 = html.rfind('</div>\n            </div>\n        </section>')
    if pos2 != -1:
        html = html[:pos2] + new_cards + html[pos2:]

with open(index_p, 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated anesthesia-workstation/index.html successfully!")
