import { useMemo, useState } from 'react';
import { ChevronDown, LayoutGrid, Grid2X2 } from 'lucide-react';
import { COLLECTION_META, PRODUCTS } from '../data/catalog';
import { ActiveRoute, CategorySlug, CurrencyCode, Product } from '../types';
import { ProductCard } from './ProductCard';

interface CollectionViewProps {
  slug: CategorySlug;
  currency: CurrencyCode;
  onNavigate: (route: ActiveRoute) => void;
  onQuickAdd: (product: Product, variantLabel: string) => void;
}

type AvailabilityFilter = 'all' | 'in-stock' | 'sold-out';
type PriceFilter = 'all' | 'under-90' | '90-120' | 'over-120';
type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

export function CollectionView({
  slug,
  currency,
  onNavigate,
  onQuickAdd,
}: CollectionViewProps) {
  const [availability, setAvailability] = useState<AvailabilityFilter>('all');
  const [priceRange, setPriceRange] = useState<PriceFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [gridCols, setGridCols] = useState<4 | 2>(4);

  const meta = COLLECTION_META[slug] ?? COLLECTION_META.all;

  const baseProducts = useMemo(() => {
    if (slug === 'all') return PRODUCTS;
    if (slug === 'new-this-season') {
      return PRODUCTS.filter((p) => p.isNewSeason);
    }
    if (slug === 'back-in-stock') {
      return PRODUCTS.filter((p) => p.isBackInStock);
    }
    return PRODUCTS.filter((p) => p.category === slug);
  }, [slug]);

  const filteredProducts = useMemo(() => {
    let list = [...baseProducts];

    if (availability === 'in-stock') {
      list = list.filter((p) => p.inStock);
    } else if (availability === 'sold-out') {
      list = list.filter((p) => !p.inStock);
    }

    if (priceRange === 'under-90') {
      list = list.filter((p) => p.priceAud < 90);
    } else if (priceRange === '90-120') {
      list = list.filter((p) => p.priceAud >= 90 && p.priceAud <= 120);
    } else if (priceRange === 'over-120') {
      list = list.filter((p) => p.priceAud > 120);
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.priceAud - b.priceAud);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.priceAud - a.priceAud);
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [baseProducts, availability, priceRange, sortBy]);

  const resetFilters = () => {
    setAvailability('all');
    setPriceRange('all');
    setSortBy('featured');
  };

  return (
    <div className="max-w-[1380px] mx-auto px-6 md:px-12 pt-12 md:pt-16 pb-24">
      {/* Collection Title & Subtitle */}
      <div className="text-center max-w-2xl mx-auto pb-12">
        <h1 className="font-serif text-[34px] md:text-[42px] font-light tracking-[0.06em] text-[#5C4534]">
          {meta.title}
        </h1>
        <p className="mt-2.5 text-[14px] text-[#6E5441] leading-relaxed">
          {meta.subtitle}
        </p>
      </div>

      {/* Filter & Sort Toolbar (matches collection screenshots) */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-[#EAE5DF]/80 mb-8">
        <div className="flex flex-wrap items-center gap-6">
          {/* Availability Filter */}
          <div className="relative inline-flex items-center">
            <select
              aria-label="Filter by availability"
              value={availability}
              onChange={(e) =>
                setAvailability(e.target.value as AvailabilityFilter)
              }
              className="appearance-none bg-transparent pr-5 py-1 text-[12px] tracking-[0.1em] uppercase text-[#5C4534] cursor-pointer focus:outline-none"
            >
              <option value="all">AVAILABILITY</option>
              <option value="in-stock">IN STOCK ONLY</option>
              <option value="sold-out">SOLD OUT</option>
            </select>
            <ChevronDown
              className="w-3.5 h-3.5 text-[#6E5441] pointer-events-none -ml-4"
              aria-hidden="true"
            />
          </div>

          {/* Price Filter */}
          <div className="relative inline-flex items-center">
            <select
              aria-label="Filter by price"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value as PriceFilter)}
              className="appearance-none bg-transparent pr-5 py-1 text-[12px] tracking-[0.1em] uppercase text-[#5C4534] cursor-pointer focus:outline-none"
            >
              <option value="all">PRICE</option>
              <option value="under-90">UNDER $90</option>
              <option value="90-120">$90 – $120</option>
              <option value="over-120">OVER $120</option>
            </select>
            <ChevronDown
              className="w-3.5 h-3.5 text-[#6E5441] pointer-events-none -ml-4"
              aria-hidden="true"
            />
          </div>

          {(availability !== 'all' || priceRange !== 'all') && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[11px] tracking-[0.08em] uppercase text-[#8B7B6E] hover:text-[#4A382B] underline underline-offset-4 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-6 ml-auto">
          <span className="text-[12px] tracking-[0.1em] uppercase text-[#8B7B6E] tabular-nums">
            {filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? 'ITEM' : 'ITEMS'}
          </span>

          <div className="relative inline-flex items-center">
            <select
              aria-label="Sort products"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-transparent pr-5 py-1 text-[12px] tracking-[0.1em] uppercase text-[#5C4534] cursor-pointer focus:outline-none"
            >
              <option value="featured">SORT</option>
              <option value="price-asc">PRICE: LOW TO HIGH</option>
              <option value="price-desc">PRICE: HIGH TO LOW</option>
              <option value="name-asc">ALPHABETICAL</option>
            </select>
            <ChevronDown
              className="w-3.5 h-3.5 text-[#6E5441] pointer-events-none -ml-4"
              aria-hidden="true"
            />
          </div>

          <div
            className="hidden md:flex items-center gap-1.5"
            role="group"
            aria-label="Grid density"
          >
            <button
              type="button"
              onClick={() => setGridCols(4)}
              aria-label="4-column grid"
              aria-pressed={gridCols === 4}
              className={`p-1.5 transition-colors cursor-pointer ${
                gridCols === 4
                  ? 'bg-[#F4F0EB] text-[#4A382B]'
                  : 'text-[#8B7B6E] hover:text-[#4A382B]'
              }`}
            >
              <Grid2X2 className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setGridCols(2)}
              aria-label="2-column grid"
              aria-pressed={gridCols === 2}
              className={`p-1.5 transition-colors cursor-pointer ${
                gridCols === 2
                  ? 'bg-[#F4F0EB] text-[#4A382B]'
                  : 'text-[#8B7B6E] hover:text-[#4A382B]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <p className="font-serif text-[24px] text-[#5C4534]">
            No pieces match those filters.
          </p>
          <p className="text-[13px] text-[#8B7B6E]">
            Try clearing your availability or price selection to explore the full
            collection.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-2 inline-block bg-[#5C4534] text-white text-[12px] tracking-[0.12em] uppercase px-6 py-3 hover:bg-[#4A382B] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          className={`grid gap-6 md:gap-7 ${
            gridCols === 2
              ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              onSelectProduct={(id) =>
                onNavigate({ view: 'product', productId: id })
              }
              onQuickAdd={onQuickAdd}
            />
          ))}
        </div>
      )}
    </div>
  );
}
