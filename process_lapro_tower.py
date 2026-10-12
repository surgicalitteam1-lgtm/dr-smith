import os
from PIL import Image

cat = 'lapro-tower-equipment'
dir_path = os.path.join('catalogue', cat)

crops = {
    'Screenshot 2026-10-12 125125.png': 'dr-smith-full-hd-laparoscopy-tower-system.png',
    'Screenshot 2026-10-12 125134.png': 'dr-smith-endoscopy-camera-insufflator-tower.png',
    'Screenshot 2026-10-12 125143.png': 'dr-smith-rigid-laparoscope-telescope-case.png',
    'Screenshot 2026-10-12 125206.png': 'dr-smith-led-cold-light-source-9001.png',
    'Screenshot 2026-10-12 125215.png': 'dr-smith-cold-led-light-source-6000.png',
    'Screenshot 2026-10-12 125234.png': 'dr-smith-modular-endoscopy-tower-trolley.png',
    'Screenshot 2026-10-12 125252.png': 'dr-smith-4-tier-laparoscopy-electrosurgery-tower.png',
    'Screenshot 2026-10-12 125302.png': 'dr-smith-all-in-one-portable-endoscopy-camera.png',
    'Screenshot 2026-10-12 125314.png': 'dr-smith-rigid-arthroscope-hysteroscope-telescope.png',
    'Screenshot 2026-10-12 125324.png': 'dr-smith-blue-accent-endoscopy-tower-workstation.png',
    'Screenshot 2026-10-12 125351.png': 'dr-smith-stainless-steel-laparoscopy-tower-trolley.png',
    'Screenshot 2026-10-12 125400.png': 'dr-smith-co2-30l-advance-insufflator.png'
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

# Replace Card 2 (HD Camera Unit) with real showroom tower
html = html.replace('src="endoscopy-camera-unit.png"', 'src="dr-smith-full-hd-laparoscopy-tower-system.png"')

# Update count from 4 to 12
html = html.replace('Showing <strong>4</strong> products', 'Showing <strong>12</strong> products')

new_cards = '''                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith all-in-one portable endoscopy camera system" data-badge="all-in-one portable">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith All-in-One Portable Endoscopy System on Instagram" title="View on Instagram">
                                    <img src="dr-smith-all-in-one-portable-endoscopy-camera.png" alt="Dr. Smith All-in-One Portable Endoscopy System" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">All-in-One Portable &bull; Touchscreen</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Minimally Invasive Diagnostics</span>
                                <h3>Dr. Smith All-in-One Endoscopy System</h3>
                                <p>Integrated diagnostic video workstation combining a full-HD medical touchscreen monitor, embedded LED cold light source, camera processor, and digital recording module in one portable unit.</p>
                                <ul class="catalogue-card__details">
                                <li>High-definition 15.6" capacitive touchscreen with real-time video playback</li>
                                <li>Integrated high-power LED light socket compatible with standard light guides</li>
                                <li>Dual USB ports for one-touch video recording and snapshot capture</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20All-in-One%20Endoscopy%20System">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith led cold light source 9001 fiberoptic" data-badge="led cold light 9001">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith LED Cold Light Source 9001 on Instagram" title="View on Instagram">
                                    <img src="dr-smith-led-cold-light-source-9001.png" alt="Dr. Smith LED Cold Light Source 9001" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">LED Cold Light &bull; Model 9001</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Endoscopic Illumination</span>
                                <h3>Dr. Smith LED Cold Light Source 9001</h3>
                                <p>Authentic Dr. Smith high-output medical surgical LED cold illuminator featuring digital intensity display, universal fiber-optic turret, and silent smart cooling fans.</p>
                                <ul class="catalogue-card__details">
                                <li>Long-life 100W surgical LED lamp (>60,000 hours continuous service life)</li>
                                <li>Microprocessor stepless brightness regulation with intuitive up/down touch controls</li>
                                <li>Universal optical connector supporting Storz, Wolf, Olympus, and ACMI light cables</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20LED%20Cold%20Light%20Source%209001">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith cold led light source 6000 digital intensity" data-badge="cold led 6000">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith Cold LED Light Source 6000 on Instagram" title="View on Instagram">
                                    <img src="dr-smith-cold-led-light-source-6000.png" alt="Dr. Smith Cold LED Light Source 6000" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Cold LED &bull; Series 6000</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Laparoscopic Illumination</span>
                                <h3>Dr. Smith Cold LED Light Source 6000</h3>
                                <p>High-efficiency surgical light generator with bright digital LCD menu, instant standby switch, and balanced daylight color temperature matching natural tissue hues.</p>
                                <ul class="catalogue-card__details">
                                <li>Daylight color temperature (5700K - 6500K) for faithful clinical tissue reproduction</li>
                                <li>Multi-function graphic LCD display indicating brightness percentage and lamp hours</li>
                                <li>Low-noise thermal heat dissipation system preventing operating theater warming</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20Cold%20LED%20Light%20Source%206000">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="co2 30l advance digital electronic insufflator" data-badge="co2 30l advance">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View CO2 30L Advance Digital Electronic Insufflator on Instagram" title="View on Instagram">
                                    <img src="dr-smith-co2-30l-advance-insufflator.png" alt="CO2 30L Advance Digital Electronic Insufflator" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">CO2 30L Advance &bull; High Flow</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Laparoscopic Insufflation</span>
                                <h3>CO2 30L Advance Digital Insufflator</h3>
                                <p>Automated high-flow laparoscopic CO2 gas insufflator with digital actual and set pressure readouts, gas volume totalizer, and multi-stage overpressure safety release.</p>
                                <ul class="catalogue-card__details">
                                <li>Flow rate capacity up to 30 Litres/min with instant abdominal cavity compensation</li>
                                <li>Dual digital LED displays tracking actual vs preset intra-abdominal pressure (mmHg)</li>
                                <li>Integrated gas heater reducing patient hypothermia and scope fogging</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=CO2%2030L%20Advance%20Digital%20Insufflator">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith rigid laparoscope telescope 0 30 degree" data-badge="hopkins rod telescope">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith Rigid Laparoscope Telescope on Instagram" title="View on Instagram">
                                    <img src="dr-smith-rigid-laparoscope-telescope-case.png" alt="Dr. Smith Rigid Laparoscope Telescope" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Hopkins Rod Telescope &bull; 10mm</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Optical Endoscopy</span>
                                <h3>Dr. Smith Rigid Laparoscope Telescope (0&deg; / 30&deg;)</h3>
                                <p>Precision German rod lens system offering crystal-clear edge-to-edge optical resolution, scratch-resistant sapphire front window, and full autoclave compatibility.</p>
                                <ul class="catalogue-card__details">
                                <li>Outer diameter: 10mm / 5mm with working length 300mm - 330mm</li>
                                <li>Multi-coated antireflective optical glass elements maximizing light transmission</li>
                                <li>Padded sterilization safety container protecting delicate optical components</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20Rigid%20Laparoscope%20Telescope">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith rigid arthroscope hysteroscope telescope 4mm" data-badge="rigid scope 4mm">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith Rigid Arthroscope Hysteroscope Telescope on Instagram" title="View on Instagram">
                                    <img src="dr-smith-rigid-arthroscope-hysteroscope-telescope.png" alt="Dr. Smith Rigid Arthroscope Hysteroscope Telescope" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Rigid Scope &bull; 4mm / 2.9mm</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Endoscopic Optics</span>
                                <h3>Dr. Smith Arthroscope / Hysteroscope Telescope</h3>
                                <p>High-resolution slim diameter rigid optical telescope engineered for arthroscopy, hysteroscopy, and cystoscopy procedures with wide field-of-view.</p>
                                <ul class="catalogue-card__details">
                                <li>Diameter: 4.0mm / 2.9mm options with 0°, 30°, and 70° direction of view</li>
                                <li>Laser-welded stainless steel seamless sheath resistant to repeated autoclaving</li>
                                <li>Compatible with all major endocouplers and camera heads</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20Arthroscope%20Hysteroscope%20Telescope">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith modular endoscopy tower trolley cart" data-badge="modular tower cart">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith Modular Endoscopy Tower Trolley on Instagram" title="View on Instagram">
                                    <img src="dr-smith-modular-endoscopy-tower-trolley.png" alt="Dr. Smith Modular Endoscopy Tower Trolley" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Modular Tower Cart &bull; 4-Shelf</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Theatre Logistics</span>
                                <h3>Dr. Smith Modular Endoscopy Tower Trolley</h3>
                                <p>Sturdy multi-tier hospital endoscopy workstation trolley with 4 height-adjustable equipment shelves, lockable storage drawer, push handles, and rear cable duct.</p>
                                <ul class="catalogue-card__details">
                                <li>Integrated side cage holder for high-pressure medical CO2 gas cylinders</li>
                                <li>Rear cable management trunking and integrated multi-outlet power strip</li>
                                <li>Four antistatic heavy-duty swivel castors with diagonal wheel brakes</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20Modular%20Endoscopy%20Tower%20Trolley">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith stainless steel laparoscopy tower trolley ss 304" data-badge="ss 304 tower trolley">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith SS Laparoscopy Tower Trolley on Instagram" title="View on Instagram">
                                    <img src="dr-smith-stainless-steel-laparoscopy-tower-trolley.png" alt="Dr. Smith Stainless Steel Laparoscopy Tower Trolley" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">SS 304 &bull; Endoscopy Cart</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Operating Theatre Furniture</span>
                                <h3>Dr. Smith Stainless Steel Endoscopy Trolley</h3>
                                <p>All-stainless-steel 4-shelf endoscopic workstation cart fabricated from premium non-corrosive SS 304 for maximum sterility, wash-down durability, and OT stability.</p>
                                <ul class="catalogue-card__details">
                                <li>Four deep stainless steel shelves with safety retaining guard rails</li>
                                <li>Lockable pull-out instrument drawer and bilateral tubular push handles</li>
                                <li>Hospital-grade non-marking caster wheels with twin foot brake pedals</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20Stainless%20Steel%20Endoscopy%20Trolley">Enquire about this product <i class="bi bi-arrow-right"></i></a>
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

print("Updated lapro-tower-equipment/index.html successfully!")
