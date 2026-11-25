import { FormEvent, useState } from 'react';
import { Check } from 'lucide-react';
import { ActiveRoute, InfoPageSlug } from '../types';

interface InfoViewProps {
  slug: InfoPageSlug;
  onNavigate: (route: ActiveRoute) => void;
}

const RING_SIZES = [
  { us: '5', au: 'J½', mm: '15.7 mm', circumference: '49.3 mm' },
  { us: '6', au: 'L½', mm: '16.5 mm', circumference: '51.9 mm' },
  { us: '7', au: 'N½', mm: '17.3 mm', circumference: '54.4 mm' },
  { us: '8', au: 'P½', mm: '18.1 mm', circumference: '57.0 mm' },
  { us: '9', au: 'R½', mm: '18.9 mm', circumference: '59.5 mm' },
];

export function InfoView({ slug, onNavigate }: InfoViewProps) {
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    setContactSent(true);
  };

  return (
    <div className="max-w-[920px] mx-auto px-6 md:px-10 py-14 md:py-20">
      <button
        type="button"
        onClick={() => onNavigate({ view: 'home' })}
        className="text-[12px] tracking-[0.1em] uppercase text-[#8B7B6E] hover:text-[#4A382B] mb-8 inline-block cursor-pointer"
      >
        ← Back to Storefront
      </button>

      {slug === 'story' && (
        <article className="space-y-6">
          <h1 className="font-serif text-[38px] md:text-[44px] font-light text-[#5C4534]">
            The Story Behind Hala Jewellery
          </h1>
          <p className="text-[16px] leading-[1.85] text-[#4A382B]">
            The word &ldquo;Hala&rdquo; brings together beauty, sweetness, and
            simplicity. That&rsquo;s the feeling we want every piece to inspire.
          </p>
          <p className="text-[15px] leading-[1.85] text-[#6E5441]">
            Hala Jewellery began with a simple love of accessories. Since I was
            young, I&rsquo;ve loved delicate necklaces and dainty rings—small
            details that can transform an entire outfit. As I got older, I
            started looking for simple, elegant pieces at affordable prices. But
            I often found either beautiful pieces that were far too expensive, or
            affordable ones that lacked style.
          </p>
          <p className="text-[15px] leading-[1.85] text-[#6E5441]">
            That&rsquo;s where the idea came from: one place to find modern
            jewellery with a simple touch, alongside traditional pieces inspired
            by Moroccan heritage—all at prices everyone can afford.
          </p>
          <p className="text-[15px] leading-[1.85] text-[#6E5441]">
            I believe elegance doesn&rsquo;t have to be expensive. Confidence
            shines through in the little details: a delicate necklace you wear
            every day, or a traditional piece that adorns your caftan for
            special occasions and adds an authentic touch.
          </p>
          <p className="text-[15px] leading-[1.85] text-[#6E5441]">
            We carefully select every piece at Hala.
          </p>
          <p className="font-serif text-[22px] font-light tracking-[0.02em] text-[#5C4534] pt-2">
            Modern. Traditional. Yours.
          </p>
        </article>
      )}

      {slug === 'journal' && (
        <div className="space-y-10">
          <h1 className="font-serif text-[38px] font-light text-[#5C4534]">
            Hala Journal
          </h1>
          <div className="space-y-8 divide-y divide-[#EAE5DF]">
            <article className="pt-2 space-y-2">
              <p className="text-[12px] text-[#8B7B6E]">
                Atelier Notes · Volume 04
              </p>
              <h2 className="font-serif text-[26px] text-[#5C4534]">
                The Art of Mixing Warm Gold &amp; Cool White Rhodium
              </h2>
              <p className="text-[14px] leading-[1.75] text-[#6E5441]">
                Why two-tone silhouettes like our Solis Teardrop Ring bridge
                every watch, clasp, and silk ribbon in your wardrobe.
              </p>
            </article>
            <article className="pt-8 space-y-2">
              <p className="text-[12px] text-[#8B7B6E]">
                Styling Guide · Volume 03
              </p>
              <h2 className="font-serif text-[26px] text-[#5C4534]">
                Sculpting an Effortless Non-Pierced Ear Stack
              </h2>
              <p className="text-[14px] leading-[1.75] text-[#6E5441]">
                Pairing our Heaven Ear Cuff Set with emerald-cut studs for
                balanced vertical rhythm along the ear.
              </p>
            </article>
          </div>
        </div>
      )}

      {slug === 'ring-size-guide' && (
        <div className="space-y-8">
          <div>
            <h1 className="font-serif text-[38px] font-light text-[#5C4534]">
              Ring Size Guide
            </h1>
            <p className="mt-2 text-[14px] text-[#6E5441] leading-relaxed">
              Measure the inner diameter of a well-fitting ring or wrap a
              non-stretch paper strip snugly around the base of your finger. For
              wide sculptural bands like our Solis Ring, we recommend sizing up
              if you are between sizes.
            </p>
          </div>

          <div className="overflow-x-auto border border-[#EAE5DF]">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#EAE5DF] text-[11px] tracking-[0.12em] uppercase text-[#6E5441]">
                  <th className="py-3.5 px-5 font-medium">US Size</th>
                  <th className="py-3.5 px-5 font-medium">AU / UK Size</th>
                  <th className="py-3.5 px-5 font-medium">Inner Diameter</th>
                  <th className="py-3.5 px-5 font-medium">Circumference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE5DF] tabular-nums">
                {RING_SIZES.map((row) => (
                  <tr key={row.us}>
                    <td className="py-3.5 px-5 font-medium text-[#4A382B]">
                      {row.us}
                    </td>
                    <td className="py-3.5 px-5 text-[#6E5441]">{row.au}</td>
                    <td className="py-3.5 px-5 text-[#6E5441]">{row.mm}</td>
                    <td className="py-3.5 px-5 text-[#6E5441]">
                      {row.circumference}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {slug === 'faq' && (
        <div className="space-y-6">
          <h1 className="font-serif text-[38px] font-light text-[#5C4534]">
            Frequently Asked Questions
          </h1>
          <div className="divide-y divide-[#EAE5DF] border-t border-[#EAE5DF]">
            <div className="py-5 space-y-2">
              <h2 className="text-[15px] font-medium text-[#4A382B]">
                Are Hala Jewellery pieces hypoallergenic?
              </h2>
              <p className="text-[14px] text-[#6E5441] leading-relaxed">
                Yes. Every piece is nickel-free and crafted with 925 sterling
                silver posts or skin-safe surgical alloys under our 18k gold and
                white rhodium finishes.
              </p>
            </div>
            <div className="py-5 space-y-2">
              <h2 className="text-[15px] font-medium text-[#4A382B]">
                Do ear cuffs require piercings?
              </h2>
              <p className="text-[14px] text-[#6E5441] leading-relaxed">
                No piercings are required. Slide the cuff onto the narrowest
                upper edge of your ear and gently glide it into place.
              </p>
            </div>
            <div className="py-5 space-y-2">
              <h2 className="text-[15px] font-medium text-[#4A382B]">
                Will sold-out limited editions be restocked?
              </h2>
              <p className="text-[14px] text-[#6E5441] leading-relaxed">
                Select signature styles return in small curated drops. Visit our
                Back in Stock collection or register on any sold-out piece for
                priority dispatch emails.
              </p>
            </div>
          </div>
        </div>
      )}

      {slug === 'shipping' && (
        <div className="space-y-5">
          <h1 className="font-serif text-[38px] font-light text-[#5C4534]">
            Shipping &amp; Delivery
          </h1>
          <p className="text-[14px] leading-[1.8] text-[#6E5441]">
            Orders placed before 2:00 PM ship the same business day from our
            studio. Complimentary express delivery is automatically applied on
            orders over 650.00 MAD.
          </p>
          <p className="text-[14px] leading-[1.8] text-[#6E5441]">
            International tracked courier delivery typically arrives within 5–9
            business days across North America, Europe, and the UK.
          </p>
        </div>
      )}

      {slug === 'returns' && (
        <div className="space-y-5">
          <h1 className="font-serif text-[38px] font-light text-[#5C4534]">
            Returns &amp; Refunds
          </h1>
          <p className="text-[14px] leading-[1.8] text-[#6E5441]">
            Unworn pieces in their original Hala keepsake packaging may be
            returned within 14 days of delivery for store credit or an exchange.
            For hygiene reasons, pierced earrings can only be returned if their
            hygiene seal remains intact.
          </p>
        </div>
      )}

      {slug === 'terms' && (
        <div className="space-y-5">
          <h1 className="font-serif text-[38px] font-light text-[#5C4534]">
            Terms and Policies
          </h1>
          <p className="text-[14px] leading-[1.8] text-[#6E5441]">
            All Hala Jewellery designs, studio imagery, and small-batch craft
            specifications are protected intellectual property of Hala Jewellery
            Pty Ltd (2026). Customer order details are handled privately solely
            for order fulfillment and dispatch notifications.
          </p>
        </div>
      )}

      {slug === 'contact' && (
        <div className="space-y-6 max-w-lg">
          <h1 className="font-serif text-[38px] font-light text-[#5C4534]">
            Contact Our Atelier
          </h1>
          <p className="text-[14px] text-[#6E5441]">
            Questions regarding sizing, bridal styling, or an existing order?
            Our concierge responds within one business day.
          </p>

          {contactSent ? (
            <div className="bg-[#FAF8F5] border border-[#EAE5DF] p-6 flex items-center gap-3 text-[14px] text-[#5C4534]">
              <Check className="w-5 h-5 text-[#3D7A58] shrink-0" />
              <span>
                Thank you for reaching out. Our studio concierge will reply to
                your inbox shortly.
              </span>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-[12px] tracking-[0.08em] uppercase text-[#5C4534] mb-1.5">
                  Name
                </label>
                <input
                  required
                  type="text"
                  className="w-full border border-[#DED7CE] px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#5C4534]"
                />
              </div>
              <div>
                <label className="block text-[12px] tracking-[0.08em] uppercase text-[#5C4534] mb-1.5">
                  Email
                </label>
                <input
                  required
                  type="email"
                  className="w-full border border-[#DED7CE] px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#5C4534]"
                />
              </div>
              <div>
                <label className="block text-[12px] tracking-[0.08em] uppercase text-[#5C4534] mb-1.5">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full border border-[#DED7CE] px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#5C4534]"
                />
              </div>
              <button
                type="submit"
                className="bg-[#5C4534] hover:bg-[#4A382B] text-white text-[12px] tracking-[0.12em] uppercase px-7 py-3.5 transition-colors cursor-pointer"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
