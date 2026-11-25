import { Plus } from 'lucide-react';
import { CurrencyCode, Product } from '../types';
import { formatPrice } from '../utils/currency';
import { JewelleryImage } from './JewelleryImage';

interface ProductCardProps {
  product: Product;
  currency: CurrencyCode;
  onSelectProduct: (productId: string) => void;
  onQuickAdd: (product: Product, variantLabel: string) => void;
}

export function ProductCard({
  product,
  currency,
  onSelectProduct,
  onQuickAdd,
}: ProductCardProps) {
  const variantLabel = product.swatches?.[0]?.label ?? 'Signature Finish';

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-square w-full bg-white border border-[#EAE5DF] overflow-hidden transition-shadow duration-200 group-hover:shadow-[0_6px_24px_rgba(74,56,43,0.06)]">
        <button
          type="button"
          onClick={() => onSelectProduct(product.id)}
          className="w-full h-full block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5C4534] cursor-pointer"
          aria-label={`View ${product.name}`}
        >
          <JewelleryImage
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </button>

        {!product.inStock && (
          <span className="absolute top-3 left-3 bg-[#6E5746] text-white text-[11px] font-medium tracking-[0.08em] uppercase px-2.5 py-1 pointer-events-none">
            SOLD OUT
          </span>
        )}

        {product.inStock && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product, variantLabel);
            }}
            className="absolute bottom-3 right-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 focus-visible:opacity-100 focus-visible:translate-y-0 transition-all duration-200 bg-white/95 hover:bg-[#5C4534] text-[#4A382B] hover:text-white border border-[#DED7CE] px-3 py-1.5 text-[11px] font-medium tracking-[0.08em] uppercase flex items-center gap-1.5 shadow-sm cursor-pointer"
            aria-label={`Quick add ${product.name} to bag`}
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Quick Add</span>
          </button>
        )}
      </div>

      <div className="pt-3">
        <button
          type="button"
          onClick={() => onSelectProduct(product.id)}
          className="text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5C4534] cursor-pointer min-w-0 w-full"
        >
          <h3 className="font-sans text-[14px] font-normal text-[#4A382B] group-hover:text-[#7A6352] transition-colors truncate">
            {product.name}
          </h3>
          <p className="mt-0.5 text-[13px] font-normal text-[#6E5441] tabular-nums">
            {formatPrice(product.priceAud, currency)}
          </p>
        </button>
      </div>
    </article>
  );
}
