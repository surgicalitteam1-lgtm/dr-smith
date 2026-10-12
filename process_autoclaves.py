import os
from PIL import Image

cat = 'autoclaves'
dir_path = os.path.join('catalogue', cat)

crops = {
    '723947790_18013851956907275_6557483426414482029_n..png': 'dr-smith-vertical-autoclave-knob-locking-16x24.png',
    'Screenshot 2026-10-12 121807.png': 'dr-smith-horizontal-cylindrical-autoclave-digital.png',
    'Screenshot 2026-10-12 121820.png': 'dr-smith-horizontal-autoclave-cabinet-enclosure.png'
}

for src, dst in crops.items():
    src_p = os.path.join(dir_path, src)
    dst_p = os.path.join(dir_path, dst)
    if os.path.exists(src_p):
        im = Image.open(src_p)
        w, h = im.size
        # For the instagram reel snapshot 723947790, crop top and bottom cleanly
        if '723947790' in src:
            # Crop 80px from bottom (removes reel UI/text bar) and 80px from top
            cropped = im.crop((0, 80, w, h - 80))
        else:
            cropped = im.crop((0, 0, w, h - 40))
        cropped.save(dst_p, 'PNG', optimize=True)
        print(f"Saved {dst}: {cropped.size}")

# Now let's update index.html to include these real Dr. Smith showroom models
index_p = os.path.join(dir_path, 'index.html')
with open(index_p, 'r', encoding='utf-8') as f:
    html = f.read()

# Update count from 9 to 11 products
html = html.replace('Showing <strong>9</strong> products', 'Showing <strong>11</strong> products')

# Card for dr-smith-vertical-autoclave-knob-locking-16x24.png
# We can replace or add before/after vertical autoclave
# Let's see if we add 2 extra cards at the end of products-grid
extra_cards = '''                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith vertical autoclave 16x24 knob locking" data-badge="dr. smith showroom">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith Vertical Autoclave 16x24 Knob Locking on Instagram" title="View on Instagram">
                                    <img src="dr-smith-vertical-autoclave-knob-locking-16x24.png" alt="Dr. Smith Vertical Autoclave 16x24 Knob Locking" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Dr. Smith Showroom &bull; 16"x24"</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Sterilization & CSSD</span>
                                <h3>Dr. Smith Vertical Autoclave 16"x24" (Knob Locking)</h3>
                                <p>Authentic Dr. Smith heavy-duty vertical floor autoclave with stainless steel mirror-finish body, dual knob locking clamps, immersion heating box and top pressure gauge.</p>
                                <ul class="catalogue-card__details">
                                <li>Chamber dimensions: 16" diameter x 24" depth (approx. 75-80 Litres capacity)</li>
                                <li>Heavy-duty tripod support legs with stable anti-vibration rubber feet</li>
                                <li>Analog dial pressure gauge, steam release stopcock, and safety blow-off valve</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20Vertical%20Autoclave%2016x24%20Knob%20Locking">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith horizontal cylindrical autoclave digital console" data-badge="digital cssd flagship">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith Horizontal Cylindrical Autoclave Digital on Instagram" title="View on Instagram">
                                    <img src="dr-smith-horizontal-cylindrical-autoclave-digital.png" alt="Dr. Smith Horizontal Cylindrical Autoclave Digital Console" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Digital CSSD Flagship</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Hospital CSSD Engineering</span>
                                <h3>Dr. Smith Horizontal Cylindrical Autoclave (Digital Console)</h3>
                                <p>High-capacity hospital CSSD high-pressure horizontal sterilizer featuring dual pressure dials, single-lever radial wheel locking door, side-mounted digital microprocessor controller, and lower steam boiler.</p>
                                <ul class="catalogue-card__details">
                                <li>Microprocessor digital temperature and sterilization cycle timer console</li>
                                <li>Twin calibrated dial gauges monitoring chamber and boiler jacket pressures</li>
                                <li>Full AISI 304/316 grade stainless steel tubular frame and pressure vessel</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20Horizontal%20Cylindrical%20Autoclave%20Digital">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
'''

# Update card 8 to use dr-smith-horizontal-autoclave-cabinet-enclosure.png
html = html.replace('src="ss-horizontal-autoclave.png"', 'src="dr-smith-horizontal-autoclave-cabinet-enclosure.png"')

# Insert extra cards before the closing </div> of products-grid
# products-grid ends before </section>
grid_end = html.rfind('</div>\n\n            </div>\n        </section>')
if grid_end != -1:
    html = html[:grid_end] + extra_cards + html[grid_end:]
else:
    # alternate search
    target_str = '</div>\n            </div>\n        </section>'
    pos = html.rfind(target_str)
    if pos != -1:
        html = html[:pos] + extra_cards + html[pos:]

with open(index_p, 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated autoclaves/index.html successfully!")
