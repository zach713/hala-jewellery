import { useEffect, useState } from 'react';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { CollectionView } from './components/CollectionView';
import { Footer } from './components/Footer';
import { GiftCardView } from './components/GiftCardView';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { InfoView } from './components/InfoView';
import { ProductDetailView } from './components/ProductDetailView';
import { SearchOverlay } from './components/SearchOverlay';
import { WelcomeDiscountPopup } from './components/WelcomeDiscountPopup';
import { ActiveRoute, CartItem, CurrencyCode, Product } from './types';
import { formatPrice } from './utils/currency';

const CART_STORAGE_KEY = 'hala_jewellery_bag_v1';

export default function App() {
  const [route, setRoute] = useState<ActiveRoute>({ view: 'home' });
  const [currency, setCurrency] = useState<CurrencyCode>('MAD');
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [discountPopupOpen, setDiscountPopupOpen] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [cartItems]);

  const handleNavigate = (nextRoute: ActiveRoute) => {
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product, variantLabel: string) => {
    const itemId = `${product.id}::${variantLabel}`;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing) {
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          name: product.name,
          priceAud: product.priceAud,
          variantLabel,
          image: product.image,
          quantity: 1,
        },
      ];
    });
    setCartOpen(false);
    handleNavigate({ view: 'checkout' });
  };

  const handleAddGiftCard = (amountAud: number, message: string) => {
    const itemId = `gift-card-${amountAud}-${Date.now()}`;
    setCartItems((prev) => [
      ...prev,
      {
        id: itemId,
        productId: 'gift-card',
        name: 'Hala Digital Gift Card',
        priceAud: amountAud,
        variantLabel: `${formatPrice(amountAud, currency)} Digital Voucher`,
        image: '',
        quantity: 1,
        isGiftCard: true,
        giftMessage: message || undefined,
      },
    ]);
    setCartOpen(false);
    handleNavigate({ view: 'checkout' });
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isCheckoutView = route.view === 'checkout';

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#4A382B]">
      {!isCheckoutView && (
        <Header
          activeRoute={route}
          currency={currency}
          onChangeCurrency={setCurrency}
          cartCount={cartCount}
          onNavigate={handleNavigate}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenCart={() => setCartOpen(true)}
        />
      )}

      <main className="flex-1">
        {route.view === 'home' && (
          <HomeView
            currency={currency}
            onNavigate={handleNavigate}
            onQuickAdd={handleAddToCart}
            onOpenDiscountPopup={() => setDiscountPopupOpen(true)}
          />
        )}

        {route.view === 'collection' && (
          <CollectionView
            slug={route.slug}
            currency={currency}
            onNavigate={handleNavigate}
            onQuickAdd={handleAddToCart}
          />
        )}

        {route.view === 'product' && (
          <ProductDetailView
            productId={route.productId}
            currency={currency}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
          />
        )}

        {route.view === 'gift-card' && (
          <GiftCardView
            currency={currency}
            onAddGiftCard={handleAddGiftCard}
          />
        )}

        {route.view === 'checkout' && (
          <CheckoutView
            items={cartItems}
            currency={currency}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onNavigate={handleNavigate}
          />
        )}

        {route.view === 'info' && (
          <InfoView slug={route.slug} onNavigate={handleNavigate} />
        )}
      </main>

      {!isCheckoutView && <Footer onNavigate={handleNavigate} />}

      {!isCheckoutView && (
        <WelcomeDiscountPopup
          isOpen={discountPopupOpen}
          onOpen={() => setDiscountPopupOpen(true)}
          onClose={() => setDiscountPopupOpen(false)}
        />
      )}

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        currency={currency}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => handleNavigate({ view: 'checkout' })}
      />

      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        currency={currency}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
