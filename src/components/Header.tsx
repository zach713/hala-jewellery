import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Menu,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react';
import { ActiveRoute, CategorySlug, CurrencyCode } from '../types';
import { CURRENCIES } from '../utils/currency';
import { BrandWordmark } from './BrandWordmark';

interface HeaderProps {
  activeRoute: ActiveRoute;
  currency: CurrencyCode;
  onChangeCurrency: (currency: CurrencyCode) => void;
  cartCount: number;
  onNavigate: (route: ActiveRoute) => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
}

const COLLECTION_SUBLINKS: { slug: CategorySlug; label: string }[] = [
  { slug: 'necklaces', label: 'NECKLACES' },
  { slug: 'rings', label: 'RINGS' },
  { slug: 'bracelets', label: 'BRACELETS' },
  { slug: 'ear-cuffs', label: 'EAR CUFFS' },
  { slug: 'sets', label: 'SETS' },
  { slug: 'earrings', label: 'EARRINGS' },
];

export function Header({
  activeRoute,
  currency,
  onChangeCurrency,
  cartCount,
  onNavigate,
  onOpenSearch,
  onOpenCart,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const collectionsRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        collectionsRef.current &&
        !collectionsRef.current.contains(e.target as Node)
      ) {
        setCollectionsOpen(false);
      }
      if (
        currencyRef.current &&
        !currencyRef.current.contains(e.target as Node)
      ) {
        setCurrencyOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const isHomeOverlay =
    activeRoute.view === 'home' &&
    !scrolled &&
    !collectionsOpen &&
    !mobileMenuOpen;

  const navigateAndClose = (route: ActiveRoute) => {
    setCollectionsOpen(false);
    setMobileMenuOpen(false);
    onNavigate(route);
  };

  const isNavActive = (slug: CategorySlug) =>
    activeRoute.view === 'collection' && activeRoute.slug === slug;

  const textTone = isHomeOverlay
    ? 'text-white hover:text-white/80'
    : 'text-[#4A382B] hover:text-[#7A6352]';

  return (
    <header
      className={`${
        activeRoute.view === 'home' ? 'fixed' : 'sticky'
      } top-0 inset-x-0 z-40 transition-colors duration-200 ${
        isHomeOverlay
          ? 'bg-gradient-to-b from-black/55 via-black/25 to-transparent'
          : 'bg-white border-b border-[#EAE5DF]'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 pt-4 pb-3">
        {/* Top Row: Left utilities — Center Grand Wordmark — Right Contact & Bag */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          {/* Left Utilities */}
          <div className="flex items-center gap-4 md:gap-5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className={`md:hidden p-1.5 -ml-1.5 cursor-pointer ${textTone}`}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={onOpenSearch}
              className={`inline-flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase transition-colors cursor-pointer whitespace-nowrap ${textTone}`}
              aria-label="Search pieces"
            >
              <Search className="w-[16px] h-[16px] stroke-[1.5]" aria-hidden="true" />
              <span className="hidden sm:inline">SEARCH</span>
            </button>
          </div>

          {/* Center Wordmark */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => navigateAndClose({ view: 'home' })}
              aria-label="Hala Jewellery home"
              className="hover:opacity-85 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
            >
              <BrandWordmark
                variant={isHomeOverlay ? 'light' : 'dark'}
                size="header"
              />
            </button>
          </div>

          {/* Right Utilities */}
          <div className="flex items-center justify-end gap-4 md:gap-6">
            <div className="relative hidden sm:block" ref={currencyRef}>
              <button
                type="button"
                onClick={() => setCurrencyOpen((prev) => !prev)}
                className={`flex items-center gap-1 text-[11px] tracking-[0.1em] py-1 cursor-pointer whitespace-nowrap ${textTone}`}
                aria-label="Select currency"
                aria-expanded={currencyOpen}
              >
                <span className="font-medium">{currency}</span>
                <ChevronDown className="w-3 h-3" aria-hidden="true" />
              </button>

              {currencyOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-white border border-[#EAE5DF] shadow-md py-1 z-50">
                  {CURRENCIES.map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        onChangeCurrency(code);
                        setCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-[12px] tracking-[0.06em] transition-colors cursor-pointer ${
                        code === currency
                          ? 'bg-[#F8F5F1] text-[#5C4534] font-medium'
                          : 'text-[#4A382B] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onOpenCart}
              className={`relative p-1 transition-colors flex items-center gap-1.5 cursor-pointer ${textTone}`}
              aria-label={`Open shopping bag (${cartCount} items)`}
            >
              <ShoppingBag className="w-[18px] h-[18px] stroke-[1.4]" aria-hidden="true" />
              {cartCount > 0 && (
                <span
                  className={`min-w-[17px] h-[17px] px-1 rounded-full text-[10px] font-medium flex items-center justify-center tabular-nums ${
                    isHomeOverlay
                      ? 'bg-white text-[#4A382B]'
                      : 'bg-[#5C4534] text-white'
                  }`}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Second Row: Centered Luxury Navigation Links */}
        <nav
          className="hidden md:flex items-center justify-center gap-7 lg:gap-9 mt-3.5 text-[11px] tracking-[0.14em] font-medium"
          aria-label="Primary navigation"
        >
          <button
            type="button"
            onClick={() =>
              navigateAndClose({ view: 'collection', slug: 'new-this-season' })
            }
            className={`whitespace-nowrap shrink-0 py-0.5 border-b transition-colors cursor-pointer ${
              isNavActive('new-this-season')
                ? isHomeOverlay
                  ? 'border-white text-white'
                  : 'border-[#5C4534] text-[#5C4534]'
                : isHomeOverlay
                  ? 'border-transparent text-white/95 hover:border-white/70'
                  : 'border-transparent text-[#4A382B] hover:border-[#7A6352]/40'
            }`}
          >
            NEW SEASON
          </button>

          <button
            type="button"
            onClick={() =>
              navigateAndClose({ view: 'collection', slug: 'all' })
            }
            className={`whitespace-nowrap shrink-0 py-0.5 border-b transition-colors cursor-pointer ${
              isNavActive('all')
                ? isHomeOverlay
                  ? 'border-white text-white'
                  : 'border-[#5C4534] text-[#5C4534]'
                : isHomeOverlay
                  ? 'border-transparent text-white/95 hover:border-white/70'
                  : 'border-transparent text-[#4A382B] hover:border-[#7A6352]/40'
            }`}
          >
            SHOP ALL
          </button>

          <div className="relative" ref={collectionsRef}>
            <button
              type="button"
              onClick={() => setCollectionsOpen((prev) => !prev)}
              aria-expanded={collectionsOpen}
              className={`whitespace-nowrap shrink-0 py-0.5 border-b transition-colors flex items-center gap-1 cursor-pointer ${
                collectionsOpen
                  ? isHomeOverlay
                    ? 'border-white text-white'
                    : 'border-[#5C4534] text-[#5C4534]'
                  : isHomeOverlay
                    ? 'border-transparent text-white/95 hover:border-white/70'
                    : 'border-transparent text-[#4A382B] hover:border-[#7A6352]/40'
              }`}
            >
              <span>COLLECTIONS</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${
                  collectionsOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              navigateAndClose({ view: 'collection', slug: 'back-in-stock' })
            }
            className={`whitespace-nowrap shrink-0 py-0.5 border-b transition-colors cursor-pointer ${
              isNavActive('back-in-stock')
                ? isHomeOverlay
                  ? 'border-white text-white'
                  : 'border-[#5C4534] text-[#5C4534]'
                : isHomeOverlay
                  ? 'border-transparent text-white/95 hover:border-white/70'
                  : 'border-transparent text-[#4A382B] hover:border-[#7A6352]/40'
            }`}
          >
            BACK IN STOCK
          </button>

          <span
            aria-hidden="true"
            className={isHomeOverlay ? 'text-white/50' : 'text-[#B5A89C]'}
          >
            •
          </span>

          <button
            type="button"
            onClick={() => navigateAndClose({ view: 'info', slug: 'story' })}
            className={`whitespace-nowrap shrink-0 font-serif text-[15px] tracking-[0.02em] font-normal py-0.5 border-b transition-colors cursor-pointer ${
              activeRoute.view === 'info' && activeRoute.slug === 'story'
                ? isHomeOverlay
                  ? 'border-white text-white'
                  : 'border-[#5C4534] text-[#5C4534]'
                : isHomeOverlay
                  ? 'border-transparent text-white hover:border-white/70'
                  : 'border-transparent text-[#4A382B] hover:border-[#7A6352]/40'
            }`}
          >
            World of Hala
          </button>
        </nav>
      </div>

      {/* Collections Sub-Strip */}
      {collectionsOpen && (
        <div className="hidden md:block bg-white border-t border-b border-[#EAE5DF] shadow-[0_8px_24px_rgba(74,56,43,0.06)]">
          <div className="max-w-[1000px] mx-auto px-10 py-4 flex items-center justify-center gap-12 flex-wrap">
            {COLLECTION_SUBLINKS.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() =>
                  navigateAndClose({ view: 'collection', slug: item.slug })
                }
                className={`text-[11px] tracking-[0.14em] transition-colors whitespace-nowrap cursor-pointer ${
                  isNavActive(item.slug)
                    ? 'text-[#5C4534] font-medium underline underline-offset-4'
                    : 'text-[#6E5441] hover:text-[#4A382B]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-b border-[#EAE5DF] px-5 py-6 space-y-5 text-[#4A382B]">
          <div className="space-y-3">
            <button
              type="button"
              onClick={() =>
                navigateAndClose({ view: 'collection', slug: 'new-this-season' })
              }
              className="block w-full text-left text-[12px] tracking-[0.14em] py-1.5"
            >
              NEW SEASON
            </button>
            <button
              type="button"
              onClick={() =>
                navigateAndClose({ view: 'collection', slug: 'all' })
              }
              className="block w-full text-left text-[12px] tracking-[0.14em] py-1.5"
            >
              SHOP ALL
            </button>
            <button
              type="button"
              onClick={() =>
                navigateAndClose({ view: 'collection', slug: 'back-in-stock' })
              }
              className="block w-full text-left text-[12px] tracking-[0.14em] py-1.5"
            >
              BACK IN STOCK
            </button>
            <button
              type="button"
              onClick={() => navigateAndClose({ view: 'info', slug: 'story' })}
              className="block w-full text-left font-serif text-[17px] py-1.5"
            >
              World of Hala
            </button>
          </div>

          <div className="pt-4 border-t border-[#EAE5DF]">
            <p className="text-[11px] tracking-[0.12em] text-[#8B7B6E] mb-2">
              COLLECTIONS
            </p>
            <div className="grid grid-cols-2 gap-2">
              {COLLECTION_SUBLINKS.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() =>
                    navigateAndClose({ view: 'collection', slug: item.slug })
                  }
                  className="text-left text-[12px] tracking-[0.1em] text-[#5C4534] py-1.5"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#EAE5DF] flex items-center justify-between">
            <span className="text-[12px] tracking-[0.08em] text-[#8B7B6E]">
              CURRENCY
            </span>
            <div className="flex items-center gap-2">
              {CURRENCIES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => onChangeCurrency(code)}
                  className={`px-2 py-1 text-[11px] border ${
                    code === currency
                      ? 'border-[#5C4534] bg-[#5C4534] text-white'
                      : 'border-[#EAE5DF] text-[#4A382B]'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
