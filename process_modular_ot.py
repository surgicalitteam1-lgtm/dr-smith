import os
from PIL import Image

cat = 'modular-ot'
dir_p = os.path.join('catalogue', cat)
src_p = os.path.join(dir_p, 'Screenshot 2026-10-12 125529.png')
dst_p = os.path.join(dir_p, 'dr-smith-hospital-bed-head-panel-units.png')

if os.path.exists(src_p):
    im = Image.open(src_p)
    w, h = im.size
    crop_h = 40 if h > 100 else 0
    cropped = im.crop((0, 0, w, h - crop_h))
    cropped.save(dst_p, 'PNG', optimize=True)
    print(f"Saved {dst_p}: {cropped.size}")

index_p = os.path.join(dir_p, 'index.html')
with open(index_p, 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('Showing <strong>24</strong> products', 'Showing <strong>25</strong> products')

new_card = '''                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith hospital bed head panel units mgps electrical" data-badge="bed head panel">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith Bed Head Panel Units on Instagram" title="View on Instagram">
                                    <img src="dr-smith-hospital-bed-head-panel-units.png" alt="Dr. Smith Hospital Bed Head Panel Units" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Bed Head Panel &bull; MGPS</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">ICU & Ward Infrastructure</span>
                                <h3>Dr. Smith Hospital Bed Head Panel Units</h3>
                                <p>Extruded aluminum architectural bed head trunking system integrating medical gas outlets (O2, N2O, Air, Vac), electrical power sockets, nurse call, and digital pressure alarm monitor.</p>
                                <ul class="catalogue-card__details">
                                <li>Multi-compartment segregation separating gas pipelines and electrical cabling</li>
                                <li>Available in decorative wooden texture, hospital blue, and cleanroom white trims</li>
                                <li>Pre-piped and pre-wired with DIN/BS standard gas terminal outlets and monitor brackets</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20Hospital%20Bed%20Head%20Panel%20Units">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
'''

pos = html.rfind('</div>\n\n            </div>\n        </section>')
if pos != -1:
    html = html[:pos] + new_card + html[pos:]
else:
    pos2 = html.rfind('</div>\n            </div>\n        </section>')
    if pos2 != -1:
        html = html[:pos2] + new_card + html[pos2:]

with open(index_p, 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated modular-ot/index.html successfully!")
