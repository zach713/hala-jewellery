import { FormEvent, useEffect, useState } from 'react';
import { Check, Copy, X } from 'lucide-react';
import { JewelleryImage } from './JewelleryImage';

const POPUP_SEEN_KEY = 'hala_welcome_popup_seen_v1';
const CLAIMED_PROMO_KEY = 'hala_claimed_promo_v1';
const PROMO_CODE = 'HALA20';

export function WelcomeDiscountPopup() {
  const [modalOpen, setModalOpen] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [claimed, setClaimed] = useState(() => {
    try {
      return localStorage.getItem(CLAIMED_PROMO_KEY) === PROMO_CODE;
    } catch {
      return false;
    }
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const alreadySeen = sessionStorage.getItem(POPUP_SEEN_KEY);
      if (alreadySeen) return;

      const timer = window.setTimeout(() => {
        setModalOpen(true);
        try {
          sessionStorage.setItem(POPUP_SEEN_KEY, '1');
        } catch {
          // Ignore storage restrictions
        }
      }, 900);

      return () => window.clearTimeout(timer);
    } catch {
      return undefined;
    }
  }, []);

  const handleCloseModal = () => {
    setModalOpen(false);
    try {
      sessionStorage.setItem(POPUP_SEEN_KEY, '1');
    } catch {
      // Ignore storage restrictions
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg('');
    setClaimed(true);
    try {
      localStorage.setItem(CLAIMED_PROMO_KEY, PROMO_CODE);
    } catch {
      // Ignore storage restrictions
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* Floating Vertical 20% Off Side Tab */}
      {tabVisible && !modalOpen && (
        <div className="fixed right-0 top-[26%] z-30 flex flex-col items-center bg-[#F5EFE8]/95 backdrop-blur-xs border border-r-0 border-[#E5DDD4] rounded-l-[14px] shadow-[0_8px_24px_rgba(74,56,43,0.12)] overflow-hidden">
          <button
            type="button"
            onClick={() => setTabVisible(false)}
            aria-label="Dismiss 20% off offer tab"
            className="w-full pt-3 pb-1.5 px-3 flex items-center justify-center text-[#3D2E23] hover:text-[#111111] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[1.75]" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            aria-label="Open 20% off welcome offer"
            className="px-3.5 pt-2 pb-5 [writing-mode:vertical-rl] rotate-180 font-serif text-[17px] tracking-[0.03em] text-[#5C4534] hover:text-[#2D221B] transition-colors cursor-pointer"
          >
            20% off
          </button>
        </div>
      )}

      {/* Welcome 20% Off Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="hala-welcome-offer-title"
        >
          <div
            className="fixed inset-0"
            onClick={handleCloseModal}
            aria-hidden="true"
          />

          <div className="relative z-10 w-full max-w-[780px] rounded-[16px] bg-[#F5EFE8] overflow-hidden shadow-[0_24px_60px_rgba(34,26,20,0.28)] grid grid-cols-1 md:grid-cols-2">
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              aria-label="Close welcome offer"
              className="absolute top-4 right-4 z-20 p-1.5 text-[#221A14] hover:opacity-70 transition-opacity cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[1.75]" aria-hidden="true" />
            </button>

            {/* Left Editorial Photo */}
            <div className="relative h-[220px] md:h-auto md:min-h-[430px] overflow-hidden">
              <JewelleryImage
                src="/src/assets/images/cat_ear_cuffs_1795290310241.jpg"
                alt="Hala Jewellery sculpted gold ear cuffs and rings editorial"
                loading="eager"
                className="w-full h-full object-cover object-center"
              />
              <div
                aria-hidden="true"
                className="hidden md:block absolute inset-y-0 right-0 w-16 bg-gradient-to-r from-transparent to-[#F5EFE8]"
              />
            </div>

            {/* Right Offer Form / Code Reveal */}
            <div className="px-7 py-9 sm:px-9 md:py-12 flex flex-col justify-center text-center">
              <h2
                id="hala-welcome-offer-title"
                className="font-serif text-[28px] sm:text-[32px] font-light text-[#5C4534] leading-tight"
              >
                Welcome to Hala Jewellery
              </h2>

              {claimed ? (
                <div className="mt-4 space-y-5">
                  <p className="text-[14.5px] leading-[1.6] text-[#5C4534]">
                    Your exclusive{' '}
                    <strong className="font-medium">20% off</strong> welcome
                    code is unlocked and ready at checkout.
                  </p>

                  <div className="bg-white border border-[#DED7CE] rounded-[8px] px-4 py-3 flex items-center justify-between gap-3">
                    <span className="font-mono text-[16px] font-semibold tracking-[0.14em] text-[#4A382B]">
                      {PROMO_CODE}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-1.5 text-[12px] tracking-[0.08em] uppercase text-[#5C4534] hover:text-[#2D221B] font-medium cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-full bg-[#6E5746] hover:bg-[#5C4534] text-white rounded-[8px] py-3.5 text-[12.5px] tracking-[0.14em] uppercase font-medium transition-colors cursor-pointer"
                  >
                    SHOP WITH 20% OFF
                  </button>
                </div>
              ) : (
                <>
                  <p className="mt-3 text-[14.5px] leading-[1.6] text-[#5C4534]">
                    Join our list for early access to new collections and enjoy{' '}
                    20% off your first order.
                  </p>

                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="mt-6 space-y-3"
                  >
                    <div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        placeholder="Email"
                        aria-label="Email address for 20% off"
                        className="w-full bg-white border border-[#DED7CE] rounded-[8px] px-4 py-3.5 text-[14px] text-[#4A382B] placeholder:text-[#8E7D70] focus:outline-none focus:border-[#5C4534]"
                      />
                      {errorMsg && (
                        <p className="mt-1.5 text-[12px] text-[#9E3B2B] text-left">
                          {errorMsg}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#6E5746] hover:bg-[#5C4534] text-white rounded-[8px] py-3.5 text-[12.5px] tracking-[0.14em] uppercase font-medium transition-colors cursor-pointer"
                    >
                      CLAIM 20% OFF
                    </button>
                  </form>

                  <p className="mt-4 text-[11.5px] leading-relaxed text-[#6E5441]">
                    By signing up, you agree to receive emails from Hala
                    Jewellery. Unsubscribe anytime.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
