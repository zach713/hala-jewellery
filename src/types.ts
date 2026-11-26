export type CurrencyCode = 'MAD' | 'USD' | 'EUR' | 'GBP';

export type CategorySlug =
  | 'all'
  | 'new-this-season'
  | 'back-in-stock'
  | 'ear-cuffs'
  | 'sets'
  | 'earrings'
  | 'necklaces'
  | 'rings'
  | 'bracelets'
  | 'watches'
  | 'traditional';

export type InfoPageSlug =
  | 'story'
  | 'journal'
  | 'faq'
  | 'ring-size-guide'
  | 'shipping'
  | 'returns'
  | 'contact'
  | 'terms';

export interface ProductSwatch {
  id: string;
  label: string;
  hex: string;
  image?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  priceAud: number;
  category: Exclude<CategorySlug, 'all' | 'new-this-season' | 'back-in-stock'>;
  categoryLabel: string;
  isNewSeason?: boolean;
  isBackInStock?: boolean;
  inStock: boolean;
  stockCount?: number;
  image: string;
  gallery: string[];
  swatches?: ProductSwatch[];
  description: string;
  materials: string[];
  dimensions: string;
  careNote: string;
}

export interface CategoryTile {
  slug: Exclude<CategorySlug, 'all' | 'new-this-season' | 'back-in-stock'>;
  title: string;
  subtitle: string;
  image: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  priceAud: number;
  variantLabel: string;
  image: string;
  quantity: number;
  isGiftCard?: boolean;
  giftMessage?: string;
}

export interface CustomerReview {
  id: string;
  author: string;
  quote: string;
  rating: number;
  productName: string;
  verified: boolean;
}

export type ActiveRoute =
  | { view: 'home' }
  | { view: 'collection'; slug: CategorySlug }
  | { view: 'product'; productId: string }
  | { view: 'gift-card' }
  | { view: 'checkout' }
  | { view: 'info'; slug: InfoPageSlug };
