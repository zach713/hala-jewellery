import { useState } from 'react';
import { Gift, ShoppingBag } from 'lucide-react';
import { CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';
import { BrandWordmark } from './BrandWordmark';

interface GiftCardViewProps {
  currency: CurrencyCode;
  onAddGiftCard: (amountAud: number, message: string) => void;
}

const AMOUNTS_AUD = [50, 100, 150, 200, 300];

export function GiftCardView({ currency, onAddGiftCard }: GiftCardViewProps) {
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [message, setMessage] = useState('');

  return (
    <div className="max-w-[1160px] mx-auto px-6 md:px-12 py-14 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Minimalist Luxury Digital Card Preview */}
        <div className="lg:col-span-6">
          <div className="aspect-[16/10] w-full bg-gradient-to-br from-[#6E5746] via-[#5C4534] to-[#463325] text-white p-8 md:p-10 flex flex-col justify-between shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <BrandWordmark variant="light" size="card" />
                <p className="mt-2.5 text-[11px] tracking-[0.18em] uppercase text-white/70">
                  Digital Gift Card
                </p>
              </div>
              <Gift className="w-6 h-6 text-[#E3C8A8] stroke-[1.25]" aria-hidden="true" />
            </div>

            <div className="flex items-end justify-between">
              <p className="text-[13px] text-white/80 max-w-[260px] italic font-serif text-lg">
                {message.trim()
                  ? `“${message.trim()}”`
                  : '“Modern Touch. Moroccan Soul.”'}
              </p>
              <span className="font-serif text-[32px] tabular-nums text-[#E3C8A8]">
                {formatPrice(selectedAmount, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Configurator */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <h1 className="font-serif text-[36px] font-light text-[#5C4534]">
              Hala Digital Gift Card
            </h1>
            <p className="mt-2 text-[20px] text-[#5C4534] tabular-nums">
              {formatPrice(selectedAmount, currency)}
            </p>
            <p className="mt-3 text-[14px] text-[#6E5441] leading-relaxed">
              Give the freedom to choose a signature piece. Delivered instantly
              via email with a personal note and zero expiration fees.
            </p>
          </div>

          <div>
            <p className="text-[12px] tracking-[0.12em] uppercase text-[#5C4534] mb-3">
              Select Denomination
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
              {AMOUNTS_AUD.map((amt) => {
                const active = amt === selectedAmount;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSelectedAmount(amt)}
                    className={`py-3 text-[13px] tabular-nums border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#5C4534] text-white border-[#5C4534]'
                        : 'bg-white text-[#4A382B] border-[#DED7CE] hover:border-[#5C4534]'
                    }`}
                  >
                    {formatPrice(amt, currency)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="gift-message"
              className="block text-[12px] tracking-[0.12em] uppercase text-[#5C4534] mb-2"
            >
              Personal Note (Optional)
            </label>
            <textarea
              id="gift-message"
              rows={3}
              maxLength={140}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a warm note for your recipient..."
              className="w-full border border-[#DED7CE] p-3 text-[13px] text-[#4A382B] focus:outline-none focus:border-[#5C4534]"
            />
          </div>

          <button
            type="button"
            onClick={() => onAddGiftCard(selectedAmount, message.trim())}
            className="w-full bg-[#6E5746] hover:bg-[#5C4534] text-white text-[12px] tracking-[0.14em] uppercase py-4 px-6 flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span>ADD GIFT CARD TO BAG</span>
          </button>
        </div>
      </div>
    </div>
  );
}
