import os
from PIL import Image

cat = 'office-furniture'
dir_path = os.path.join('catalogue', cat)

crops = {
    'Screenshot 2026-10-12 125603.png': 'dr-smith-executive-quilted-chair-beige.png',
    'Screenshot 2026-10-12 125612.png': 'dr-smith-hospital-4-drawer-filing-cabinet.png',
    'Screenshot 2026-10-12 125627.png': 'dr-smith-hospital-open-rack-ms-white.png',
    'Screenshot 2026-10-12 125634.png': 'dr-smith-revolving-stool-cushion-backrest-white.png',
    'Screenshot 2026-10-12 125640.png': 'dr-smith-breathable-mesh-office-chair-black.png',
    'Screenshot 2026-10-12 125646.png': 'dr-smith-high-drafting-lab-stool-foot-ring.png',
    'Screenshot 2026-10-12 125653.png': 'dr-smith-stainless-steel-4-tier-storage-rack.png',
    'Screenshot 2026-10-12 125659.png': 'dr-smith-executive-quilted-chair-tan-brown.png'
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

# Replace card 11 mesh chair with real showroom photo
html = html.replace('src="office-chair-mesh-mid.png"', 'src="dr-smith-breathable-mesh-office-chair-black.png"')

# Update count from 14 to 21
html = html.replace('Showing <strong>14</strong> products', 'Showing <strong>21</strong> products')

# New product cards
new_cards = '''                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith executive quilted chair beige swivel flip-arm" data-badge="quilted leatherette">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith Executive Quilted Chair Beige on Instagram" title="View on Instagram">
                                    <img src="dr-smith-executive-quilted-chair-beige.png" alt="Dr. Smith Executive Quilted Chair Beige" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Quilted Leatherette &bull; Beige</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Doctor Cabin Seating</span>
                                <h3>Dr. Smith Executive Quilted Chair (Beige)</h3>
                                <p>Luxury consultant swivel armchair upholstered in elegant beige box-quilted leatherette, featuring flip-up padded armrests and chrome 5-star base.</p>
                                <ul class="catalogue-card__details">
                                <li>90-degree flip-up padded armrests for convenient under-desk tucking</li>
                                <li>Pneumatic gas spring height regulation with tilt tension knob</li>
                                <li>Mirror chrome plated 5-star base with dual-wheel nylon castors</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20Executive%20Quilted%20Chair%20Beige">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith executive quilted chair tan brown swivel flip-arm" data-badge="quilted leatherette">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith Executive Quilted Chair Tan Brown on Instagram" title="View on Instagram">
                                    <img src="dr-smith-executive-quilted-chair-tan-brown.png" alt="Dr. Smith Executive Quilted Chair Tan Brown" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Quilted Leatherette &bull; Tan Brown</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Director Suite Seating</span>
                                <h3>Dr. Smith Executive Quilted Chair (Tan Brown)</h3>
                                <p>Distinguished executive cabin armchair finished in premium tan brown quilted leatherette with padded swing armrests and tilt-lock recline.</p>
                                <ul class="catalogue-card__details">
                                <li>Ergonomic lumbar contouring with heavy-density foam padding</li>
                                <li>Flip-back armrests with soft padded contact rests</li>
                                <li>Polished chrome 50mm castor base with smooth 360-degree rotation</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20Executive%20Quilted%20Chair%20Tan%20Brown">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith hospital 4-drawer vertical filing cabinet steel" data-badge="4-drawer filing">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith Hospital 4-Drawer Vertical Filing Cabinet on Instagram" title="View on Instagram">
                                    <img src="dr-smith-hospital-4-drawer-filing-cabinet.png" alt="Dr. Smith Hospital 4-Drawer Vertical Filing Cabinet" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">4-Drawer Vertical Filing</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Medical Records Storage</span>
                                <h3>Dr. Smith Hospital 4-Drawer Filing Cabinet</h3>
                                <p>Heavy-duty cold rolled mild steel vertical filing cabinet designed for secure hospital patient records, case folders, and administrative paperwork.</p>
                                <ul class="catalogue-card__details">
                                <li>Central gang-locking mechanism securing all 4 drawers simultaneously</li>
                                <li>Smooth ball-bearing telescopic extension runners with anti-tilt lock</li>
                                <li>Integrated card holder label inserts and recessed flush pull handles</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20Hospital%204-Drawer%20Filing%20Cabinet">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith stainless steel 4-tier heavy duty storage rack" data-badge="ss 304 4-tier">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith SS 4-Tier Heavy-Duty Storage Rack on Instagram" title="View on Instagram">
                                    <img src="dr-smith-stainless-steel-4-tier-storage-rack.png" alt="Dr. Smith SS 4-Tier Heavy Duty Storage Rack" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">SS 304 &bull; 4-Tier Rack</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">CSSD & OT Storage</span>
                                <h3>Dr. Smith SS 4-Tier Heavy-Duty Storage Rack</h3>
                                <p>All-stainless-steel 4-shelf utility storage rack engineered for sterile OT zones, CSSD packs, hospital linen, and autoclave drum storage.</p>
                                <ul class="catalogue-card__details">
                                <li>Heavy-gauge AISI 304 grade non-corrosive stainless steel construction</li>
                                <li>Four reinforced flat shelves with edge foldings to prevent liquid spillage</li>
                                <li>Heavy-duty square tubular legs with anti-slip rubber leveler buffers</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20SS%204-Tier%20Heavy-Duty%20Storage%20Rack">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith 4-tier hospital open shelf bookcase rack ms" data-badge="4-tier utility shelf">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith 4-Tier Hospital Open Shelf Rack on Instagram" title="View on Instagram">
                                    <img src="dr-smith-hospital-open-rack-ms-white.png" alt="Dr. Smith 4-Tier Hospital Open Shelf Rack" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">4-Tier Utility Shelf</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Administrative Logistics</span>
                                <h3>Dr. Smith 4-Tier Open Storage Shelf Rack</h3>
                                <p>Multi-purpose powder-coated white steel 4-tier open storage bookcase and shoe/slipper rack for hospital departments, labs, and staff change rooms.</p>
                                <ul class="catalogue-card__details">
                                <li>Epoxy powder-coated anti-microbial clean white finish</li>
                                <li>Four open deep shelves offering rapid visual access and retrieval</li>
                                <li>Solid boxed mild steel frame with floor protective leveling bushes</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%204-Tier%20Open%20Storage%20Shelf%20Rack">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith high drafting laboratory stool foot ring" data-badge="high drafting stool">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith High-Drafting Laboratory Stool on Instagram" title="View on Instagram">
                                    <img src="dr-smith-high-drafting-lab-stool-foot-ring.png" alt="Dr. Smith High Drafting Laboratory Stool" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">High-Drafting Lab Stool</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Pathology & Lab Seating</span>
                                <h3>Dr. Smith High-Drafting Lab Stool with Foot Ring</h3>
                                <p>Extended-height clinical laboratory stool featuring circular chrome footrest ring, contoured backrest, and round cushioned black leatherette seat.</p>
                                <ul class="catalogue-card__details">
                                <li>Height-adjustable chrome foot ring providing ergonomic leg support</li>
                                <li>Extended range pneumatic gas lift for high counter workbenches</li>
                                <li>Thick high-density polyurethane seat cushion resistant to chemical spills</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20High-Drafting%20Lab%20Stool%20with%20Foot%20Ring">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith revolving examination stool backrest white" data-badge="cushion stool with back">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith Revolving Examination Stool on Instagram" title="View on Instagram">
                                    <img src="dr-smith-revolving-stool-cushion-backrest-white.png" alt="Dr. Smith Revolving Examination Stool White" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Cushion Stool with Back</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Clinical Examination Seating</span>
                                <h3>Dr. Smith Revolving Examination Stool (White)</h3>
                                <p>Clinical doctor examination stool featuring hygienic white seamless upholstery, ergonomic backrest, pneumatic height lever, and chrome 5-star base.</p>
                                <ul class="catalogue-card__details">
                                <li>Seamless medical-grade white leatherette easy to sterilize</li>
                                <li>Contoured lumbar supporting backrest reducing back fatigue</li>
                                <li>Pneumatic gas cylinder height adjustment with 360-degree swivel</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20Revolving%20Examination%20Stool%20%28White%29">Enquire about this product <i class="bi bi-arrow-right"></i></a>
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

print("Updated office-furniture/index.html successfully!")
