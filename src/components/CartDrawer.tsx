import { FormEvent, useState } from 'react';
import {
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { CartItem, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';
import { JewelleryImage } from './JewelleryImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onProceedToCheckout?: () => void;
}

type DrawerStep = 'bag' | 'checkout' | 'confirmed';

export function CartDrawer({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}: CartDrawerProps) {
  const [step, setStep] = useState<DrawerStep>('bag');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string;
    totalAud: number;
    email: string;
  } | null>(null);

  if (!isOpen) return null;

  const subtotalAud = items.reduce(
    (sum, item) => sum + item.priceAud * item.quantity,
    0
  );
  const freeShippingThresholdAud = 100;
  const remainingAud = Math.max(0, freeShippingThresholdAud - subtotalAud);
  const shippingAud = subtotalAud >= freeShippingThresholdAud || subtotalAud === 0 ? 0 : 12;
  const totalAud = subtotalAud + shippingAud;
  const progressPct = Math.min(
    100,
    (subtotalAud / freeShippingThresholdAud) * 100
  );

  const handlePlaceOrder = (e: FormEvent) => {
    e.preventDefault();
    const orderNum = `HL-${Math.floor(1040 + Math.random() * 8900)}`;
    setConfirmedOrder({
      orderNumber: orderNum,
      totalAud,
      email: customerEmail,
    });
    onClearCart();
    setStep('confirmed');
  };

  const handleCloseAndReset = () => {
    if (step === 'confirmed') {
      setStep('bag');
      setConfirmedOrder(null);
      setCustomerName('');
      setCustomerEmail('');
      setShippingAddress('');
      setPostalCode('');
    } else if (step === 'checkout') {
      setStep('bag');
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/35 transition-opacity"
        onClick={handleCloseAndReset}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-[440px] bg-white h-full flex flex-col shadow-2xl z-10">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#EAE5DF] flex items-center justify-between">
          <h2 className="font-serif text-[24px] font-light text-[#5C4534]">
            {step === 'bag' && 'Your Bag'}
            {step === 'checkout' && 'Checkout'}
            {step === 'confirmed' && 'Order Confirmed'}
          </h2>
          <button
            type="button"
            onClick={handleCloseAndReset}
            aria-label="Close shopping bag"
            className="p-1.5 text-[#6E5441] hover:text-[#4A382B] cursor-pointer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Free shipping progress bar (Bag step) */}
        {step === 'bag' && items.length > 0 && (
          <div className="px-6 py-3.5 bg-[#FAF8F5] border-b border-[#EAE5DF]">
            <p className="text-[12px] text-[#5C4534] text-center mb-2">
              {remainingAud === 0 ? (
                <span>You have unlocked complimentary express shipping.</span>
              ) : (
                <span>
                  Add{' '}
                  <strong className="font-medium tabular-nums">
                    {formatPrice(remainingAud, currency)}
                  </strong>{' '}
                  more for complimentary shipping
                </span>
              )}
            </p>
            <div className="w-full h-1 bg-[#E5DDD4] overflow-hidden">
              <div
                className="h-full bg-[#5C4534] transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === 'confirmed' && confirmedOrder ? (
            <div className="py-10 text-center space-y-4">
              <CheckCircle2
                className="w-11 h-11 text-[#3D7A58] mx-auto stroke-[1.5]"
                aria-hidden="true"
              />
              <h3 className="font-serif text-[26px] text-[#5C4534]">
                Order #{confirmedOrder.orderNumber} Confirmed
              </h3>
              <p className="text-[13px] text-[#6E5441] leading-relaxed max-w-xs mx-auto">
                Preparing your pieces for dispatch. A receipt for{' '}
                <strong className="font-medium tabular-nums">
                  {formatPrice(confirmedOrder.totalAud, currency)}
                </strong>{' '}
                has been sent to{' '}
                <span className="text-[#4A382B]">{confirmedOrder.email}</span>.
              </p>
              <button
                type="button"
                onClick={handleCloseAndReset}
                className="mt-4 bg-[#5C4534] text-white text-[12px] tracking-[0.12em] uppercase px-7 py-3.5 hover:bg-[#4A382B] transition-colors cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          ) : step === 'checkout' ? (
            <form
              id="hala-checkout-form"
              onSubmit={handlePlaceOrder}
              className="space-y-4"
            >
              <button
                type="button"
                onClick={() => setStep('bag')}
                className="text-[12px] text-[#8B7B6E] hover:text-[#4A382B] mb-2 cursor-pointer"
              >
                ← Back to Bag
              </button>

              <div>
                <label className="block text-[11px] tracking-[0.1em] uppercase text-[#5C4534] mb-1.5">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Elena Rostova"
                  className="w-full border border-[#DED7CE] px-3.5 py-2.5 text-[13px] text-[#4A382B] focus:outline-none focus:border-[#5C4534]"
                />
              </div>

              <div>
                <label className="block text-[11px] tracking-[0.1em] uppercase text-[#5C4534] mb-1.5">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="elena@example.com"
                  className="w-full border border-[#DED7CE] px-3.5 py-2.5 text-[13px] text-[#4A382B] focus:outline-none focus:border-[#5C4534]"
                />
              </div>

              <div>
                <label className="block text-[11px] tracking-[0.1em] uppercase text-[#5C4534] mb-1.5">
                  Delivery Address
                </label>
                <input
                  required
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="48 Crown St, Surry Hills NSW"
                  className="w-full border border-[#DED7CE] px-3.5 py-2.5 text-[13px] text-[#4A382B] focus:outline-none focus:border-[#5C4534]"
                />
              </div>

              <div>
                <label className="block text-[11px] tracking-[0.1em] uppercase text-[#5C4534] mb-1.5">
                  Postal Code
                </label>
                <input
                  required
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="2010"
                  className="w-full border border-[#DED7CE] px-3.5 py-2.5 text-[13px] text-[#4A382B] focus:outline-none focus:border-[#5C4534]"
                />
              </div>

              <div className="pt-2">
                <p className="text-[11px] tracking-[0.1em] uppercase text-[#5C4534] mb-2">
                  Payment Method
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2.5 px-3 text-[12px] border text-center cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-[#5C4534] bg-[#FAF8F5] text-[#4A382B] font-medium'
                        : 'border-[#DED7CE] text-[#6E5441]'
                    }`}
                  >
                    Card / Hala Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-2.5 px-3 text-[12px] border text-center cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-[#5C4534] bg-[#FAF8F5] text-[#4A382B] font-medium'
                        : 'border-[#DED7CE] text-[#6E5441]'
                    }`}
                  >
                    Cash on Delivery
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EAE5DF] space-y-2 text-[13px]">
                <div className="flex justify-between text-[#6E5441]">
                  <span>Subtotal</span>
                  <span className="tabular-nums">
                    {formatPrice(subtotalAud, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-[#6E5441]">
                  <span>Shipping</span>
                  <span className="tabular-nums">
                    {shippingAud === 0
                      ? 'Complimentary'
                      : formatPrice(shippingAud, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-[15px] font-medium text-[#4A382B] pt-2 border-t border-[#EAE5DF]">
                  <span>Total</span>
                  <span className="tabular-nums">
                    {formatPrice(totalAud, currency)}
                  </span>
                </div>
              </div>
            </form>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
              <ShoppingBag
                className="w-10 h-10 text-[#C2B7AC] stroke-[1.2]"
                aria-hidden="true"
              />
              <p className="font-serif text-[22px] text-[#5C4534]">
                Your bag is currently empty.
              </p>
              <p className="text-[13px] text-[#8B7B6E] max-w-[240px]">
                Explore our limited small-batch earrings, sculptural rings, and
                curated sets.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[#EAE5DF]">
              {items.map((item) => (
                <li key={item.id} className="py-5 first:pt-0 flex gap-4">
                  <div className="w-20 h-20 border border-[#EAE5DF] shrink-0 overflow-hidden bg-white">
                    {item.isGiftCard ? (
                      <div className="w-full h-full bg-[#5C4534] text-[#E3C8A8] flex items-center justify-center font-serif text-[12px] tracking-widest">
                        GIFT
                      </div>
                    ) : (
                      <JewelleryImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-[14px] text-[#4A382B] truncate">
                          {item.name}
                        </h3>
                        <p className="text-[12px] text-[#8B7B6E] truncate">
                          {item.variantLabel}
                        </p>
                        {item.giftMessage && (
                          <p className="mt-1 text-[11px] italic text-[#6E5441] line-clamp-1">
                            “{item.giftMessage}”
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="text-[#8B7B6E] hover:text-[#4A382B] p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#DED7CE]">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, -1)}
                          aria-label="Decrease quantity"
                          className="p-1.5 text-[#5C4534] hover:bg-[#FAF8F5] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" aria-hidden="true" />
                        </button>
                        <span className="px-3 text-[12px] tabular-nums text-[#4A382B]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, 1)}
                          aria-label="Increase quantity"
                          className="p-1.5 text-[#5C4534] hover:bg-[#FAF8F5] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </div>

                      <span className="text-[13px] text-[#4A382B] tabular-nums">
                        {formatPrice(item.priceAud * item.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer CTA */}
        {step === 'bag' && items.length > 0 && (
          <div className="px-6 py-5 border-t border-[#EAE5DF] bg-[#FAF8F5] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] tracking-[0.08em] uppercase text-[#6E5441]">
                Subtotal
              </span>
              <span className="text-[16px] font-medium text-[#4A382B] tabular-nums">
                {formatPrice(subtotalAud, currency)}
              </span>
            </div>
            <p className="text-[12px] text-[#8B7B6E]">
              Taxes and shipping calculated at checkout.
            </p>
            <button
              type="button"
              onClick={() => {
                if (onProceedToCheckout) {
                  onClose();
                  onProceedToCheckout();
                } else {
                  setStep('checkout');
                }
              }}
              className="w-full bg-[#6E5746] hover:bg-[#5C4534] text-white text-[12px] tracking-[0.14em] uppercase py-4 transition-colors cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </div>
        )}

        {step === 'checkout' && (
          <div className="px-6 py-5 border-t border-[#EAE5DF] bg-[#FAF8F5]">
            <button
              type="submit"
              form="hala-checkout-form"
              className="w-full bg-[#6E5746] hover:bg-[#5C4534] text-white text-[12px] tracking-[0.14em] uppercase py-4 transition-colors cursor-pointer"
            >
              Place Order · {formatPrice(totalAud, currency)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
