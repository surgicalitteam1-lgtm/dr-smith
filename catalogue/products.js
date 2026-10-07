/**
 * Dr. Smith Product Catalogue Dataset
 * 
 * Provides product data records for the interactive catalogue.
 * Each product object contains:
 * - name: Display title of the medical product / equipment
 * - category: Category identifier ('furniture', 'surgical', 'transport', 'equipment', 'diagnostics')
 * - image: Relative path to the product image
 * - description: Brief summary of the product's function and specifications
 * - details: Array of key features, model numbers, and technical specifications
 */

window.catalogueProducts = [
    {
        name: 'Imported five-function ICU bed',
        category: 'furniture',
        image: 'img/products/imported-icu-bed.jpg',
        description: 'The brochure presents a motorised, imported five-function premium hospital ICU bed.',
        details: [
            'SWM 11000',
            'CPR system and separate patient/nursing-staff remote controls',
            'Brochure dimensions: 2110 × 1050 mm; height range: 450–720 mm',
            'ABS head and foot boards, four-section rails and five-inch twin centre-locking castors'
        ]
    },
    {
        name: 'Five-function ICU beds',
        category: 'furniture',
        image: 'img/products/five-function-icu-bed.jpg',
        description: 'Electric and manual intensive-care beds, with Deluxe and Eco configurations shown in the brochure.',
        details: [
            'SWM 11001–11004: five-function Deluxe and Eco models',
            'CRCA frame and uniformly perforated four-section top',
            'Electric models provide back, knee, Trendelenburg, reverse Trendelenburg and hi-low positions',
            'Brochure size: 220 × 100 × 60–80 cm; 5-inch casters and S.S. I.V. rod'
        ]
    },
    {
        name: 'Three-function ICU beds',
        category: 'furniture',
        image: 'img/products/three-function-icu-bed.jpg',
        description: 'Three-function ICU bed options with electric and manual operation, including Deluxe and Eco models.',
        details: [
            'SWM 11005–11008: electric and manual variants',
            'Perforated four-section CRCA bed top',
            'ABS head and foot panels; side rails vary by model',
            'Brochure size: 220 × 100 × 60–80 cm'
        ]
    },
    {
        name: 'Semi-Fowler beds',
        category: 'furniture',
        image: 'img/products/semi-fowler-bed.jpg',
        description: 'Manual and electric Semi-Fowler beds with Eco, Super Deluxe and Deluxe variants.',
        details: [
            'SWM 11013–11016',
            'Two-section perforated CRCA sheet top',
            'Manual back-rest adjustment by crank; electric model uses motor and remote',
            'Brochure size: 220 × 100 × 60–80 cm'
        ]
    },
    {
        name: 'Fowler beds',
        category: 'furniture',
        image: 'img/products/fowler-bed.jpg',
        description: 'Electric and manual Fowler beds are listed in Deluxe and Eco configurations.',
        details: [
            'SWM 11009: Fowler Bed Electric',
            'SWM 11010: Fowler Bed Manual Super Deluxe',
            'SWM 11011: Fowler Bed Manual Deluxe A; SWM 11012: Fowler Bed Manual Eco',
            'Brochure size: 220 × 100 × 60–80 cm'
        ]
    },
    {
        name: 'Plain, paediatric and infant beds',
        category: 'furniture',
        image: 'img/products/paediatric-bed.jpg',
        description: 'Plain beds, a paediatric bed, bassinets and a baby cradle are shown in the supplied brochure.',
        details: [
            'Plain Bed Super Deluxe and Deluxe: SWM 11017 and 11018',
            'Plain Bed Eco: SWM 11019; Paediatric Bed: SWM 11020',
            'Imported and Indian Baby Bassinets: SWM 11021; Baby Cradle: SWM 11022',
            'Paediatric bed size listed: 137 × 76 × 60 cm; bassinet: 870 × 530 × 780–980 mm'
        ]
    },
    {
        name: 'O.T. operating tables',
        category: 'surgical',
        image: 'img/products/operating-table.jpg',
        description: 'Operating tables are shown with electric, semi-electric and hydraulic operating options.',
        details: [
            'SWM 11029: electric table with manual top slide and central locking',
            'SWM 11030: electric/manual Eco model; SWM 11031: semi-electric C-arm',
            'SWM 11032: hydraulic C-arm; SWM 11033: general hydraulic table',
            'Brochure notes stainless-steel top sections and adjustable positioning'
        ]
    },
    {
        name: 'O.T. lights',
        category: 'surgical',
        image: 'img/products/ot-light.jpg',
        description: 'Ceiling, stand and examination lights in single- and multi-reflector configurations.',
        details: [
            'SWM 11023–11028',
            'Premium camera-head light and premium globus dome models',
            'Globus dome listing: 48 LEDs, 180,000 lux and over 50,000 hours',
            'Stand lights include four-reflector and five/six-reflector options; battery backup is listed as optional'
        ]
    },
    {
        name: 'Examination and delivery tables',
        category: 'surgical',
        image: 'img/products/delivery-table.jpg',
        description: 'Examination and obstetric tables, including three-fold, telescopic, electric/manual and hydraulic models.',
        details: [
            'SWM 11034–11039',
            'Examination Delivery Table: SWM 11034; Delivery Table Three Fold: SWM 11035',
            'Telescopic Table MS & SS: SWM 11036; Electric + Manual Delivery Table: SWM 11037',
            'Hydraulic Deluxe Delivery Table: SWM 11038; Delivery Bed Electric & Manual: SWM 11039'
        ]
    },
    {
        name: 'Patient transport and emergency equipment',
        category: 'transport',
        image: 'img/products/patient-stretcher.jpg',
        description: 'Transfer and emergency-care products include spine boards, scoop stretchers and folding stretchers.',
        details: [
            'Spine Board: SWM 11079; Scoop Stretcher: SWM 11080',
            'Two Fold Stretcher: SWM 11081; Four Fold Stretcher: SWM 11082',
            'I.V. Stand: SWM 11083; Kick Bucket (M.S. & S.S.): SWM 11084',
            'Colposcope: SWM 11085'
        ]
    },
    {
        name: 'Ward trolleys and clinical furniture',
        category: 'transport',
        image: 'img/products/ward-trolley.jpg',
        description: 'A range of stainless-steel and mild-steel trolleys, patient furniture and ward accessories.',
        details: [
            'Instrument trolleys: SWM 11064–11067; Dressing Trolley: SWM 11068',
            'E.C.G. Trolley: SWM 11069; Linen Trolley: SWM 11070; Laparoscopy Trolley: SWM 11071',
            'Food tables, Bio Waste Trolley, Mayo’s Trolley and Instrument Cabinet are also pictured',
            'SWM 11065 and 11066 listed size: D457 × W609 × H762 mm; customization available'
        ]
    },
    {
        name: 'Autoclaves and sterilizers',
        category: 'equipment',
        image: 'img/products/autoclave.jpg',
        description: 'Portable, vertical and horizontal autoclave models in stainless steel and aluminium configurations.',
        details: [
            'Portable models include six-wing nut, aluminium P-type and stainless-steel digital P-type',
            'The brochure lists capacities from 12 L to 40 L for portable models',
            'Vertical autoclave listings include 40 L, 52 L, 75 L, 95 L and 180 L variants',
            'Electrical and non-electrical variants are indicated where listed'
        ]
    },
    {
        name: 'Surgical instrument sets',
        category: 'surgical',
        image: 'img/products/surgical-instrument-set.jpg',
        description: 'Instrument sets are pictured for multiple clinical specialties.',
        details: [
            'Gyne, General and Macro instrument sets',
            'ENT and Orthopedic instrument sets',
            'TC instrument set',
            'Individual instrument lists and configurations should be confirmed with the Dr. Smith team'
        ]
    },
    {
        name: 'Patient monitoring and resuscitation',
        category: 'equipment',
        image: 'img/products/patient-monitor.jpg',
        description: 'Monitoring and emergency-response equipment shown in the supplied Dr. Smith catalogue.',
        details: [
            'Three-para monitor: SWM 11086; Five-para monitor: SWM 11087',
            'E.C.G. machine: SWM 11088',
            'Automatic External Defibrillator: SWM 11089',
            'New and pre-owned defibrillator listing: SWM 11090'
        ]
    },
    {
        name: 'Anaesthesia workstations',
        category: 'equipment',
        image: 'img/products/anaesthesia-workstation.jpg',
        description: 'Anaesthesia workstation listings include Prestige and Premium configurations and pre-owned units.',
        details: [
            'Prestige-I listing includes a high-brightness display and manual ventilation option',
            'Premium workstation listing describes storage, monitor and gas-supply features',
            'Minor and Major anaesthesia machine stands are shown in MS and SS variants',
            'Confirm exact configuration and technical specification before ordering'
        ]
    },
    {
        name: 'Medical devices and respiratory care',
        category: 'equipment',
        image: 'img/products/oxygen-concentrator.jpg',
        description: 'The brochure groups patient-care devices and respiratory support equipment.',
        details: [
            'Smart 4 cautery machine: SWM 11091; Syringe Pump: SWM 11092',
            'Fetal Monitors & C.T.G. Machines: SWM 11093; Bi-Pap & C-Pap Machine: SWM 11094',
            'Oxygen Concentrator: SWM 11095',
            'Model details beyond the printed listing are not inferred here'
        ]
    },
    {
        name: 'Imaging, endoscopy and dialysis',
        category: 'diagnostics',
        image: 'img/products/imaging-system.jpg',
        description: 'Imaging, endoscopy and renal-care equipment is listed in the supplied Dr. Smith catalogue.',
        details: [
            'C.R. system: SWM 11099; C-arm machines: SWM 11100',
            'Diagnostic ultrasound scanners: SWM 11101; Dialysis machine: SWM 11102',
            'Laparoscopy/endoscopy equipment: SWM 11103; camera units: SWM 11104',
            'Gastroscopy units: SWM 11105; Bubble C-Pap: SWM 11106'
        ]
    },
    {
        name: 'Laboratory and neonatal equipment',
        category: 'diagnostics',
        image: 'img/products/laboratory-analyzer.jpg',
        description: 'Laboratory equipment and neonatal-care products shown in the supplied catalogue.',
        details: [
            'Microscopes, centrifuges, incubators, hot-air ovens and scientific goods: SWM 11108',
            'Hematology Analyzer: SWM 11109; Electrolyte Analyzer: SWM 11110',
            'Arterial Blood Gas Machine: SWM 11111; Biochemistry Analyzer: SWM 11112',
            'ELISA Reader and Washer: SWM 11113; Baby Incubator: SWM 11114'
        ]
    },
    {
        name: 'Baby warmers',
        category: 'equipment',
        image: 'img/products/baby-warmer.jpg',
        description: 'Regular, Deluxe and Super Deluxe baby warmers, plus Premium N-series models, are shown in the brochure.',
        details: [
            'Premium Baby Warmer N102, N103 and N400',
            'The printed specification lists 230 V AC ±10%, 50 Hz',
            'Maximum heater output listed: 650 W',
            'Features shown vary by model; confirm configuration with the Dr. Smith team'
        ]
    },
    {
        name: 'Surgical goods and clinical supplies',
        category: 'surgical',
        image: 'img/products/clinical-supplies.jpg',
        description: 'The catalogue also includes specialty attachments, physiotherapy products and general surgical goods.',
        details: [
            'Medical dresses: SWM 11137; I.C.U. and ward curtain lining: SWM 11138',
            'E.N.T. and Neuro Microscopes: SWM 11139; Ortho and Neuro Attachments: SWM 11140',
            'Physiotherapy goods: SWM 11141; General Surgical Goods: SWM 11142',
            'Mannequins and dummies: SWM 11143'
        ]
    }
];
