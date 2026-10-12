import os
from PIL import Image

cat = 'baby-warmer'
dir_path = os.path.join('catalogue', cat)

crops = {
    'Screenshot 2026-10-12 122228.png': 'dr-smith-infant-radiant-warmer-regular.png',
    'Screenshot 2026-10-12 122239.png': 'dr-smith-infant-radiant-warmer-deluxe.png',
    'Screenshot 2026-10-12 122331.png': 'dr-smith-infant-radiant-warmer-super-deluxe.png',
    'Screenshot 2026-10-12 122249.png': 'dr-smith-double-surface-led-phototherapy-pink.png',
    'Screenshot 2026-10-12 122301.png': 'dr-smith-single-surface-led-phototherapy-blue.png',
    'Screenshot 2026-10-12 122155.png': 'dr-smith-double-surface-led-phototherapy-blue.png',
    'Screenshot 2026-10-12 122418.png': 'dr-smith-mobile-stand-led-phototherapy-unit.png',
    'Screenshot 2026-10-12 122146.png': 'dr-smith-led-phototherapy-over-crib-stand.png',
    'Screenshot 2026-10-12 122409.png': 'dr-smith-ge-giraffe-neonatal-incubator.png',
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

# Replace Card 1 (Regular)
html = html.replace('src="baby-warmer-regular.png"', 'src="dr-smith-infant-radiant-warmer-regular.png"')

# Replace Card 2 (Deluxe)
html = html.replace('src="baby-warmer-deluxe.png"', 'src="dr-smith-infant-radiant-warmer-deluxe.png"')

# Replace Card 3 (Super Deluxe)
html = html.replace('src="baby-warmer-super-deluxe.png"', 'src="dr-smith-infant-radiant-warmer-super-deluxe.png"')

# Replace Card 7 (Incubator) with GE Giraffe
html = html.replace('src="baby-incubator.png"', 'src="dr-smith-ge-giraffe-neonatal-incubator.png"')

# Update count from 7 to 13
html = html.replace('Showing <strong>7</strong> products', 'Showing <strong>13</strong> products')

# New product cards
new_cards = '''                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith double surface led phototherapy unit jaundice pink" data-badge="double surface led">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Double Surface LED Phototherapy Unit on Instagram" title="View on Instagram">
                                    <img src="dr-smith-double-surface-led-phototherapy-pink.png" alt="Double Surface LED Phototherapy Unit" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Double Surface LED &bull; Intensive</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Neonatal Hyperbilirubinemia</span>
                                <h3>Double Surface LED Phototherapy Unit</h3>
                                <p>High-intensity dual overhead and undersurface blue LED phototherapy system providing complete 360-degree cutaneous exposure for severe neonatal jaundice.</p>
                                <ul class="catalogue-card__details">
                                <li>Narrow-spectrum blue LEDs (450 - 470 nm) matching peak bilirubin absorption</li>
                                <li>Transparent acrylic infant bed allowing unhindered bottom phototherapy penetration</li>
                                <li>Height-adjustable overhead canopy with treatment timer and total hour meter</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Double%20Surface%20LED%20Phototherapy%20Unit">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith single surface led phototherapy unit with bassinet" data-badge="single surface led">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Single Surface LED Phototherapy Unit on Instagram" title="View on Instagram">
                                    <img src="dr-smith-single-surface-led-phototherapy-blue.png" alt="Single Surface LED Phototherapy Unit" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Single Surface LED &bull; Blue</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">NICU Phototherapy</span>
                                <h3>Single Surface LED Phototherapy Unit</h3>
                                <p>Overhead high-irradiance blue LED phototherapy lamp mounted on integrated baby crib frame with drop-down transparent acrylic side panels.</p>
                                <ul class="catalogue-card__details">
                                <li>High irradiance > 35 &mu;W/cm²/nm for rapid serum bilirubin reduction</li>
                                <li>Tilting lamp head and height adjustment for optimal distance regulation</li>
                                <li>Mobile anti-rust tubular base with 4 antistatic lockable swivel castors</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Single%20Surface%20LED%20Phototherapy%20Unit">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith mobile stand led phototherapy unit digital console" data-badge="mobile stand led">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith Mobile Stand LED Phototherapy Unit on Instagram" title="View on Instagram">
                                    <img src="dr-smith-mobile-stand-led-phototherapy-unit.png" alt="Dr. Smith Mobile Stand LED Phototherapy Unit" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Mobile Stand LED &bull; Dr. Smith</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Portable NICU Phototherapy</span>
                                <h3>Dr. Smith Mobile Stand LED Phototherapy Unit</h3>
                                <p>Authentic Dr. Smith freestanding mobile phototherapy lamp featuring digital timer display, molded polymer mobile base, and variable height spring lock.</p>
                                <ul class="catalogue-card__details">
                                <li>Authentic Dr. Smith embossed molded base with smooth glide castors</li>
                                <li>Top LCD control console displaying treatment timer and LED running hours</li>
                                <li>Compatible with all neonatal bassinets, radiant warmers, and incubators</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20Mobile%20Stand%20LED%20Phototherapy%20Unit">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith led phototherapy over-crib stand multi-led array" data-badge="over-crib led">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View LED Phototherapy Over-Crib Stand on Instagram" title="View on Instagram">
                                    <img src="dr-smith-led-phototherapy-over-crib-stand.png" alt="LED Phototherapy Over-Crib Stand" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Over-Crib LED &bull; Multi-Array</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">NICU Ward Equipment</span>
                                <h3>LED Phototherapy Over-Crib Mobile Stand</h3>
                                <p>Wide multi-LED array phototherapy head with dual handles, side LCD status screen, ergonomic push ring, and low-profile caster base.</p>
                                <ul class="catalogue-card__details">
                                <li>24 high-intensity medical blue LEDs with zero UV/IR radiation emissions</li>
                                <li>Dual ergonomic positioning side handles for precise angle alignment</li>
                                <li>Low-clearance 5-star mobile base rolling smoothly under standard warmers</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=LED%20Phototherapy%20Over-Crib%20Mobile%20Stand">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith double surface led phototherapy unit blue frame" data-badge="double surface blue">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Double Surface LED Phototherapy Blue Frame on Instagram" title="View on Instagram">
                                    <img src="dr-smith-double-surface-led-phototherapy-blue.png" alt="Double Surface LED Phototherapy Blue Frame" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Double Surface Blue &bull; Intensive</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Neonatal Intensive Care</span>
                                <h3>Double Surface Phototherapy Unit (Blue Edition)</h3>
                                <p>Heavy-duty tubular blue frame dual phototherapy system featuring simultaneous top and bottom blue light panels and lockable drop-side crib.</p>
                                <ul class="catalogue-card__details">
                                <li>Simultaneous upper and lower exposure accelerating bilirubin clearance</li>
                                <li>Fold-down clear acrylic walls for easy clinical intervention and feeding</li>
                                <li>Four heavy-duty swivel wheels with individual step locks</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Double%20Surface%20Phototherapy%20Unit%20%28Blue%20Edition%29">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="ge giraffe neonatal infant incubator certified pre-owned" data-badge="ge giraffe nicu">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View GE Giraffe Neonatal Incubator on Instagram" title="View on Instagram">
                                    <img src="dr-smith-ge-giraffe-neonatal-incubator.png" alt="GE Giraffe Neonatal Incubator" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">GE Giraffe &bull; Certified Pre-Owned</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Advanced Neonatal Care</span>
                                <h3>GE Giraffe Neonatal ICU Incubator</h3>
                                <p>World-renowned developmental neonatal microenvironment featuring rotating 360-degree mattress, active double-wall humidity control, and motorized height elevation.</p>
                                <ul class="catalogue-card__details">
                                <li>Patented Baby Susan rotating mattress reducing stress and touch disruption</li>
                                <li>Bi-directional airflow maintaining thermal stability even with doors open</li>
                                <li>Full color user interface tracking trends, alarms, and patient weight</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=GE%20Giraffe%20Neonatal%20ICU%20Incubator">Enquire about this product <i class="bi bi-arrow-right"></i></a>
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

print("Updated baby-warmer/index.html successfully!")
