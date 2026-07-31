export const CATEGORY_METADATA = [
  {
    id: 'sweatshirts',
    name: 'Sweatshirts',
    slug: 'sweatshirts',
    tagline: 'Heavyweight 500GSM fleece & oversized graphic crews',
    description: 'Sculptural luxury sweatshirts constructed with dense French terry cotton, dropped shoulders, and ribbed architectural trim.',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1200',
    itemCount: '4 Garments',
    subcategories: [
      'Oversized Sweatshirt',
      'Oversized Graphic Sweatshirt'
    ]
  },
  {
    id: 'pants',
    name: 'Baggy Pants',
    slug: 'pants',
    tagline: 'Oversized double-pleated sweatpants & graphic wide-legs',
    description: 'Voluminous silhouettes engineered with extended rises, deep front pleats, and fluid drape for ultimate modern streetwear movement.',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200',
    itemCount: '4 Garments',
    subcategories: [
      'Baggy Sweatpants',
      'Baggy Graphic Sweatpants'
    ]
  },
  {
    id: 'shirts',
    name: 'Shirts',
    slug: 'shirts',
    tagline: 'Oversized Italian poplin & casual relaxed button-downs',
    description: 'Precision-crafted luxury shirts built with architectural collars, relaxed drops, and high-thread-count European fabrics.',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1200',
    itemCount: '4 Garments',
    subcategories: [
      'Oversized Shirt',
      'Casual Shirt'
    ]
  },
  {
    id: 'tees',
    name: 'Drop Shoulder T-Shirts',
    slug: 'tees',
    tagline: 'Boxy 320GSM organic cotton tees & graphic drop-shoulder cuts',
    description: 'Minimalist streetwear foundations featuring drop-shoulder proportions, high-density cotton, and soft vintage washes.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200',
    itemCount: '4 Garments',
    subcategories: [
      'Drop Shoulder Tee',
      'Graphic Drop Shoulder Tee'
    ]
  },
  {
    id: 'jerseys',
    name: 'Jerseys',
    slug: 'jerseys',
    tagline: 'Player edition, fan edition & retro archive kits',
    description: 'Heavyweight knitted athletic couture jerseys featuring jacquard ribbing, raised embroidery, and archival sports tailoring.',
    image: 'https://images.unsplash.com/photo-1511746315387-c4a76990fdce?auto=format&fit=crop&q=80&w=1200',
    itemCount: '4 Garments',
    subcategories: [
      'Player Edition Jersey',
      'Fan Edition Jersey',
      'Retro Jersey'
    ]
  }
];

