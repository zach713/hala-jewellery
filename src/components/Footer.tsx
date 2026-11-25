import { FormEvent, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { ActiveRoute } from '../types';
import { BrandWordmark } from './BrandWordmark';

interface FooterProps {
  onNavigate: (route: ActiveRoute) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg('');
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#7A6352] text-white">
      <div className="max-w-[1380px] mx-auto px-6 md:px-12 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <button
              type="button"
              onClick={() => onNavigate({ view: 'home' })}
              aria-label="Hala Jewellery home"
              className="text-left cursor-pointer"
            >
              <BrandWordmark variant="light" size="footer" />
            </button>
            <div className="flex items-center gap-4 pt-1">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Hala Jewellery on Facebook"
                className="text-white hover:opacity-75 transition-opacity"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-[18px] h-[18px] fill-current"
                  aria-hidden="true"
                >
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 5.002 3.657 9.147 8.438 9.898v-7.002H7.898v-2.896h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.896h-2.33v7.002C18.343 21.164 22 17.019 22 12.017 22 6.484 17.522 2 12 2Z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Hala Jewellery on Instagram"
                className="text-white hover:opacity-75 transition-opacity"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-[18px] h-[18px]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="18" height="18" x="3" y="3" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
                </svg>
              </a>

              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Hala Jewellery on TikTok"
                className="text-white hover:opacity-75 transition-opacity"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-[17px] h-[17px] fill-current"
                  aria-hidden="true"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .594.046.878.136V9.4a6.33 6.33 0 0 0-.878-.062 6.34 6.34 0 1 0 6.34 6.34V8.81a8.24 8.24 0 0 0 4.77 1.52V6.9a4.86 4.86 0 0 1-1-.21Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* About Us */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[11px] tracking-[0.14em] uppercase text-white/80 font-medium">
              ABOUT US
            </h4>
            <ul className="space-y-2.5 text-[13px] text-white/95">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ view: 'info', slug: 'story' })}
                  className="hover:text-white/70 transition-colors cursor-pointer"
                >
                  The Story Behind
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-5 space-y-3.5">
            <h4 className="text-[11px] tracking-[0.14em] uppercase text-white/90 font-medium">
              GET EARLY ACCESS TO NEW DROPS
            </h4>

            {subscribed ? (
              <div className="bg-white/15 border border-white/25 rounded-full px-5 py-3 flex items-center gap-2.5 text-[13px] text-white">
                <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>You are on the list for early drop access.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Email address"
                    aria-label="Email address for early drop access"
                    className="w-full bg-white text-[#4A382B] placeholder:text-[#8E7D70] text-[13px] rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-white/60"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to early drop access"
                    className="absolute right-2 p-2 text-[#4A382B] hover:text-[#7A6352] transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
                {errorMsg && (
                  <p className="mt-2 text-[12px] text-[#F5D6CE] pl-3">
                    {errorMsg}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-white/80">
          <p>&copy; 2026 Hala Jewellery</p>
          <button
            type="button"
            onClick={() => onNavigate({ view: 'info', slug: 'terms' })}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Terms and Policies
          </button>
        </div>
      </div>
    </footer>
  );
}
