import os
from PIL import Image

cat = 'small-general-equipment'
dir_path = os.path.join('catalogue', cat)

crops = {
    'Screenshot 2026-10-12 130528.png': 'dr-smith-transcutaneous-bilirubinometer-dock.png',
    'Screenshot 2026-10-12 130533.png': 'dr-smith-digital-blood-pressure-monitor-acmnp1.png',
    'Screenshot 2026-10-12 130538.png': 'dr-smith-needle-syringe-destroyer-electrical.png',
    'Screenshot 2026-10-12 130544.png': 'dr-smith-macintosh-laryngoscope-set-4-blades.png',
    'Screenshot 2026-10-12 130549.png': 'dr-smith-compressor-nebulizer-machine.png',
    'Screenshot 2026-10-12 130555.png': 'dr-smith-contec-sp80b-digital-spirometer.png',
    'Screenshot 2026-10-12 130600.png': 'dr-smith-digital-clinical-thermometer.png'
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

# Replace Card 6 bilirubinometer image with real Dr. Smith docked model
html = html.replace('src="bilirubinometer.png"', 'src="dr-smith-transcutaneous-bilirubinometer-dock.png"')

# Update count from 8 to 14
html = html.replace('Showing <strong>8</strong> products', 'Showing <strong>14</strong> products')

# New product cards
new_cards = '''                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith digital automatic blood pressure monitor acmnp-1" data-badge="digital nibp">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Digital Automatic Blood Pressure Monitor on Instagram" title="View on Instagram">
                                    <img src="dr-smith-digital-blood-pressure-monitor-acmnp1.png" alt="Dr. Smith Digital Automatic Blood Pressure Monitor" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Digital NIBP &bull; ACMNP-1</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Diagnostic Screening</span>
                                <h3>Digital Automatic Blood Pressure Monitor</h3>
                                <p>Microprocessor-controlled digital oscillometric blood pressure monitor with wide-range adult arm cuff, one-touch inflation, and color WHO hypertension indicator.</p>
                                <ul class="catalogue-card__details">
                                <li>High-contrast LCD digital screen displaying systolic, diastolic, and pulse rate</li>
                                <li>WHO color-coded hypertension risk scale for immediate risk triage</li>
                                <li>Memory recall for 2 x 99 clinical measurement readings with date and timestamp</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Digital%20Automatic%20Blood%20Pressure%20Monitor">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith electrical needle syringe destroyer" data-badge="biohazard safety">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith Electrical Needle Syringe Destroyer on Instagram" title="View on Instagram">
                                    <img src="dr-smith-needle-syringe-destroyer-electrical.png" alt="Dr. Smith Electrical Needle Syringe Destroyer" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Biohazard Safety &bull; Dr. Smith</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Biomedical Waste Safety</span>
                                <h3>Dr. Smith Electrical Needle &amp; Syringe Destroyer</h3>
                                <p>Authentic Dr. Smith heavy-duty tabletop electric needle burner and mechanical syringe hub cutter engineered to prevent accidental needle-stick injuries and reuse.</p>
                                <ul class="catalogue-card__details">
                                <li>Instant electric thermal arc incinerates needles up to 18G within seconds</li>
                                <li>High-grade alloy cutting blade shears syringe nozzles cleanly</li>
                                <li>Removable drawer tray collecting sterilized metal ash safely</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20Electrical%20Needle%20Syringe%20Destroyer">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith macintosh laryngoscope set 4 blades" data-badge="airway management">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith Macintosh Laryngoscope Set on Instagram" title="View on Instagram">
                                    <img src="dr-smith-macintosh-laryngoscope-set-4-blades.png" alt="Dr. Smith Macintosh Laryngoscope Set" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Airway Management &bull; 4-Blade</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Anesthesia & Resuscitation</span>
                                <h3>Dr. Smith Macintosh Laryngoscope Set (4 Blades)</h3>
                                <p>Surgical-grade stainless steel laryngoscope set complete with diamond knurled anti-slip handle and 4 curved Macintosh blades for pediatric to adult endotracheal intubation.</p>
                                <ul class="catalogue-card__details">
                                <li>Includes 4 interchangeable curved Macintosh blades (Sizes 1, 2, 3, 4)</li>
                                <li>High-luminosity halogen / LED cool light illumination avoiding tissue burns</li>
                                <li>Autoclavable stainless steel construction tested up to 134°C sterilization</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20Macintosh%20Laryngoscope%20Set%204%20Blades">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith compressor nebulizer machine aerosol therapy" data-badge="respiratory therapy">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith Compressor Nebulizer Machine on Instagram" title="View on Instagram">
                                    <img src="dr-smith-compressor-nebulizer-machine.png" alt="Dr. Smith Compressor Nebulizer Machine" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Respiratory Therapy &bull; Dr. Smith</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Pulmonary Drug Delivery</span>
                                <h3>Dr. Smith Compressor Nebulizer Machine</h3>
                                <p>Authentic Dr. Smith high-efficiency piston-pump compressor nebulizer converting liquid medication into ultra-fine breathable aerosol particles for asthma and COPD care.</p>
                                <ul class="catalogue-card__details">
                                <li>Mass Median Aerodynamic Diameter (MMAD) &lt; 3.0 &mu;m for deep lung penetration</li>
                                <li>Powerful oil-free heavy-duty piston motor designed for continuous hospital ward duty</li>
                                <li>Integrated carrying handle, quiet &lt; 55dB sound level, and modular air filter cap</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20Compressor%20Nebulizer%20Machine">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="contec sp80b digital portable spirometer pulmonary function" data-badge="contec sp80b">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Contec SP80B Digital Portable Spirometer on Instagram" title="View on Instagram">
                                    <img src="dr-smith-contec-sp80b-digital-spirometer.png" alt="Contec SP80B Digital Portable Spirometer" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Pulmonary Diagnostics &bull; SP80B</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">Pulmonology Testing</span>
                                <h3>Contec SP80B Digital Portable Spirometer</h3>
                                <p>Handheld pulmonary function testing device measuring Forced Vital Capacity (FVC), FEV1, PEF, and displaying flow-volume loops on vibrant color screen.</p>
                                <ul class="catalogue-card__details">
                                <li>Measures FVC, FEV1, FEV1/FVC, PEF, FEF25, FEF75, and FEF2575 parameters</li>
                                <li>High-resolution color LCD showing real-time respiratory flow curves and loops</li>
                                <li>Wireless Bluetooth and USB data transfer for computer report generation</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Contec%20SP80B%20Digital%20Portable%20Spirometer">Enquire about this product <i class="bi bi-arrow-right"></i></a>
                            </div>
                        </article>
                    </div>
                    <div class="col-sm-6 col-lg-4 catalogue-grid-item" data-title="dr. smith digital clinical thermometer fast readout" data-badge="digital diagnostic">
                        <article class="catalogue-card">
                            <div class="catalogue-card__image catalogue-card__image--photo">
                                <a href="https://www.instagram.com/surgicalwholesalemartpvt.ltd?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="catalogue-card__image-link" aria-label="View Dr. Smith Digital Clinical Thermometer on Instagram" title="View on Instagram">
                                    <img src="dr-smith-digital-clinical-thermometer.png" alt="Dr. Smith Digital Clinical Thermometer" loading="lazy">
                                </a>
                            </div>
                            <span class="catalogue-card__badge">Digital Diagnostic &bull; Dr. Smith</span>
                            <div class="catalogue-card__body">
                                <span class="catalogue-card__category">General Diagnostics</span>
                                <h3>Dr. Smith Digital Clinical Thermometer</h3>
                                <p>Authentic Dr. Smith high-accuracy electronic clinical fever thermometer offering rapid 10-second temperature sensing, fever alarm beep, and waterproof tip.</p>
                                <ul class="catalogue-card__details">
                                <li>Accuracy &plusmn;0.1&deg;C with clear digital liquid crystal display (LCD)</li>
                                <li>Automatic fever alert beeper sound and last measurement memory recall</li>
                                <li>Waterproof flexible tip for safe oral, axillary, or rectal clinical reading</li>
                                </ul>
                                <a class="catalogue-card__link" href="../../contact-form/index.html?product=Dr.%20Smith%20Digital%20Clinical%20Thermometer">Enquire about this product <i class="bi bi-arrow-right"></i></a>
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

print("Updated small-general-equipment/index.html successfully!")