export const PRODUCTS = [
  // --- SWEATSHIRTS ---
  {
    id: 'sw-01',
    name: 'Oversized Monolith Sweatshirt',
    tagline: '500GSM combed organic French terry cotton with architectural fit',
    price: 3200,
    originalPrice: 3800,
    isNew: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 58,
    category: 'Sweatshirts',
    categorySlug: 'sweatshirts',
    subcategory: 'Oversized Sweatshirt',
    gender: 'Unisex',
    colors: [
      { name: 'Onyx Black', hex: '#111111' },
      { name: 'Washed Charcoal', hex: '#2b2c2e' },
      { name: 'Bone Off-White', hex: '#e8e4d9' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 16,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1000',
    secondaryImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=1000',
    description: 'Sculptural silhouette constructed from ultra-dense 500GSM French terry cotton. Features dropped shoulders, ribbed cuffs, and subtle debossed tonal branding.',
    fabric: '100% Organic Heavyweight French Terry Cotton',
    care: 'Machine wash cold inside out. Lay flat to dry.',
    fit: 'Generous oversized boxy drape.'
  },
  {
    id: 'sw-02',
    name: 'Oversized Graphic Archival Sweatshirt',
    tagline: 'Puff-printed high-density chest typography on vintage washed fleece',
    price: 3500,
    originalPrice: 3950,
    isNew: true,
    isBestSeller: false,
    rating: 5.0,
    reviewsCount: 41,
    category: 'Sweatshirts',
    categorySlug: 'sweatshirts',
    subcategory: 'Oversized Graphic Sweatshirt',
    gender: 'Unisex',
    colors: [
      { name: 'Vintage Sun-Faded Grey', hex: '#585c63' },
      { name: 'Deep Midnight Blue', hex: '#121d2d' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 12,
    image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=1000',
    secondaryImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=1000',
    description: 'Hand-dyed vintage sun-bleached fleece featuring tactile 3D tactile screen printed iconography across the chest and upper spine.',
    fabric: '100% Ring-Spun Cotton Fleece',
    care: 'Machine wash cold gentle. Do not iron print directly.',
    fit: 'Relaxed street-grade oversized fit.'
  },

  // --- BAGGY PANTS ---
  {
    id: 'bp-01',
    name: 'Baggy Pleated Sweatpants',
    tagline: '500GSM French terry double-pleated wide-leg sweatpants',
    price: 2850,
    originalPrice: 3400,
    isNew: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 72,
    category: 'Baggy Pants',
    categorySlug: 'pants',
    subcategory: 'Baggy Sweatpants',
    gender: 'Unisex',
    colors: [
      { name: 'Pitch Black', hex: '#0f0f10' },
      { name: 'Washed Slate Grey', hex: '#484b52' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 22,
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000',
    secondaryImage: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&q=80&w=1000',
    description: 'Engineered with deep tailored pleats down the front leg, creating an architectural wide-leg drape with open raw hems that rest perfectly over footwear.',
    fabric: '100% Combed Heavy Cotton Terry',
    care: 'Machine wash cold inside out.',
    fit: 'Ultra baggy high-rise drape.'
  },
  {
    id: 'bp-02',
    name: 'Baggy Graphic Sweatpants',
    tagline: 'Tactile raised lettering along lateral seams with elasticated waist',
    price: 2950,
    originalPrice: 3300,
    isNew: false,
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 53,
    category: 'Baggy Pants',
    categorySlug: 'pants',
    subcategory: 'Baggy Graphic Sweatpants',
    gender: 'Unisex',
    colors: [
      { name: 'Washed Black', hex: '#1c1d1f' },
      { name: 'Chalk Beige', hex: '#dfd8cb' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 15,
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&q=80&w=1000',
    secondaryImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000',
    description: 'Bold graphic paneling down the side legs with concealed YKK zip side pockets and custom engraved metal drawstring tips.',
    fabric: '100% Heavy Organic Cotton',
    care: 'Machine wash cold inside out.',
    fit: 'Wide-leg voluminous cut.'
  },

  // --- SHIRTS ---
  {
    id: 'sh-01',
    name: 'Oversized Poplin Shirt',
    tagline: 'Crisp high-thread-count Italian cotton with dropped shoulder seams',
    price: 2450,
    originalPrice: 2950,
    isNew: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 42,
    category: 'Shirts',
    categorySlug: 'shirts',
    subcategory: 'Oversized Shirt',
    gender: 'Unisex',
    colors: [
      { name: 'Optic White', hex: '#ffffff' },
      { name: 'Onyx Black', hex: '#111111' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 18,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1000',
    secondaryImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1000',
    description: 'Crafted from crisp high-density Italian cotton poplin. Features an exaggerated boxy body, elongated mother-of-pearl buttons, and structured cuffs.',
    fabric: '100% Organic Italian Cotton Poplin',
    care: 'Machine wash cold delicate or dry clean.',
    fit: 'Generous oversized fit.'
  },
  {
    id: 'sh-02',
    name: 'Casual Relaxed Resort Shirt',
    tagline: 'Soft-washed linen blend with resort cuban collar',
    price: 2100,
    originalPrice: 2450,
    isNew: false,
    isBestSeller: false,
    rating: 4.7,
    reviewsCount: 31,
    category: 'Shirts',
    categorySlug: 'shirts',
    subcategory: 'Casual Shirt',
    gender: 'Men',
    colors: [
      { name: 'Raw Linen Natural', hex: '#d9cdbe' },
      { name: 'Olive Shadow', hex: '#4f543e' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 14,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=1000',
    secondaryImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=1000',
    description: 'Garment-washed flax linen designed for maximum breathability during warmer seasons with tactile textured weave.',
    fabric: '100% Normandy Flax Linen',
    care: 'Hand wash or gentle cold machine wash.',
    fit: 'Relaxed utility resort fit.'
  },

  // --- DROP SHOULDER T-SHIRTS ---
  {
    id: 'dt-01',
    name: 'Drop Shoulder Tee',
    tagline: '300GSM heavy combed cotton tee with extended elbow sleeves',
    price: 1250,
    originalPrice: 1500,
    isNew: true,
    isBestSeller: true,
    rating: 4.9,
    reviewsCount: 88,
    category: 'Drop Shoulder T-Shirts',
    categorySlug: 'tees',
    subcategory: 'Drop Shoulder Tee',
    gender: 'Unisex',
    colors: [
      { name: 'Chalk White', hex: '#f7f5ed' },
      { name: 'Onyx Black', hex: '#111111' },
      { name: 'Concrete Grey', hex: '#8a8e94' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 35,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000',
    secondaryImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1000',
    description: 'Architectural streetwear essential featuring relaxed drop shoulders, wide elbow-length sleeves, and high-density ribbed neck trim.',
    fabric: '100% Combed Organic Cotton (300GSM)',
    care: 'Machine wash cold inside out with like colors.',
    fit: 'Boxy drop-shoulder silhouette.'
  },
  {
    id: 'dt-02',
    name: 'Graphic Drop Shoulder Tee',
    tagline: 'High-density rubberized chest logo on garment-dyed cotton',
    price: 1350,
    originalPrice: 1650,
    isNew: true,
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 64,
    category: 'Drop Shoulder T-Shirts',
    categorySlug: 'tees',
    subcategory: 'Graphic Drop Shoulder Tee',
    gender: 'Unisex',
    colors: [
      { name: 'Vintage Washed Black', hex: '#1f2022' },
      { name: 'Forest Shadow', hex: '#243328' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 20,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1000',
    secondaryImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000',
    description: 'Subtle tactile 3D rubberized logo print on the chest with reinforced high-density neck collar and garment-dyed patina.',
    fabric: '100% Premium Cotton Jersey',
    care: 'Machine wash cold inside out.',
    fit: 'Oversized boxy drop shoulder.'
  },

  // --- JERSEYS ---
  {
    id: 'jy-01',
    name: 'Player Edition Jersey',
    tagline: 'Heavyweight jacquard knitted performance jersey with raised crest',
    price: 3600,
    originalPrice: 4200,
    isNew: true,
    isBestSeller: true,
    rating: 5.0,
    reviewsCount: 65,
    category: 'Jerseys',
    categorySlug: 'jerseys',
    subcategory: 'Player Edition Jersey',
    gender: 'Unisex',
    colors: [
      { name: 'Onyx Gold', hex: '#121212' },
      { name: 'Crimson Red', hex: '#7a141a' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 18,
    image: 'https://images.unsplash.com/photo-1511746315387-c4a76990fdce?auto=format&fit=crop&q=80&w=1000',
    secondaryImage: 'https://images.unsplash.com/photo-1577210897962-3f541982df4e?auto=format&fit=crop&q=80&w=1000',
    description: 'Authentic player edition specification crafted with custom woven jacquard breathability panels, heat-transferred metallic crests, and ergonomic armhole drops.',
    fabric: '100% Recycled Technical Jacquard Mesh',
    care: 'Machine wash cold inside out. Do not tumble dry.',
    fit: 'Athletic relaxed fit.'
  },
  {
    id: 'jy-02',
    name: 'Fan Edition Jersey',
    tagline: 'Comfortable cotton-knit streetwear jersey with embroidered emblems',
    price: 2800,
    originalPrice: 3200,
    isNew: false,
    isBestSeller: true,
    rating: 4.8,
    reviewsCount: 49,
    category: 'Jerseys',
    categorySlug: 'jerseys',
    subcategory: 'Fan Edition Jersey',
    gender: 'Unisex',
    colors: [
      { name: 'Royal Blue', hex: '#163b70' },
      { name: 'Pure White', hex: '#ffffff' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 25,
    image: 'https://images.unsplash.com/photo-1577210897962-3f541982df4e?auto=format&fit=crop&q=80&w=1000',
    secondaryImage: 'https://images.unsplash.com/photo-1511746315387-c4a76990fdce?auto=format&fit=crop&q=80&w=1000',
    description: 'Designed for daily lifestyle wear with dense 280GSM cotton-blend jersey, ribbed collar, and high-density woven chest patch.',
    fabric: '80% Combed Cotton, 20% Technical Polyester',
    care: 'Machine wash cold with like colors.',
    fit: 'Relaxed daily streetwear fit.'
  },
  {
    id: 'jy-03',
    name: 'Retro Edition Archive Jersey',
    tagline: '90s archival long-sleeve knit kit with vintage polo collar',
    price: 3400,
    originalPrice: 3800,
    isNew: true,
    isBestSeller: false,
    rating: 4.9,
    reviewsCount: 38,
    category: 'Jerseys',
    categorySlug: 'jerseys',
    gender: 'Unisex',
    colors: [
      { name: 'Vintage Emerald', hex: '#103828' },
      { name: 'Washed Charcoal', hex: '#282a2e' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 14,
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1000',
    secondaryImage: 'https://images.unsplash.com/photo-1511746315387-c4a76990fdce?auto=format&fit=crop&q=80&w=1000',
    description: 'Archival 90s sports silhouette with contrast ribbed polo collar, long sleeves, and subtle distressed wash for a genuine retro feel.',
    fabric: '100% Heavyweight Cotton Knit',
    care: 'Machine wash cold separately.',
    fit: 'Boxy 90s retro fit.'
  }
];

export const CATEGORIES = [
  'All',
  'Sweatshirts',
  'Baggy Pants',
  'Shirts',
  'Drop Shoulder T-Shirts',
  'Jerseys'
];
