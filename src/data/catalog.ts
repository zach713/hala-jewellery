import { CategorySlug, CategoryTile, CustomerReview, Product } from '../types';

export const HERO_MEDIA = {
  leftImage: '/src/assets/images/hero_editorial_left_1795290310652.jpg',
  rightImage: '/src/assets/images/hero_editorial_right_1795290311303.jpg',
};

export const CATEGORY_TILES: CategoryTile[] = [
  {
    slug: 'necklaces',
    title: 'NECKLACES',
    subtitle: 'Pieces that sit right where people look first.',
    image: '/src/assets/images/prod_juliette_necklace_1795290310775.jpg',
  },
  {
    slug: 'earrings',
    title: 'EARRINGS',
    subtitle: 'Sculpted silhouettes and luminous stones that frame every angle.',
    image: '/src/assets/images/cat_earrings_pearl_1795290310886.jpg',
  },
  {
    slug: 'rings',
    title: 'RINGS',
    subtitle: 'Sculptural rings that make your hands part of the outfit.',
    image: '/src/assets/images/cat_rings_1795290309895.jpg',
  },
  {
    slug: 'bracelets',
    title: 'BRACELETS',
    subtitle: 'Easy to wear daily, impossible to go unnoticed.',
    image: '/src/assets/images/cat_bracelets_1795290312113.jpg',
  },
  {
    slug: 'watches',
    title: 'WATCHES',
    subtitle: 'Refined timepieces designed to pair effortlessly with your everyday stack.',
    image: '/src/assets/images/prod_onda_bracelet_1795290309930.jpg',
  },
  {
    slug: 'traditional',
    title: 'TRADITIONAL',
    subtitle: 'Moroccan heritage-inspired jewellery crafted to adorn caftans and celebrations.',
    image: '/src/assets/images/prod_sculptural_ring_1795290311106.jpg',
  },
];

export const COLLECTION_META: Record<
  CategorySlug,
  { title: string; subtitle: string }
> = {
  all: {
    title: 'SHOP ALL',
    subtitle: 'Limited contemporary pieces designed for effortless self-expression.',
  },
  'new-this-season': {
    title: 'NEW IN',
    subtitle: 'Freshly curated silhouettes in durable stainless steel with gold and silver tones.',
  },
  'back-in-stock': {
    title: 'BACK IN STOCK',
    subtitle: 'Most-requested signature pieces, returned in small numbered batches.',
  },
  'ear-cuffs': {
    title: 'SCULPTED EARRINGS',
    subtitle: 'The stacked-ear look crafted in skin-safe stainless steel.',
  },
  sets: {
    title: 'SETS',
    subtitle: 'Matched with intention, made to be worn together.',
  },
  earrings: {
    title: 'EARRINGS',
    subtitle: 'Sculpted silhouettes and luminous stones that frame every angle.',
  },
  necklaces: {
    title: 'NECKLACES',
    subtitle: 'Pieces that sit right where people look first.',
  },
  rings: {
    title: 'RINGS',
    subtitle: 'Sculptural rings that make your hands part of the outfit.',
  },
  bracelets: {
    title: 'BRACELETS',
    subtitle: 'Easy to wear daily, impossible to go unnoticed.',
  },
  watches: {
    title: 'WATCHES',
    subtitle: 'Refined timepieces designed to pair effortlessly with your everyday stack.',
  },
  traditional: {
    title: 'TRADITIONAL',
    subtitle: 'Moroccan heritage-inspired jewellery crafted to adorn caftans and timeless celebrations.',
  },
};

