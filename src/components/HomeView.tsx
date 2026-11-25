import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Star } from 'lucide-react';
import {
  CATEGORY_TILES,
  CUSTOMER_REVIEWS,
  HERO_MEDIA,
  PRODUCTS,
} from '../data/catalog';
import { ActiveRoute, CurrencyCode, Product } from '../types';
import { JewelleryImage } from './JewelleryImage';
import { ProductCard } from './ProductCard';

interface HomeViewProps {
  currency: CurrencyCode;
  onNavigate: (route: ActiveRoute) => void;
  onQuickAdd: (product: Product, variantLabel: string) => void;
  onOpenDiscountPopup?: () => void;
}

export function HomeView({
  currency,
  onNavigate,
  onQuickAdd,
  onOpenDiscountPopup,
}: HomeViewProps) {
  const [reviewStartIndex, setReviewStartIndex] = useState(0);

  const newSeasonProducts = PRODUCTS.filter((p) => p.isNewSeason).slice(0, 4);
  const discoverProducts = PRODUCTS.slice(4, 8);

  const visibleReviews = Array.from({ length: 4 }, (_, offset) => {
    const idx = (reviewStartIndex + offset) % CUSTOMER_REVIEWS.length;
    return CUSTOMER_REVIEWS[idx];
  });

  const handlePrevReviews = () => {
    setReviewStartIndex(
      (prev) => (prev - 1 + CUSTOMER_REVIEWS.length) % CUSTOMER_REVIEWS.length
    );
  };

  const handleNextReviews = () => {
    setReviewStartIndex((prev) => (prev + 1) % CUSTOMER_REVIEWS.length);
  };

  return (
    <div>
      {/* 1. Split Editorial Hero Banner (Existing Images Preserved) */}
      <section className="relative w-full overflow-hidden bg-[#F3EFEA]">
        <div className="grid grid-cols-1 md:grid-cols-2 h-[560px] md:h-[680px] lg:h-[740px]">
          <div className="relative h-full overflow-hidden">
            <JewelleryImage
              src={HERO_MEDIA.leftImage}
              alt="Hala Jewellery silk ribbon crystal choker and gold stud earrings editorial"
              loading="eager"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="relative hidden md:block h-full overflow-hidden">
            <JewelleryImage
              src={HERO_MEDIA.rightImage}
              alt="Hala Jewellery freshwater pearl drop earrings editorial"
              loading="eager"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Subtle editorial contrast scrim for white overlay typography */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/55 pointer-events-none" />

        {/* Centered Bottom Editorial Headline + Crisp White CTA Button */}
        <div className="absolute inset-x-0 bottom-0 pb-12 md:pb-16 px-6 flex flex-col items-center text-center">
          <h1 className="font-serif text-[36px] sm:text-[46px] md:text-[56px] leading-[1.06] font-normal text-white tracking-[-0.01em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.28)] [text-wrap:balance]">
            Limited Pieces. Lasting Presence.
          </h1>
          <button
            type="button"
            onClick={() =>
              onNavigate({ view: 'collection', slug: 'new-this-season' })
            }
            className="mt-6 bg-white hover:bg-[#FAF7F2] text-[#2D221B] text-[11px] tracking-[0.18em] uppercase font-medium px-10 py-4 transition-colors shadow-sm cursor-pointer"
          >
            SHOP NOW
          </button>
        </div>
      </section>

      {/* 2. NEW THIS SEASON */}
      <section className="max-w-[1380px] mx-auto px-6 md:px-12 pt-16 md:pt-20 pb-14">
        <div className="flex items-baseline justify-between gap-4 mb-8">
          <h2 className="font-serif text-[28px] md:text-[34px] font-light tracking-[0.04em] text-[#5C4534]">
            NEW THIS SEASON
          </h2>
          <button
            type="button"
            onClick={() =>
              onNavigate({ view: 'collection', slug: 'new-this-season' })
            }
            className="text-[13px] text-[#6E5441] hover:text-[#4A382B] underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
          >
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
          {newSeasonProducts.map((product) => (
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
      </section>

      {/* 3. SHOP BY CATEGORY */}
      <section className="max-w-[1380px] mx-auto px-6 md:px-12 py-12 md:py-16">
        <h2 className="font-serif text-[28px] md:text-[34px] font-light tracking-[0.04em] text-[#5C4534] mb-8">
          SHOP BY CATEGORY
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {CATEGORY_TILES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() =>
                onNavigate({ view: 'collection', slug: cat.slug })
              }
              className="group text-center flex flex-col cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5C4534]"
            >
              <div className="w-full aspect-[3/4] overflow-hidden bg-[#F7F4F0]">
                <JewelleryImage
                  src={cat.image}
                  alt={`${cat.title} editorial collection`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <span className="mt-4 text-[13px] tracking-[0.16em] uppercase text-[#5C4534] group-hover:text-[#7A6352] transition-colors">
                {cat.title}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Editorial Brand Statement */}
      <section className="max-w-[780px] mx-auto px-6 py-14 md:py-20 text-center">
        <blockquote className="font-sans text-[18px] md:text-[22px] leading-[1.6] font-light text-[#5C4534] [text-wrap:balance]">
          &ldquo;Hala Jewellery curates limited pieces for women who use
          accessories as part of their identity. Designed to feel distinctive,
          expressive, and naturally memorable but never predictable.&rdquo;
        </blockquote>
        <button
          type="button"
          onClick={() => onNavigate({ view: 'info', slug: 'story' })}
          className="mt-6 text-[13px] tracking-[0.06em] text-[#6E5441] hover:text-[#4A382B] underline underline-offset-4 transition-colors cursor-pointer"
        >
          Meet Our Story
        </button>
      </section>

      {/* 5. DISCOVER ALL PIECES */}
      <section className="max-w-[1380px] mx-auto px-6 md:px-12 pb-16 md:pb-20">
        <div className="flex items-baseline justify-between gap-4 mb-8">
          <h2 className="font-serif text-[28px] md:text-[34px] font-light tracking-[0.04em] text-[#5C4534]">
            DISCOVER ALL PIECES
          </h2>
          <button
            type="button"
            onClick={() => onNavigate({ view: 'collection', slug: 'all' })}
            className="text-[13px] text-[#6E5441] hover:text-[#4A382B] underline underline-offset-4 transition-colors whitespace-nowrap cursor-pointer"
          >
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
          {discoverProducts.map((product) => (
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
      </section>

      {/* 6. Promotional Marquee Strip */}
      <button
        type="button"
        onClick={onOpenDiscountPopup}
        className="w-full block bg-[#6B5342] hover:bg-[#5C4534] text-white/95 py-2.5 overflow-hidden text-[12px] tracking-[0.06em] transition-colors cursor-pointer text-left"
        aria-label="Open 20% off welcome offer"
      >
        <div className="animate-marquee flex items-center gap-16 whitespace-nowrap">
          <span>Enjoy an exclusive 20% discount on all collections—for a limited time only!</span>
          <span aria-hidden="true">·</span>
          <span>Enjoy an exclusive 20% discount on all collections—for a limited time only!</span>
          <span aria-hidden="true">·</span>
          <span>Enjoy an exclusive 20% discount on all collections—for a limited time only!</span>
          <span aria-hidden="true">·</span>
          <span>Enjoy an exclusive 20% discount on all collections—for a limited time only!</span>
          <span aria-hidden="true">·</span>
        </div>
      </button>

      {/* 7. Loved by You Testimonials */}
      <section className="max-w-[1380px] mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="font-serif text-[32px] md:text-[38px] font-light text-[#5C4534]">
            Loved by You
          </h2>
          <div className="mt-2 flex items-center justify-center gap-2 text-[#6E5441]">
            <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-[#6E5441] text-[#6E5441]"
                  aria-hidden="true"
                />
              ))}
            </div>
            <span className="text-[13px] tabular-nums">5.00 ★ (16)</span>
          </div>
        </div>

        <div className="relative flex items-center gap-4">
          <button
            type="button"
            onClick={handlePrevReviews}
            aria-label="Previous customer reviews"
            className="hidden sm:flex w-10 h-10 shrink-0 items-center justify-center text-[#6E5441] hover:text-[#4A382B] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 flex-1">
            {visibleReviews.map((review) => (
              <div
                key={review.id}
                className="bg-[#F7F5F2] px-7 py-10 flex flex-col items-center justify-between text-center min-h-[260px]"
              >
                <p className="text-[13px] leading-[1.65] text-[#5C4534] line-clamp-4">
                  {review.quote}
                </p>

                <div className="mt-8 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1" aria-hidden="true">
                    {Array.from({ length: review.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="w-3.5 h-3.5 fill-[#6E5441] text-[#6E5441]"
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#5C4534]">
                    <span>{review.author}</span>
                    {review.verified && (
                      <CheckCircle2
                        className="w-3.5 h-3.5 fill-[#6E5441] text-white"
                        aria-label="Verified buyer"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleNextReviews}
            aria-label="Next customer reviews"
            className="hidden sm:flex w-10 h-10 shrink-0 items-center justify-center text-[#6E5441] hover:text-[#4A382B] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 stroke-[1.5]" aria-hidden="true" />
          </button>
        </div>

        {/* Mobile review arrows */}
        <div className="mt-6 flex sm:hidden items-center justify-center gap-6">
          <button
            type="button"
            onClick={handlePrevReviews}
            aria-label="Previous customer reviews"
            className="p-2 border border-[#EAE5DF] text-[#5C4534]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextReviews}
            aria-label="Next customer reviews"
            className="p-2 border border-[#EAE5DF] text-[#5C4534]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
