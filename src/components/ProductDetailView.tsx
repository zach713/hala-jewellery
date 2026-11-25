import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import { PRODUCTS } from '../data/catalog';
import { ActiveRoute, CurrencyCode, Product } from '../types';
import { formatInstallment, formatPrice } from '../utils/currency';
import { JewelleryImage } from './JewelleryImage';
import { ProductCard } from './ProductCard';

interface ProductDetailViewProps {
  productId: string;
  currency: CurrencyCode;
  onNavigate: (route: ActiveRoute) => void;
  onAddToCart: (product: Product, variantLabel: string) => void;
}

export function ProductDetailView({
  productId,
  currency,
  onNavigate,
  onAddToCart,
}: ProductDetailViewProps) {
  const product = PRODUCTS.find((p) => p.id === productId) ?? PRODUCTS[0];

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySent, setNotifySent] = useState(false);

  const mainCtaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveImageIdx(0);
    setNotifySent(false);
    setNotifyEmail('');
  }, [productId]);

  useEffect(() => {
    const target = mainCtaRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [productId]);

  const gallery = product.gallery.length > 0 ? product.gallery : [product.image];
  const variantLabel = product.swatches?.[0]?.label ?? 'Signature Finish';

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  const handleNotifySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!notifyEmail.trim() || !notifyEmail.includes('@')) return;
    setNotifySent(true);
    setNotifyEmail('');
  };

  return (
    <div className="pb-24">
      <div className="max-w-[1380px] mx-auto px-6 md:px-12 pt-8 md:pt-12">
        {/* Breadcrumb */}
        <nav
          className="mb-8 flex items-center gap-2 text-[12px] text-[#8B7B6E]"
          aria-label="Breadcrumb"
        >
          <button
            type="button"
            onClick={() => onNavigate({ view: 'home' })}
            className="hover:text-[#4A382B] cursor-pointer"
          >
            Home
          </button>
          <span aria-hidden="true">/</span>
          <button
            type="button"
            onClick={() =>
              onNavigate({ view: 'collection', slug: product.category })
            }
            className="hover:text-[#4A382B] cursor-pointer"
          >
            {product.categoryLabel}
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-[#4A382B]">{product.name}</span>
        </nav>

        {/* Main 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: Main Image Showcase */}
          <div className="lg:col-span-7">
            <div className="relative w-full aspect-square bg-white border border-[#EAE5DF] overflow-hidden">
              <JewelleryImage
                src={gallery[activeImageIdx]}
                alt={product.name}
                loading="eager"
                className="w-full h-full object-cover"
              />

              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIdx(
                        (prev) => (prev - 1 + gallery.length) % gallery.length
                      )
                    }
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/85 hover:bg-white flex items-center justify-center text-[#4A382B] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIdx((prev) => (prev + 1) % gallery.length)
                    }
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/85 hover:bg-white flex items-center justify-center text-[#4A382B] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5 stroke-[1.5]" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="text-center lg:text-left">
              <h1 className="font-serif text-[34px] md:text-[40px] font-light text-[#5C4534] leading-tight">
                {product.name}
              </h1>

              <p className="mt-2 text-[22px] font-normal text-[#5C4534] tabular-nums">
                {formatPrice(product.priceAud, currency)}
              </p>

              <p className="mt-1 text-[12px] text-[#8B7B6E]">
                Shipping calculated at checkout.
              </p>

              <p className="mt-4 text-[13px] text-[#5C4534]">
                or 4 interest-free payments of{' '}
                <strong className="font-medium tabular-nums">
                  {formatInstallment(product.priceAud, currency)}
                </strong>{' '}
                with <span className="font-medium underline underline-offset-2">Hala Pay</span>
              </p>
            </div>

            {/* Main Add to Cart CTA */}
            <div ref={mainCtaRef} className="mt-7 space-y-3">
              {product.inStock ? (
                <>
                  <button
                    type="button"
                    onClick={() => onAddToCart(product, variantLabel)}
                    className="w-full bg-[#6E5746] hover:bg-[#5C4534] text-white text-[12px] tracking-[0.14em] uppercase py-4 px-6 flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                    <span>ADD TO CART</span>
                  </button>

                  {product.stockCount !== undefined && product.stockCount <= 5 && (
                    <p className="flex items-center justify-center lg:justify-start gap-2 text-[13px] text-[#6E5441]">
                      <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>
                        Only {product.stockCount} items left in stock!
                      </span>
                    </p>
                  )}
                </>
              ) : (
                <div className="bg-[#FAF8F5] border border-[#EAE5DF] p-5 space-y-3">
                  <p className="text-[12px] tracking-[0.1em] uppercase text-[#6E5441] font-medium">
                    Currently Sold Out
                  </p>
                  {notifySent ? (
                    <p className="flex items-center gap-2 text-[13px] text-[#5C4534]">
                      <Check className="w-4 h-4" aria-hidden="true" />
                      <span>
                        We will email you as soon as this batch returns.
                      </span>
                    </p>
                  ) : (
                    <form onSubmit={handleNotifySubmit} className="flex gap-2">
                      <input
                        type="email"
                        required
                        value={notifyEmail}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        placeholder="Enter email for restock alert"
                        className="flex-1 bg-white border border-[#DED7CE] px-3 py-2 text-[13px] text-[#4A382B] focus:outline-none focus:border-[#5C4534]"
                      />
                      <button
                        type="submit"
                        className="bg-[#5C4534] text-white text-[11px] tracking-[0.12em] uppercase px-4 py-2 hover:bg-[#4A382B] cursor-pointer"
                      >
                        Notify Me
                      </button>
                    </form>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Related Pieces */}
        <section className="mt-24 pt-14 border-t border-[#EAE5DF]">
          <h2 className="font-serif text-[28px] font-light text-[#5C4534] mb-8">
            YOU MAY ALSO LIKE
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                currency={currency}
                onSelectProduct={(id) =>
                  onNavigate({ view: 'product', productId: id })
                }
                onQuickAdd={onAddToCart}
              />
            ))}
          </div>
        </section>
      </div>

      {/* Sticky Bottom Quick-Buy Bar */}
      {showStickyBar && product.inStock && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-[680px] bg-white border border-[#EAE5DF] shadow-[0_12px_36px_rgba(74,56,43,0.14)] px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 border border-[#EAE5DF] shrink-0 overflow-hidden">
              <JewelleryImage
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[14px] text-[#4A382B] truncate">
                {product.name}
              </p>
              <p className="text-[12px] text-[#8B7B6E] truncate">
                {variantLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <span className="text-[14px] text-[#5C4534] tabular-nums hidden sm:inline">
              {formatPrice(product.priceAud, currency)}
            </span>
            <button
              type="button"
              onClick={() => onAddToCart(product, variantLabel)}
              className="bg-[#D2C5B8] hover:bg-[#5C4534] text-[#4A382B] hover:text-white text-[11px] tracking-[0.12em] uppercase px-5 py-3 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
              <span>ADD TO CART</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
