import { FormEvent, useEffect, useState } from 'react';
import {
  Banknote,
  Check,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  X,
} from 'lucide-react';
import { ActiveRoute, CartItem, CurrencyCode } from '../types';
import { formatPrice } from '../utils/currency';
import { BrandWordmark } from './BrandWordmark';
import { JewelleryImage } from './JewelleryImage';

interface CheckoutViewProps {
  items: CartItem[];
  currency: CurrencyCode;
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onNavigate: (route: ActiveRoute) => void;
}

interface SavedCustomerInfo {
  country: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  phone: string;
}

interface ConfirmedOrder {
  orderNumber: string;
  customer: SavedCustomerInfo;
  items: CartItem[];
  subtotalAud: number;
  discountAud: number;
  totalAud: number;
  appliedPromo: string | null;
}

const SAVED_INFO_KEY = 'hala_checkout_customer_v1';
const GOOGLE_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyM0SVPvVDndKJqmeM0kClsJkp2m2pHvBMR3B5fBUg27I4eaYM_nzLjagkS7QVDijGb/exec';

const COUNTRIES = [
  'Morocco',
  'Australia',
  'France',
  'United Arab Emirates',
  'United States',
  'United Kingdom',
  'Canada',
];

function generateOrderCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 9; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function CheckoutView({
  items,
  currency,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onNavigate,
}: CheckoutViewProps) {
  const [country, setCountry] = useState('Morocco');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [saveInfo, setSaveInfo] = useState(false);

  const [phoneHelpOpen, setPhoneHelpOpen] = useState(false);
  const [shippingHelpOpen, setShippingHelpOpen] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  const [discountInput, setDiscountInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('hala_claimed_promo_v1') === 'HALA20'
        ? 'HALA20'
        : null;
    } catch {
      return null;
    }
  });
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(
    null
  );

  // Load saved customer details if previously saved
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_INFO_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SavedCustomerInfo>;
        if (parsed.country) setCountry(parsed.country);
        if (parsed.firstName) setFirstName(parsed.firstName);
        if (parsed.lastName) setLastName(parsed.lastName);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.city) setCity(parsed.city);
        if (parsed.phone) setPhone(parsed.phone);
        setSaveInfo(true);
      }
    } catch {
      // Ignore malformed storage
    }
  }, []);

  const displayItems = confirmedOrder ? confirmedOrder.items : items;
  const subtotalAud = confirmedOrder
    ? confirmedOrder.subtotalAud
    : items.reduce((sum, item) => sum + item.priceAud * item.quantity, 0);

  const discountRate =
    appliedPromo === 'HALA20' || appliedPromo === 'WELCOME20'
      ? 0.2
      : appliedPromo
        ? 0.1
        : 0;

  const discountAud = confirmedOrder
    ? confirmedOrder.discountAud
    : discountRate > 0
      ? Number((subtotalAud * discountRate).toFixed(2))
      : 0;

  const totalAud = confirmedOrder
    ? confirmedOrder.totalAud
    : Math.max(0, subtotalAud - discountAud);

  const handleApplyPromo = (e: FormEvent) => {
    e.preventDefault();
    const code = discountInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'HALA20' || code === 'WELCOME20') {
      setAppliedPromo(code);
      setPromoFeedback('20% welcome offer applied');
      setDiscountInput('');
    } else if (code === 'HALA10' || code === 'WELCOME10') {
      setAppliedPromo(code);
      setPromoFeedback('10% privilege applied');
      setDiscountInput('');
    } else {
      setPromoFeedback('Invalid code. Try HALA20 for 20% off.');
    }
  };

  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const nextErrors: Record<string, string> = {};

    if (!lastName.trim()) {
      nextErrors.lastName = 'Enter a last name';
    }
    if (!address.trim()) {
      nextErrors.address = 'Enter a delivery address';
    }
    if (!city.trim()) {
      nextErrors.city = 'Enter a city';
    }
    if (!phone.trim()) {
      nextErrors.phone = 'Enter a phone number for courier delivery';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const customerSnapshot: SavedCustomerInfo = {
      country,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      address: address.trim(),
      city: city.trim(),
      phone: phone.trim(),
    };

    try {
      if (saveInfo) {
        localStorage.setItem(SAVED_INFO_KEY, JSON.stringify(customerSnapshot));
      } else {
        localStorage.removeItem(SAVED_INFO_KEY);
      }
    } catch {
      // Ignore storage errors
    }

    const fullName = [customerSnapshot.firstName, customerSnapshot.lastName]
      .filter(Boolean)
      .join(' ');
    const fullAddress = [
      customerSnapshot.address,
      customerSnapshot.city,
      customerSnapshot.country,
    ]
      .filter(Boolean)
      .join(', ');

    setIsSubmitting(true);
    try {
      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          phone: customerSnapshot.phone,
          address: fullAddress,
        }),
      });
    } catch {
      // Proceed to confirmation screen even if the opaque no-cors request fails
    } finally {
      setIsSubmitting(false);
    }

    setConfirmedOrder({
      orderNumber: generateOrderCode(),
      customer: customerSnapshot,
      items: [...items],
      subtotalAud,
      discountAud,
      totalAud,
      appliedPromo,
    });
    onClearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const summaryContent = (
    <div className="space-y-5">
      {/* Product Items */}
      <ul className="space-y-4">
        {displayItems.map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              <div className="relative w-16 h-16 shrink-0">
                <div className="w-16 h-16 rounded-[8px] border border-[#DFDFDF] bg-white overflow-hidden">
                  {item.isGiftCard ? (
                    <div className="w-full h-full bg-[#5C4534] text-[#E3C8A8] flex items-center justify-center font-serif text-[11px] tracking-widest">
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
                <span className="absolute -top-2 -right-2 min-w-[21px] h-[21px] px-1.5 rounded-full bg-[#666666] text-white text-[11.5px] font-medium flex items-center justify-center tabular-nums shadow-xs">
                  {item.quantity}
                </span>
              </div>

              <div className="min-w-0 pt-0.5">
                <p className="text-[14px] font-medium text-[#111111] leading-snug">
                  {item.name}
                </p>
                <p className="text-[12.5px] text-[#707070] leading-snug mt-0.5">
                  {item.variantLabel}
                </p>
                {item.giftMessage && (
                  <p className="text-[11.5px] italic text-[#707070] mt-0.5 truncate max-w-[210px]">
                    “{item.giftMessage}”
                  </p>
                )}

                {!confirmedOrder && (
                  <div className="mt-2 inline-flex items-center gap-2 text-[11.5px] text-[#707070]">
                    <div className="inline-flex items-center border border-[#D9D9D9] rounded bg-white">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.id, -1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="p-1 hover:bg-[#F5F5F5] text-[#333333] cursor-pointer"
                      >
                        <Minus className="w-3 h-3" aria-hidden="true" />
                      </button>
                      <span className="px-2 tabular-nums text-[#111111]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(item.id, 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="p-1 hover:bg-[#F5F5F5] text-[#333333] cursor-pointer"
                      >
                        <Plus className="w-3 h-3" aria-hidden="true" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[#707070] hover:text-[#111111] underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            <span className="text-[14px] text-[#111111] tabular-nums shrink-0 pt-1">
              {formatPrice(item.priceAud * item.quantity, currency)}
            </span>
          </li>
        ))}
      </ul>

      {/* Discount Code Input (shown before confirmation) */}
      {!confirmedOrder && (
        <div className="space-y-2 pt-1">
          <form onSubmit={handleApplyPromo} className="flex gap-2.5">
            <input
              type="text"
              value={discountInput}
              onChange={(e) => {
                setDiscountInput(e.target.value);
                if (promoFeedback) setPromoFeedback(null);
              }}
              placeholder="Discount code"
              aria-label="Discount code"
              className="flex-1 rounded-[6px] border border-[#D9D9D9] bg-white px-3.5 py-3 text-[14px] text-[#111111] placeholder:text-[#737373] focus:outline-none focus:border-[#1773B0] focus:ring-1 focus:ring-[#1773B0]"
            />
            <button
              type="submit"
              className={`rounded-[6px] border px-4 py-3 text-[13.5px] font-medium transition-colors cursor-pointer ${
                discountInput.trim()
                  ? 'bg-[#1773B0] border-[#1773B0] text-white hover:bg-[#10599D]'
                  : 'bg-[#EDEDED] border-[#DCDCDC] text-[#707070] hover:bg-[#E4E4E4]'
              }`}
            >
              Apply
            </button>
          </form>

          {appliedPromo && (
            <div className="inline-flex items-center gap-1.5 bg-[#E8E8E8] text-[#111111] text-[12px] px-2.5 py-1 rounded">
              <Tag className="w-3.5 h-3.5 text-[#555555]" aria-hidden="true" />
              <span className="font-medium">{appliedPromo}</span>
              <button
                type="button"
                onClick={() => {
                  setAppliedPromo(null);
                  setPromoFeedback(null);
                }}
                aria-label="Remove discount code"
                className="ml-0.5 text-[#555555] hover:text-[#111111] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {promoFeedback && !appliedPromo && (
            <p className="text-[12px] text-[#707070]">{promoFeedback}</p>
          )}
        </div>
      )}

      {/* Totals Breakdown */}
      <div className="space-y-2.5 pt-2 text-[14px]">
        <div className="flex items-center justify-between text-[#333333]">
          <span>Subtotal</span>
          <span className="tabular-nums text-[#111111]">
            {formatPrice(subtotalAud, currency)}
          </span>
        </div>

        {discountAud > 0 && (
          <div className="flex items-center justify-between text-[#333333]">
            <span>
              Discount{' '}
              {(confirmedOrder?.appliedPromo || appliedPromo) && (
                <span className="text-[12px] text-[#707070]">
                  ({confirmedOrder?.appliedPromo || appliedPromo})
                </span>
              )}
            </span>
            <span className="tabular-nums text-[#1773B0]">
              -{formatPrice(discountAud, currency)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-[#333333]">
          <span className="inline-flex items-center gap-1.5 relative">
            <span>Shipping</span>
            <button
              type="button"
              onClick={() => setShippingHelpOpen((prev) => !prev)}
              aria-label="Shipping calculation details"
              className="text-[#707070] hover:text-[#111111] cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
            {shippingHelpOpen && (
              <span className="absolute left-0 top-6 z-20 w-56 rounded-[6px] bg-[#111111] text-white text-[12px] p-2.5 shadow-lg">
                Complimentary insured courier delivery is included on this
                order.
              </span>
            )}
          </span>
          <span className="text-[12.5px] font-medium text-[#111111] uppercase">
            FREE
          </span>
        </div>

        <div className="flex items-baseline justify-between pt-3 border-t border-[#E2E2E2]">
          <span className="text-[17px] font-semibold text-[#111111]">Total</span>
          <div className="flex items-baseline gap-1.5">
            {currency !== 'MAD' && (
              <span className="text-[12px] text-[#707070] font-normal">
                {currency}
              </span>
            )}
            <span className="text-[19px] font-semibold text-[#111111] tabular-nums">
              {formatPrice(totalAud, currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Empty cart fallback (when no order has just been confirmed)
  if (items.length === 0 && !confirmedOrder) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="border-b border-[#E5E5E5] bg-white">
          <div className="max-w-[1140px] mx-auto px-6 py-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate({ view: 'home' })}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Hala Jewellery home"
            >
              <BrandWordmark variant="dark" size="header" />
            </button>
            <button
              type="button"
              onClick={() =>
                onNavigate({ view: 'collection', slug: 'all' })
              }
              className="text-[13px] text-[#1773B0] hover:underline cursor-pointer"
            >
              Continue shopping
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center space-y-4">
          <ShoppingBag
            className="w-11 h-11 text-[#B0B0B0] stroke-[1.3]"
            aria-hidden="true"
          />
          <h1 className="text-[22px] font-semibold text-[#111111]">
            Your bag is empty
          </h1>
          <p className="text-[14px] text-[#707070] max-w-sm">
            Select a piece from our collection to proceed to checkout.
          </p>
          <button
            type="button"
            onClick={() => onNavigate({ view: 'collection', slug: 'all' })}
            className="mt-2 rounded-[6px] bg-[#10599D] hover:bg-[#0D4A85] text-white text-[14px] font-semibold px-6 py-3.5 transition-colors cursor-pointer"
          >
            Return to shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white lg:bg-[linear-gradient(to_right,#ffffff_54%,#f5f5f5_54%)] text-[#111111] flex flex-col">
      {/* Slim Checkout Top Bar */}
      <header className="border-b border-[#E5E5E5] bg-white">
        <div className="max-w-[1140px] mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onNavigate({ view: 'home' })}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="Hala Jewellery home"
          >
            <BrandWordmark variant="dark" size="header" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ view: 'collection', slug: 'all' })}
            className="inline-flex items-center gap-2 text-[13px] text-[#1773B0] hover:text-[#0D4A85] cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span>Continue shopping</span>
          </button>
        </div>
      </header>

      {/* Mobile Collapsible Order Summary */}
      <div className="lg:hidden bg-[#F5F5F5] border-b border-[#E5E5E5]">
        <div className="max-w-[600px] mx-auto px-5">
          <button
            type="button"
            onClick={() => setMobileSummaryOpen((prev) => !prev)}
            className="w-full py-4 flex items-center justify-between text-[14px] cursor-pointer"
            aria-expanded={mobileSummaryOpen}
          >
            <span className="inline-flex items-center gap-2 text-[#1773B0] font-medium">
              <span>
                {mobileSummaryOpen
                  ? 'Hide order summary'
                  : 'Show order summary'}
              </span>
              {mobileSummaryOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </span>
            <span className="font-semibold text-[16px] text-[#111111] tabular-nums">
              {formatPrice(totalAud, currency)}
            </span>
          </button>

          {mobileSummaryOpen && (
            <div className="pb-6 pt-2 border-t border-[#E5E5E5]">
              {summaryContent}
            </div>
          )}
        </div>
      </div>

      {/* Main Split Container */}
      <div className="flex-1 w-full max-w-[1140px] mx-auto lg:grid lg:grid-cols-12">
        {/* LEFT COLUMN: Form or Order Confirmation */}
        <div className="lg:col-span-7 bg-white px-5 sm:px-8 lg:pr-14 py-8 lg:py-10">
          {confirmedOrder ? (
            <div className="max-w-[560px] mx-auto lg:ml-auto lg:mr-0 space-y-6">
              {/* Confirmation Header */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-[#1773B0] text-[#1773B0] flex items-center justify-center shrink-0">
                  <Check className="w-6 h-6 stroke-[2]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[13px] text-[#707070]">
                    Confirmation #{confirmedOrder.orderNumber}
                  </p>
                  <h1 className="text-[22px] sm:text-[24px] font-semibold text-[#111111]">
                    Thank you,{' '}
                    {confirmedOrder.customer.firstName ||
                      confirmedOrder.customer.lastName}
                    !
                  </h1>
                </div>
              </div>

              {/* Card 1: Order Confirmed Banner */}
              <div className="rounded-[8px] border border-[#DEDEDE] bg-white p-5">
                <h2 className="text-[16px] font-semibold text-[#111111]">
                  Your order is confirmed
                </h2>
                <p className="text-[13.5px] text-[#333333] mt-1">
                  We are preparing your order for courier delivery.
                </p>
              </div>

              {/* Card 2: Order Details Grid */}
              <div className="rounded-[8px] border border-[#DEDEDE] bg-white p-5">
                <h2 className="text-[16px] font-semibold text-[#111111] mb-4">
                  Order details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[13.5px]">
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-[#111111] mb-1">
                        Shipping address
                      </p>
                      <div className="text-[#333333] space-y-0.5 leading-snug">
                        <p>
                          {[
                            confirmedOrder.customer.firstName,
                            confirmedOrder.customer.lastName,
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        </p>
                        <p>{confirmedOrder.customer.address}</p>
                        <p>{confirmedOrder.customer.city}</p>
                        <p>{confirmedOrder.customer.country}</p>
                        <p>{confirmedOrder.customer.phone}</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold text-[#111111] mb-1">
                        Shipping method
                      </p>
                      <p className="text-[#333333]">Free shipping</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-[#111111] mb-1.5">
                        Payment method
                      </p>
                      <div className="space-y-1.5">
                        <span className="inline-flex items-center justify-center px-2 py-1 rounded border border-[#D4D4D4] bg-[#FAFAFA] text-[#555555]">
                          <Banknote className="w-4 h-4" aria-hidden="true" />
                        </span>
                        <p className="text-[#333333]">
                          Cash on Delivery ·{' '}
                          <span className="tabular-nums">
                            {formatPrice(confirmedOrder.totalAud, currency)}
                            {currency !== 'MAD' ? ` ${currency}` : ''}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="font-semibold text-[#111111] mb-1">
                        Billing address
                      </p>
                      <div className="text-[#333333] space-y-0.5 leading-snug">
                        <p>
                          {[
                            confirmedOrder.customer.firstName,
                            confirmedOrder.customer.lastName,
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        </p>
                        <p>{confirmedOrder.customer.address}</p>
                        <p>{confirmedOrder.customer.city}</p>
                        <p>{confirmedOrder.customer.country}</p>
                        <p>{confirmedOrder.customer.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Help & Return Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <p className="text-[13px] text-[#707070]">
                  Need help?{' '}
                  <button
                    type="button"
                    onClick={() =>
                      onNavigate({ view: 'info', slug: 'contact' })
                    }
                    className="text-[#1773B0] hover:underline cursor-pointer"
                  >
                    Contact us
                  </button>
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setConfirmedOrder(null);
                    onNavigate({ view: 'home' });
                  }}
                  className="rounded-[6px] bg-[#10599D] hover:bg-[#0D4A85] text-white text-[14px] font-semibold px-6 py-4 transition-colors cursor-pointer"
                >
                  Return to shop
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmitOrder}
              noValidate
              className="max-w-[560px] mx-auto lg:ml-auto lg:mr-0 space-y-7"
            >
              {/* Delivery Section */}
              <section className="space-y-3">
                <div>
                  <h1 className="text-[20px] font-semibold text-[#111111]">
                    Delivery
                  </h1>
                  <p className="text-[13px] text-[#707070] mt-1 leading-snug">
                    This address will also be used as the billing address for
                    this order.
                  </p>
                </div>

                {/* Country / Region Stacked Select */}
                <div className="relative rounded-[6px] border border-[#D9D9D9] bg-white px-3.5 pt-2 pb-2 focus-within:border-[#1773B0] focus-within:ring-1 focus-within:ring-[#1773B0]">
                  <label
                    htmlFor="checkout-country"
                    className="block text-[11px] text-[#707070] leading-none mb-1"
                  >
                    Country/Region
                  </label>
                  <select
                    id="checkout-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full appearance-none bg-transparent text-[14px] text-[#111111] pr-6 focus:outline-none cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="w-4 h-4 text-[#707070] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                </div>

                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name (optional)"
                    aria-label="First name (optional)"
                    className="w-full rounded-[6px] border border-[#D9D9D9] bg-white px-3.5 py-3.5 text-[14px] text-[#111111] placeholder:text-[#737373] focus:outline-none focus:border-[#1773B0] focus:ring-1 focus:ring-[#1773B0]"
                  />

                  <div>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (errors.lastName) {
                          setErrors((prev) => ({ ...prev, lastName: '' }));
                        }
                      }}
                      placeholder="Last name"
                      aria-label="Last name"
                      className={`w-full rounded-[6px] border bg-white px-3.5 py-3.5 text-[14px] text-[#111111] placeholder:text-[#737373] focus:outline-none focus:ring-1 ${
                        errors.lastName
                          ? 'border-[#D92D20] focus:border-[#D92D20] focus:ring-[#D92D20]'
                          : 'border-[#D9D9D9] focus:border-[#1773B0] focus:ring-[#1773B0]'
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-[12px] text-[#D92D20]">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) {
                        setErrors((prev) => ({ ...prev, address: '' }));
                      }
                    }}
                    placeholder="Address"
                    aria-label="Address"
                    className={`w-full rounded-[6px] border bg-white px-3.5 py-3.5 text-[14px] text-[#111111] placeholder:text-[#737373] focus:outline-none focus:ring-1 ${
                      errors.address
                        ? 'border-[#D92D20] focus:border-[#D92D20] focus:ring-[#D92D20]'
                        : 'border-[#D9D9D9] focus:border-[#1773B0] focus:ring-[#1773B0]'
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-[12px] text-[#D92D20]">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (errors.city) {
                        setErrors((prev) => ({ ...prev, city: '' }));
                      }
                    }}
                    placeholder="City"
                    aria-label="City"
                    className={`w-full rounded-[6px] border bg-white px-3.5 py-3.5 text-[14px] text-[#111111] placeholder:text-[#737373] focus:outline-none focus:ring-1 ${
                      errors.city
                        ? 'border-[#D92D20] focus:border-[#D92D20] focus:ring-[#D92D20]'
                        : 'border-[#D9D9D9] focus:border-[#1773B0] focus:ring-[#1773B0]'
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-[12px] text-[#D92D20]">
                      {errors.city}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) {
                        setErrors((prev) => ({ ...prev, phone: '' }));
                      }
                    }}
                    placeholder="Phone"
                    aria-label="Phone"
                    className={`w-full rounded-[6px] border bg-white px-3.5 py-3.5 pr-10 text-[14px] text-[#111111] placeholder:text-[#737373] focus:outline-none focus:ring-1 ${
                      errors.phone
                        ? 'border-[#D92D20] focus:border-[#D92D20] focus:ring-[#D92D20]'
                        : 'border-[#D9D9D9] focus:border-[#1773B0] focus:ring-[#1773B0]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setPhoneHelpOpen((prev) => !prev)}
                    aria-label="Phone info"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#111111] cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                  {phoneHelpOpen && (
                    <div className="mt-1.5 text-[12px] text-[#555555]">
                      In case our courier needs to reach you before delivery.
                    </div>
                  )}
                  {errors.phone && (
                    <p className="mt-1 text-[12px] text-[#D92D20]">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <label className="inline-flex items-center gap-2.5 cursor-pointer select-none pt-0.5">
                  <input
                    type="checkbox"
                    checked={saveInfo}
                    onChange={(e) => setSaveInfo(e.target.checked)}
                    className="w-4 h-4 rounded border-[#D9D9D9] accent-[#1773B0] cursor-pointer"
                  />
                  <span className="text-[13.5px] text-[#111111]">
                    Save my information for a faster checkout
                  </span>
                </label>
              </section>

              {/* Shipping Method Section */}
              <section className="space-y-3">
                <h2 className="text-[16px] font-semibold text-[#111111]">
                  Shipping method
                </h2>
                <div className="rounded-[6px] border border-[#1773B0] bg-[#F2F7FC] px-4 py-3.5 flex items-center justify-between text-[14px]">
                  <span className="text-[#111111]">Free shipping</span>
                  <span className="font-semibold text-[#111111] uppercase">
                    FREE
                  </span>
                </div>
              </section>

              {/* Payment Section */}
              <section className="space-y-3">
                <div>
                  <h2 className="text-[20px] font-semibold text-[#111111]">
                    Payment
                  </h2>
                  <p className="text-[13px] text-[#707070] mt-1 leading-snug">
                    Your payment method’s billing address must match your
                    shipping address. All transactions are secure and encrypted.
                  </p>
                </div>

                <div className="rounded-[6px] border border-[#1773B0] overflow-hidden">
                  <div className="bg-[#F2F7FC] px-4 py-3.5 border-b border-[#1773B0]/30 text-[14px] font-medium text-[#111111]">
                    Cash on Delivery
                  </div>
                  <div className="bg-[#F5F5F5] px-4 py-4 text-[13.5px] text-[#222222] leading-relaxed">
                    Payment will be collected upon delivery. Our courier will
                    contact you beforehand to arrange delivery.
                  </div>
                </div>
              </section>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-[6px] bg-[#10599D] hover:bg-[#0D4A85] disabled:opacity-70 text-white text-[15px] font-semibold py-4 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Completing order...' : 'Complete order'}
              </button>

              {/* Terms Footer Link */}
              <div className="pt-2 border-t border-[#EAEAEA]">
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'info', slug: 'terms' })}
                  className="text-[13px] text-[#1773B0] underline hover:text-[#0D4A85] cursor-pointer"
                >
                  Terms and policies
                </button>
              </div>
            </form>
          )}
        </div>

        {/* RIGHT COLUMN: Sticky Order Summary (Desktop) */}
        <aside className="hidden lg:block lg:col-span-5 bg-[#F5F5F5] border-l border-[#E5E5E5] pl-10 pr-8 py-10">
          <div className="sticky top-8 max-w-[400px]">{summaryContent}</div>
        </aside>
      </div>
    </div>
  );
}
