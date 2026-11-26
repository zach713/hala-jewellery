import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { PRODUCTS } from '../data/catalog';
import { ActiveRoute, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';
import { JewelleryImage } from './JewelleryImage';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyCode;
  onNavigate: (route: ActiveRoute) => void;
}

export function SearchOverlay({
  isOpen,
  onClose,
  currency,
  onNavigate,
}: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS.slice(0, 4);
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Search Hala Jewellery"
    >
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />

      <div className="relative bg-white border-b border-[#EAE5DF] shadow-xl z-10">
        <div className="max-w-[1100px] mx-auto px-6 py-6">
          <div className="flex items-center gap-3 border-b border-[#5C4534] pb-3">
            <Search className="w-5 h-5 text-[#6E5441]" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search necklaces, earrings, rings, bracelets, watches..."
              className="flex-1 text-[16px] text-[#4A382B] placeholder:text-[#9E8F83] focus:outline-none"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="p-1.5 text-[#6E5441] hover:text-[#4A382B] cursor-pointer"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-6">
            <p className="text-[11px] tracking-[0.12em] uppercase text-[#8B7B6E] mb-4">
              {query.trim()
                ? `${results.length} ${results.length === 1 ? 'RESULT' : 'RESULTS'}`
                : 'POPULAR PIECES'}
            </p>

            {results.length === 0 ? (
              <p className="py-8 text-[14px] text-[#6E5441]">
                No pieces found matching “{query}”.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 pb-2">
                {results.slice(0, 4).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onNavigate({ view: 'product', productId: item.id });
                      onClose();
                    }}
                    className="text-left group cursor-pointer"
                  >
                    <div className="aspect-square border border-[#EAE5DF] overflow-hidden bg-white">
                      <JewelleryImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="mt-2 text-[13px] text-[#4A382B] truncate">
                      {item.name}
                    </p>
                    <p className="text-[12px] text-[#6E5441] tabular-nums">
                      {formatPrice(item.priceAud, currency)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