export const PRODUCTS: Product[] = [
  {
    id: 'helena-set',
    slug: 'helena-set',
    name: 'Helena Set',
    priceAud: 149,
    category: 'sets',
    categoryLabel: 'Sets',
    isNewSeason: true,
    isBackInStock: true,
    inStock: true,
    stockCount: 4,
    image: '/src/assets/images/prod_helena_set_1795290309434.jpg',
    gallery: [
      '/src/assets/images/prod_helena_set_1795290309434.jpg',
      '/src/assets/images/hero_editorial_left_1795290310652.jpg',
      '/src/assets/images/prod_kate_earrings_1795290311576.jpg',
      '/src/assets/images/cat_ear_cuffs_1795290310241.jpg',
    ],
    swatches: [
      { id: 'lilac-gold', label: 'Lilac Silk & Gold', hex: '#D8C7D6' },
      { id: 'ivory-gold', label: 'Ivory Silk & Gold', hex: '#E8DEC8' },
      { id: 'onyx-gold', label: 'Onyx Velvet & Gold', hex: '#181615' },
      { id: 'blush-gold', label: 'Blush Ribbon & Gold', hex: '#F3B6C1' },
    ],
    description:
      'A signature two-piece pairing featuring an adjustable double-wrap silk ribbon choker anchored by an oval-cut cubic zirconia pendant, matched with our delicate bezel-set stud earrings.',
    materials: [
      'Gold-toned stainless steel over hypoallergenic core',
      'Hand-cut AAA clear cubic zirconia stones',
      'Japanese satin-weave silk ribbon with extender clasp',
      'Nickel-free & safe for sensitive skin',
    ],
    dimensions: 'Ribbon length 34cm + 6cm extender · Pendant 16mm × 12mm · Studs 10mm',
    careNote: 'Remove before bathing or applying fragrance. Store flat in your Hala linen pouch.',
  },
  {
    id: 'carol-earrings',
    slug: 'carol-earrings',
    name: 'Carol Earrings',
    priceAud: 99,
    category: 'earrings',
    categoryLabel: 'Earrings',
    isNewSeason: true,
    inStock: true,
    stockCount: 6,
    image: '/src/assets/images/prod_carol_earrings_1795290311003.jpg',
    gallery: [
      '/src/assets/images/prod_carol_earrings_1795290311003.jpg',
      '/src/assets/images/hero_editorial_left_1795290310652.jpg',
      '/src/assets/images/cat_earrings_pearl_1795290310886.jpg',
      '/src/assets/images/prod_kate_earrings_1795290311576.jpg',
    ],
    swatches: [
      { id: 'gold', label: 'Gold Tone', hex: '#C6973F' },
      { id: 'silver', label: 'Silver Tone', hex: '#D5D7DA' },
    ],
    description:
      'Sculpted high-polish crescent hoops cradling a floating oval-cut crystal centerpiece. Designed to hug the lobe comfortably while catching light from every angle.',
    materials: [
      'Gold-toned stainless steel finish',
      'Bezel-set oval AAA cubic zirconia',
      'Custom architectural hinged snap post',
    ],
    dimensions: 'Height 22mm · Width 16mm · Weight 4.8g per earring',
    careNote: 'Buff gently with a dry microfiber cloth after wear to preserve mirror polish.',
  },
  {
    id: 'kate-earrings',
    slug: 'kate-earrings',
    name: 'Kate Earrings',
    priceAud: 79,
    category: 'earrings',
    categoryLabel: 'Earrings',
    isNewSeason: true,
    isBackInStock: true,
    inStock: true,
    stockCount: 9,
    image: '/src/assets/images/prod_kate_earrings_1795290311576.jpg',
    gallery: [
      '/src/assets/images/prod_kate_earrings_1795290311576.jpg',
      '/src/assets/images/hero_editorial_left_1795290310652.jpg',
      '/src/assets/images/prod_carol_earrings_1795290311003.jpg',
      '/src/assets/images/prod_vivienne_earrings_1795290310345.jpg',
    ],
    swatches: [
      { id: 'gold', label: 'Gold Tone', hex: '#C6973F' },
      { id: 'silver', label: 'Silver Tone', hex: '#D5D7DA' },
    ],
    description:
      'Architectural emerald-cut studs framed by minimalist four-prong gold-toned claws. Crisp step-cut facets deliver understated brilliance from morning meetings to evening dinners.',
    materials: [
      'Gold-toned stainless steel posts',
      'Emerald step-cut high-clarity cubic zirconia',
      'Hypoallergenic & tarnish-resistant e-coating',
    ],
    dimensions: 'Stone size 11mm × 8mm · Weight 2.4g per earring',
    careNote: 'Clean around prong settings with warm water and a soft brush as needed.',
  },
  {
    id: 'vivienne-earrings',
    slug: 'vivienne-earrings',
    name: 'Vivienne Earrings',
    priceAud: 129,
    category: 'earrings',
    categoryLabel: 'Earrings',
    isNewSeason: true,
    isBackInStock: true,
    inStock: true,
    stockCount: 3,
    image: '/src/assets/images/prod_vivienne_earrings_1795290310345.jpg',
    gallery: [
      '/src/assets/images/prod_vivienne_earrings_1795290310345.jpg',
      '/src/assets/images/hero_editorial_right_1795290311303.jpg',
      '/src/assets/images/cat_earrings_pearl_1795290310886.jpg',
      '/src/assets/images/prod_kate_earrings_1795290311576.jpg',
    ],
    swatches: [
      { id: 'silver', label: 'Silver Tone', hex: '#D5D7DA' },
      { id: 'gold', label: 'Gold Tone', hex: '#C6973F' },
    ],
    description:
      'Graduated marquise crystal clusters cascade into luminous natural-lustre freshwater pearls. Fluid articulation ensures gentle movement with every turn.',
    materials: [
      'Silver-toned stainless steel with hypoallergenic posts',
      'Natural freshwater pearl drops (11mm)',
      'Marquise-cut cubic zirconia',
    ],
    dimensions: 'Total drop 46mm · Pearl diameter 11mm · Weight 5.1g per earring',
    careNote: 'Freshwater pearls are organic—keep away from hairspray and perfume.',
  },
  {
    id: 'heaven-sculpted-set',
    slug: 'heaven-sculpted-set',
    name: 'Heaven Sculpted Hoop Set',
    priceAud: 129,
    category: 'ear-cuffs',
    categoryLabel: 'Earrings',
    isBackInStock: true,
    inStock: true,
    stockCount: 5,
    image: '/src/assets/images/prod_heaven_ear_cuff_1795290310350.jpg',
    gallery: [
      '/src/assets/images/prod_heaven_ear_cuff_1795290310350.jpg',
      '/src/assets/images/cat_ear_cuffs_1795290310241.jpg',
      '/src/assets/images/prod_sculptural_ring_1795290311106.jpg',
      '/src/assets/images/prod_vivienne_earrings_1795290310345.jpg',
    ],
    swatches: [
      { id: 'silver', label: 'Silver Tone', hex: '#D5D7DA' },
      { id: 'gold', label: 'Gold Tone', hex: '#C6973F' },
    ],
    description:
      'A sleek pair of stainless steel sculptural earrings—one high-polish band and one micro-pavé crystal band designed for effortless stacking.',
    materials: [
      'Water-resistant stainless steel in silver or gold tone',
      'Hand-set micro-pavé cubic zirconia',
      'Ergonomic all-day comfort fit',
    ],
    dimensions: 'Outer diameter 13mm · Band thickness 3.2mm · Pair',
    careNote: 'Wipe gently with a soft dry cloth after wear.',
  },
  {
    id: 'juliette-pearl-necklace',
    slug: 'juliette-pearl-necklace',
    name: 'Juliette Pearl Necklace',
    priceAud: 79,
    category: 'necklaces',
    categoryLabel: 'Necklaces',
    isNewSeason: true,
    inStock: true,
    stockCount: 7,
    image: '/src/assets/images/prod_juliette_necklace_1795290310775.jpg',
    gallery: [
      '/src/assets/images/prod_juliette_necklace_1795290310775.jpg',
      '/src/assets/images/cat_earrings_pearl_1795290310886.jpg',
      '/src/assets/images/hero_editorial_right_1795290311303.jpg',
      '/src/assets/images/prod_helena_set_1795290309434.jpg',
    ],
    swatches: [
      { id: 'silver', label: 'Silver Tone', hex: '#D5D7DA' },
      { id: 'gold', label: 'Gold Tone', hex: '#C6973F' },
    ],
    description:
      'An airy station chain punctuated with luminous floating freshwater pearls. Wear solo for quiet collar refinement or layer effortlessly with shorter chokers.',
    materials: [
      'Silver-toned stainless steel chain',
      'Cultured freshwater pearls (5–6mm)',
      'Custom lobster clasp with 5cm adjustment chain',
    ],
    dimensions: 'Chain length 42cm + 5cm extender · Pearl stations 5.5mm',
    careNote: 'Clasp closed before storing to prevent tangling.',
  },
  {
    id: 'solis-two-tone-ring',
    slug: 'solis-two-tone-ring',
    name: 'Solis Teardrop Ring',
    priceAud: 119,
    category: 'rings',
    categoryLabel: 'Rings',
    isNewSeason: true,
    isBackInStock: true,
    inStock: true,
    stockCount: 2,
    image: '/src/assets/images/prod_sculptural_ring_1795290311106.jpg',
    gallery: [
      '/src/assets/images/prod_sculptural_ring_1795290311106.jpg',
      '/src/assets/images/cat_rings_1795290309895.jpg',
      '/src/assets/images/prod_onda_bracelet_1795290309930.jpg',
      '/src/assets/images/prod_heaven_ear_cuff_1795290310350.jpg',
    ],
    swatches: [
      { id: 'two-tone', label: 'Silver & Gold Tone', hex: '#D1BC8A' },
      { id: 'gold', label: 'All Gold Tone', hex: '#C6973F' },
    ],
    description:
      'A bold architectural cigar band cast in mirror-finished stainless steel and anchored by a brushed gold-toned teardrop crest. Comfort-contoured interior for all-day wear.',
    materials: [
      'Stainless steel band with brushed gold-toned accent',
      'Hypoallergenic & waterproof stainless steel',
    ],
    dimensions: 'Band width 11mm · Sizes US 6, 7, 8 available',
    careNote: 'Due to the wide silhouette, consider sizing up one half-size if between sizes.',
  },
  {
    id: 'onda-bracelet',
    slug: 'onda-bracelet',
    name: 'Onda Cuff Bracelet',
    priceAud: 109,
    category: 'bracelets',
    categoryLabel: 'Bracelets',
    isNewSeason: true,
    inStock: true,
    stockCount: 3,
    image: '/src/assets/images/prod_onda_bracelet_1795290309930.jpg',
    gallery: [
      '/src/assets/images/prod_onda_bracelet_1795290309930.jpg',
      '/src/assets/images/cat_bracelets_1795290312113.jpg',
      '/src/assets/images/cat_rings_1795290309895.jpg',
      '/src/assets/images/prod_sculptural_ring_1795290311106.jpg',
    ],
    swatches: [
      { id: 'gold', label: 'Gold Tone', hex: '#C6973F' },
    ],
    description:
      'Fluid organic waves sculpted in high-shine gold-toned stainless steel. The Onda cuff slips gracefully over the wrist or tailored sleeve as a solitary statement piece.',
    materials: [
      'Water-resistant gold-toned stainless steel',
      'Hand-polished wave contours with protective finish',
    ],
    dimensions: 'Inner wrist circumference 16.5cm · Opening 28mm · Weight 34g',
    careNote: 'Slide over the narrow side of the wrist rather than bending the cuff opening.',
  },
  {
    id: 'margot-pearl-drops',
    slug: 'margot-pearl-drops',
    name: 'Margot Pearl Earrings',
    priceAud: 129,
    category: 'earrings',
    categoryLabel: 'Earrings',
    inStock: true,
    stockCount: 5,
    image: '/src/assets/images/cat_earrings_pearl_1795290310886.jpg',
    gallery: [
      '/src/assets/images/cat_earrings_pearl_1795290310886.jpg',
      '/src/assets/images/prod_vivienne_earrings_1795290310345.jpg',
      '/src/assets/images/hero_editorial_right_1795290311303.jpg',
    ],
    swatches: [
      { id: 'silver', label: 'Silver Tone', hex: '#D5D7DA' },
    ],
    description:
      'Cascading linear drop earrings combining hand-wired freshwater pearls and delicate silver-toned links for effortless evening elongation.',
    materials: [
      'Silver-toned stainless steel',
      'Natural freshwater baroque & round pearls',
    ],
    dimensions: 'Length 68mm · Weight 4.2g per earring',
    careNote: 'Store hanging or flat away from sharp metal pieces.',
  },
  {
    id: 'aria-stacked-rings',
    slug: 'aria-stacked-rings',
    name: 'Aria Dome Ring Trio',
    priceAud: 139,
    category: 'rings',
    categoryLabel: 'Rings',
    inStock: true,
    stockCount: 4,
    image: '/src/assets/images/cat_rings_1795290309895.jpg',
    gallery: [
      '/src/assets/images/cat_rings_1795290309895.jpg',
      '/src/assets/images/prod_sculptural_ring_1795290311106.jpg',
    ],
    swatches: [
      { id: 'gold', label: 'Gold Tone', hex: '#C6973F' },
      { id: 'two-tone', label: 'Mixed Metal', hex: '#D1BC8A' },
    ],
    description:
      'Three sculptural hammered and high-polish dome rings designed to stack across adjacent fingers or frame a single statement hand.',
    materials: [
      'Gold-toned stainless steel — waterproof & tarnish-free',
    ],
    dimensions: 'Set of 3 rings · Adjustable comfort sizing (US 6–8)',
    careNote: 'Safe for daily handwashing; avoid abrasive cleaners.',
  },
  {
    id: 'serena-ribbon-choker',
    slug: 'serena-ribbon-choker',
    name: 'Serena Lace Choker',
    priceAud: 69,
    category: 'necklaces',
    categoryLabel: 'Necklaces',
    inStock: false,
    stockCount: 0,
    image: '/src/assets/images/prod_helena_set_1795290309434.jpg',
    gallery: [
      '/src/assets/images/prod_helena_set_1795290309434.jpg',
      '/src/assets/images/hero_editorial_left_1795290310652.jpg',
    ],
    swatches: [
      { id: 'lilac', label: 'Lilac Mist', hex: '#D8C7D6' },
      { id: 'espresso', label: 'Espresso Lace', hex: '#5C4534' },
    ],
    description:
      'Delicate archival ribbon choker with removable crystal drop charm. Currently awaiting our next numbered atelier restock.',
    materials: [
      'French silk-blend ribbon',
      'Gold-toned stainless steel removable pendant',
    ],
    dimensions: 'Ribbon length 36cm + 5cm chain',
    careNote: 'Join the restock list on the product page for early dispatch access.',
  },
  {
    id: 'celeste-bangle-stack',
    slug: 'celeste-bangle-stack',
    name: 'Celeste Chain Bangles',
    priceAud: 119,
    category: 'bracelets',
    categoryLabel: 'Bracelets',
    isBackInStock: true,
    inStock: true,
    stockCount: 2,
    image: '/src/assets/images/cat_bracelets_1795290312113.jpg',
    gallery: [
      '/src/assets/images/cat_bracelets_1795290312113.jpg',
      '/src/assets/images/prod_onda_bracelet_1795290309930.jpg',
    ],
    swatches: [
      { id: 'gold', label: 'Gold Tone', hex: '#C6973F' },
      { id: 'silver', label: 'Silver Tone', hex: '#D5D7DA' },
    ],
    description:
      'Sculpted hinged wrist bangles anchored with draping fine curb chains that catch movement across the wrist and hand.',
    materials: [
      'Gold-toned stainless steel with protective clear coat',
      'Secure concealed spring-hinge closure',
    ],
    dimensions: 'Inner diameter 60mm · Fits wrists 14.5cm–17.5cm',
    careNote: 'Open gently at the concealed hinge; keep chains unknotted when stored.',
  },
  {
    id: 'lumiere-sculpted-stack',
    slug: 'lumiere-sculpted-stack',
    name: 'Lumiere Sculpted Earrings',
    priceAud: 135,
    category: 'ear-cuffs',
    categoryLabel: 'Earrings',
    inStock: true,
    stockCount: 4,
    image: '/src/assets/images/cat_ear_cuffs_1795290310241.jpg',
    gallery: [
      '/src/assets/images/cat_ear_cuffs_1795290310241.jpg',
      '/src/assets/images/prod_heaven_ear_cuff_1795290310350.jpg',
    ],
    swatches: [
      { id: 'silver', label: 'Silver Tone', hex: '#D5D7DA' },
    ],
    description:
      'An architectural multi-band sculpted design in pavé crystal arcs crafted in durable stainless steel.',
    materials: [
      'Silver-toned stainless steel',
      'Micro-set cubic zirconia stones',
    ],
    dimensions: 'Compact contoured silhouette',
    careNote: 'Place over the upper ear cartilage and gently press for a custom fit.',
  },
  {
    id: 'aurora-pearl-set',
    slug: 'aurora-pearl-set',
    name: 'Aurora Pearl Suite',
    priceAud: 189,
    category: 'sets',
    categoryLabel: 'Sets',
    inStock: true,
    stockCount: 3,
    image: '/src/assets/images/hero_editorial_right_1795290311303.jpg',
    gallery: [
      '/src/assets/images/hero_editorial_right_1795290311303.jpg',
      '/src/assets/images/prod_vivienne_earrings_1795290310345.jpg',
      '/src/assets/images/prod_juliette_necklace_1795290310775.jpg',
    ],
    swatches: [
      { id: 'gold-pearl', label: 'Gold & Baroque Pearl', hex: '#E6D6B8' },
      { id: 'silver-pearl', label: 'Silver & Freshwater Pearl', hex: '#E6E7EA' },
    ],
    description:
      'Paired luminous baroque pearl drop earrings with our Juliette station pearl chain—an effortless bridal or evening ensemble.',
    materials: [
      'Natural baroque & cultured freshwater pearls',
      'Gold or silver-toned stainless steel posts',
    ],
    dimensions: 'Necklace 42cm + 5cm · Earring drop 38mm',
    careNote: 'Presented in a double-tier Hala Jewellery keepsake box.',
  },
  {
    id: 'emeraude-collar-set',
    slug: 'emeraude-collar-set',
    name: 'Emerald Cut Pendant & Studs',
    priceAud: 159,
    category: 'necklaces',
    categoryLabel: 'Necklaces',
    inStock: true,
    stockCount: 5,
    image: '/src/assets/images/prod_kate_earrings_1795290311576.jpg',
    gallery: [
      '/src/assets/images/prod_kate_earrings_1795290311576.jpg',
      '/src/assets/images/prod_juliette_necklace_1795290310775.jpg',
    ],
    swatches: [
      { id: 'gold', label: 'Gold Tone', hex: '#C6973F' },
      { id: 'silver', label: 'Silver Tone', hex: '#D5D7DA' },
    ],
    description:
      'A sleek baguette emerald-cut crystal pendant suspended on a fine diamond-cut box chain, accompanied by matching Kate studs.',
    materials: [
      'Gold-toned stainless steel',
      'AAA step-cut cubic zirconia',
    ],
    dimensions: 'Chain 40cm + 5cm extender · Pendant 12mm × 9mm',
    careNote: 'Hypoallergenic and tarnish-protected for everyday layering.',
  },
  {
    id: 'atlas-gold-watch',
    slug: 'atlas-gold-watch',
    name: 'Atlas Petite Timepiece',
    priceAud: 215,
    category: 'watches',
    categoryLabel: 'Watches',
    inStock: true,
    stockCount: 4,
    image: '/src/assets/images/prod_onda_bracelet_1795290309930.jpg',
    gallery: [
      '/src/assets/images/prod_onda_bracelet_1795290309930.jpg',
      '/src/assets/images/cat_bracelets_1795290312113.jpg',
    ],
    swatches: [
      { id: 'gold', label: 'Gold Tone', hex: '#C6973F' },
    ],
    description:
      'A slender sculptural bracelet watch in warm gold-toned stainless steel with a minimalist champagne dial built to stack cleanly alongside delicate cuffs.',
    materials: [
      'Gold-toned stainless steel link strap',
      'Scratch-resistant mineral crystal dial',
    ],
    dimensions: 'Case 22mm · Adjustable link clasp',
    careNote: 'Water-resistant for daily handwashing; store flat in your Hala keepsake pouch.',
  },
  {
    id: 'safia-mesh-watch',
    slug: 'safia-mesh-watch',
    name: 'Safia Woven Mesh Watch',
    priceAud: 195,
    category: 'watches',
    categoryLabel: 'Watches',
    inStock: true,
    stockCount: 5,
    image: '/src/assets/images/cat_bracelets_1795290312113.jpg',
    gallery: [
      '/src/assets/images/cat_bracelets_1795290312113.jpg',
      '/src/assets/images/prod_onda_bracelet_1795290309930.jpg',
    ],
    swatches: [
      { id: 'gold', label: 'Gold Tone', hex: '#C6973F' },
    ],
    description:
      'Fluid Milanese-inspired wrist watch featuring an ultra-slim bezel and satin dial that transitions effortlessly from daywear to evening.',
    materials: [
      'Gold-toned stainless steel',
      'Japanese quartz movement',
    ],
    dimensions: 'Case 24mm · Self-adjusting mesh strap',
    careNote: 'Wipe gently with a dry microfiber cloth after wear.',
  },
  {
    id: 'fes-pearl-drop-traditional',
    slug: 'fes-pearl-drop-traditional',
    name: 'Fes Heritage Pearl Drops',
    priceAud: 139,
    category: 'traditional',
    categoryLabel: 'Traditional',
    inStock: true,
    stockCount: 4,
    image: '/src/assets/images/cat_earrings_pearl_1795290310886.jpg',
    gallery: [
      '/src/assets/images/cat_earrings_pearl_1795290310886.jpg',
      '/src/assets/images/hero_editorial_right_1795290311303.jpg',
    ],
    swatches: [
      { id: 'gold-pearl', label: 'Gold Tone & Freshwater Pearl', hex: '#E6D6B8' },
    ],
    description:
      'Inspired by classic Moroccan bridal adornment, pairing radiant cultured pearls with intricate gold-toned drop detailing made to complement caftans.',
    materials: [
      'Gold-toned stainless steel posts',
      'Hand-selected luminous freshwater pearls',
    ],
    dimensions: 'Drop length 42mm · Lightweight ceremonial silhouette',
    careNote: 'Put on after perfume and hairspray to preserve pearl luster.',
  },
  {
    id: 'marrakech-medallion-necklace',
    slug: 'marrakech-medallion-necklace',
    name: 'Marrakech Heritage Pendant',
    priceAud: 165,
    category: 'traditional',
    categoryLabel: 'Traditional',
    inStock: true,
    stockCount: 3,
    image: '/src/assets/images/prod_juliette_necklace_1795290310775.jpg',
    gallery: [
      '/src/assets/images/prod_juliette_necklace_1795290310775.jpg',
      '/src/assets/images/prod_helena_set_1795290309434.jpg',
    ],
    swatches: [
      { id: 'gold', label: 'Gold Tone', hex: '#C6973F' },
    ],
    description:
      'A refined Moroccan-inspired statement pendant balanced on fine pearl-stationed links, crafted for celebratory occasions and timeless eveningwear.',
    materials: [
      'Gold-toned stainless steel',
      'Cultured freshwater pearl accents',
    ],
    dimensions: 'Chain 45cm + 5cm extender',
    careNote: 'Presented in a lined Hala keepsake pouch.',
  },
  {
    id: 'rabat-sculpted-cuff',
    slug: 'rabat-sculpted-cuff',
    name: 'Rabat Filigree Cuff',
    priceAud: 149,
    category: 'traditional',
    categoryLabel: 'Traditional',
    inStock: true,
    stockCount: 3,
    image: '/src/assets/images/prod_sculptural_ring_1795290311106.jpg',
    gallery: [
      '/src/assets/images/prod_sculptural_ring_1795290311106.jpg',
      '/src/assets/images/cat_bracelets_1795290312113.jpg',
    ],
    swatches: [
      { id: 'gold', label: 'Gold Tone', hex: '#C6973F' },
    ],
    description:
      'Richly proportioned ceremonial wrist and hand silhouette evoking traditional Moroccan goldsmithing with a clean modern finish.',
    materials: [
      'Gold-toned stainless steel over hypoallergenic core',
      'Tarnish-resistant protective finish',
    ],
    dimensions: 'Adjustable open silhouette · Fits wrists 14cm–18cm',
    careNote: 'Adjust gently once for a tailored fit.',
  },
];

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Gabriela Zanetil',
    quote:
      "Absolutely in love with my jewellery! It's even more beautiful in person, with a delicate brilliance that catches every bit of daylight.",
    rating: 5,
    productName: 'Helena Set',
    verified: true,
  },
  {
    id: 'rev-2',
    author: 'Yana Maestri',
    quote:
      "Absolutely in love with my Hala Jewellery earrings! They're stunning, elegant, and surprisingly lightweight for all-night wear.",
    rating: 5,
    productName: 'Vivienne Earrings',
    verified: true,
  },
  {
    id: 'rev-3',
    author: 'Chloe Gibson',
    quote:
      'The most gorgeous ring! I get so many compliments whenever I wear the Solis Teardrop—the mixed metal makes styling effortless.',
    rating: 5,
    productName: 'Solis Teardrop Ring',
    verified: true,
  },
  {
    id: 'rev-4',
    author: 'Nadia Al-Mansoor',
    quote:
      'These sculpted hoops are perfection—quality feels heirloom-grade and they sit comfortably without pinching all day.',
    rating: 5,
    productName: 'Heaven Sculpted Hoop Set',
    verified: true,
  },
  {
    id: 'rev-5',
    author: 'Elena Rostova',
    quote:
      'Bought the Onda Cuff for an art opening and haven’t taken it off since. Packaging alone felt like opening a keepsake.',
    rating: 5,
    productName: 'Onda Cuff Bracelet',
    verified: true,
  },
];
