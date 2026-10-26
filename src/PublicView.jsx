import React, { useState, useEffect, useMemo, useRef } from 'react';

const FREE_SHIPPING_THRESHOLD = 100;

const shorten = (text = '', max = 22) =>
  text.length > max ? `${text.substring(0, max)}…` : text;

const money = (value) => Number(value || 0).toFixed(2);

export default function PublicView({ products = [] }) {
  const [cart, setCart] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [bump, setBump] = useState(false);
  const [leavingId, setLeavingId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const toastId = useRef(0);
  const firstRender = useRef(true);

  /* ---------- Toasts ---------- */
  const pushToast = (message, type = 'add') => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  };

  /* ---------- Cart actions ---------- */
  const inCart = (id) => cart.some((item) => item.id === id);

  const handleCartToggle = (product) => {
    if (inCart(product.id)) {
      setCart((prev) => prev.filter((item) => item.id !== product.id));
      pushToast(`Removed “${shorten(product.title)}” from cart`, 'remove');
    } else {
      setCart((prev) => [...prev, product]);
      pushToast(`Added “${shorten(product.title)}” to cart`, 'add');
    }
  };

  const handleRemoveFromDrawer = (product) => {
    setLeavingId(product.id);
    setTimeout(() => {
      setCart((prev) => prev.filter((item) => item.id !== product.id));
      setLeavingId(null);
      pushToast(`Removed “${shorten(product.title)}” from cart`, 'remove');
    }, 280);
  };

  const handleClearCart = () => {
    setCart([]);
    pushToast('Your cart has been cleared', 'remove');
  };

  const handleCheckout = () => {
    alert('Proceeding to checkout with your curated selection!');
  };

  /* ---------- Derived data ---------- */
  const totalPrice = useMemo(
    () => cart.reduce((total, item) => total + Number(item.price || 0), 0),
    [cart]
  );

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => (p.category || 'general').toLowerCase()));
    return ['all', ...set];
  }, [products]);

  const visibleProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const cat = (p.category || 'general').toLowerCase();
      const matchesCat = activeCategory === 'all' || cat === activeCategory;
      const matchesQuery = !q || (p.title || '').toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [products, activeCategory, query]);

  const shippingLeft = Math.max(FREE_SHIPPING_THRESHOLD - totalPrice, 0);
  const shippingPct = Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100);

  /* ---------- Cart pill bump animation when count changes ---------- */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setBump(true);
    const t = setTimeout(() => setBump(false), 500);
    return () => clearTimeout(t);
  }, [cart.length]);

  /* ---------- Drawer: ESC to close + lock page scroll ---------- */
  useEffect(() => {
    if (!showCart) return;
    const onKey = (e) => e.key === 'Escape' && setShowCart(false);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [showCart]);

  const scrollToCatalog = () =>
    document.getElementById('tb-catalog')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="tb-store">
      {/* ---------------- Toasts ---------------- */}
      <div className="tb-toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`tb-toast ${t.type === 'remove' ? 'is-remove' : ''}`}>
            <span className="t-ico">{t.type === 'remove' ? '🗑️' : '✨'}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* ---------------- Floating cart pill ---------------- */}
      <button
        className={`tb-cart-pill ${bump ? 'is-bumping' : ''}`}
        onClick={() => setShowCart(true)}
        aria-label={`Open cart, ${cart.length} items`}
      >
        <span className="tb-cart-icon">🛍️</span>
        Cart
        {/* key forces the pop animation to replay on every change */}
        <span key={cart.length} className="tb-cart-count">{cart.length}</span>
      </button>

      {/* ---------------- Hero ---------------- */}
      <section className="tb-hero">
        <span className="tb-blob b1" />
        <span className="tb-blob b2" />
        <span className="tb-blob b3" />

        <div className="tb-hero-inner">
          <div>
            <div className="tb-eyebrow">
              <span className="tb-pulse-dot" />
              New season collection is live
            </div>
            <h1 className="tb-hero-title">
              Discover products
              <br />
              made to be <span className="tb-gradient-text">loved.</span>
            </h1>
            <p className="tb-hero-sub">
              Tibeb Marketplace brings together a hand-picked collection of quality
              essentials — beautifully curated, fairly priced, delivered with care.
            </p>
            <div className="tb-hero-actions">
              <button className="tb-btn tb-btn-primary" onClick={scrollToCatalog}>
                Shop the collection →
              </button>
              <button className="tb-btn tb-btn-ghost" onClick={() => setShowCart(true)}>
                View cart ({cart.length})
              </button>
            </div>
            <div className="tb-stats">
              <div className="tb-stat"><strong>{products.length}+</strong><span>Curated products</span></div>
              <div className="tb-stat"><strong>4.8★</strong><span>Average rating</span></div>
              <div className="tb-stat"><strong>24h</strong><span>Fast dispatch</span></div>
            </div>
          </div>

          <div className="tb-hero-visual" aria-hidden="true">
            <div className="tb-orb" />
            <div className="tb-glass-card c1">
              <span className="ico">🚚</span>
              <div><b>Free shipping</b><small>On orders over ${FREE_SHIPPING_THRESHOLD}</small></div>
            </div>
            <div className="tb-glass-card c2">
              <span className="ico">⭐</span>
              <div><b>Top rated</b><small>Loved by 10k+ shoppers</small></div>
            </div>
            <div className="tb-glass-card c3">
              <span className="ico">🔒</span>
              <div><b>Secure checkout</b><small>Protected payments</small></div>
            </div>
          </div>
        </div>
        <div className="tb-hero-wave" />
      </section>

      {/* ---------------- Catalog ---------------- */}
      <section className="tb-catalog" id="tb-catalog">
        <div className="tb-section-head">
          <div>
            <h2>Featured products</h2>
            <p>
              Showing {visibleProducts.length} of {products.length} items
            </p>
          </div>
          <div className="tb-tools">
            <label className="tb-search">
              <input
                type="search"
                placeholder="Search products…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search products"
              />
            </label>
            <div className="tb-chips">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`tb-chip ${activeCategory === cat ? 'is-active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="tb-grid">
          {visibleProducts.length === 0 && (
            <div className="tb-empty">
              <div className="big">🔎</div>
              <strong>No products match your search</strong>
              <p>Try a different keyword or category.</p>
            </div>
          )}

          {visibleProducts.map((item, index) => {
            const added = inCart(item.id);
            const [whole, cents = '00'] = money(item.price).split('.');
            return (
              <article
                key={item.id ?? index}
                className={`tb-card ${added ? 'in-cart' : ''}`}
                style={{ animationDelay: `${Math.min(index, 12) * 60}ms` }}
              >
                <div className="tb-media">
                  <span className="tb-tag">{item.category || 'general'}</span>
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <button
                    className={`tb-quick-add ${added ? 'is-added' : ''}`}
                    onClick={() => handleCartToggle(item)}
                    aria-label={added ? 'Remove from cart' : 'Quick add to cart'}
                  >
                    {added ? '✓' : '+'}
                  </button>
                </div>

                <div className="tb-info">
                  {item.rating && (
                    <div className="tb-rating">
                      <span className="star">★</span>
                      {item.rating.rate}
                      <span>({item.rating.count})</span>
                    </div>
                  )}
                  <h3 className="tb-title">{item.title}</h3>

                  <div className="tb-buy-row">
                    <div className="tb-price">
                      <sup>$</sup>
                      {whole}
                      <small style={{ fontSize: '0.8rem', opacity: 0.6 }}>.{cents}</small>
                    </div>
                    <button
                      className={`tb-add-btn ${added ? 'is-added' : ''}`}
                      onClick={() => handleCartToggle(item)}
                    >
                      {added ? '✓ Added' : 'Add to cart'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ---------------- Cart drawer ---------------- */}
      {showCart && (
        <div className="tb-overlay" onClick={() => setShowCart(false)}>
          <aside
            className="tb-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            <div className="tb-drawer-head">
              <h2>
                Your cart<span>({cart.length})</span>
              </h2>
              <button className="tb-close" onClick={() => setShowCart(false)} aria-label="Close cart">
                ✕
              </button>
            </div>

            {cart.length > 0 && (
              <div className={`tb-shipping ${shippingLeft === 0 ? 'is-free' : ''}`}>
                {shippingLeft === 0
                  ? '🎉 You’ve unlocked free shipping!'
                  : `Add $${money(shippingLeft)} more for free shipping`}
                <div className="tb-progress">
                  <i style={{ width: `${shippingPct}%` }} />
                </div>
              </div>
            )}

            <div className="tb-drawer-body">
              {cart.length === 0 ? (
                <div className="tb-cart-empty">
                  <span className="big">🛍️</span>
                  <strong>Your cart is empty</strong>
                  <p>Find something you love and it will show up here.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className={`tb-cart-row ${leavingId === item.id ? 'is-leaving' : ''}`}
                  >
                    <div className="tb-cart-thumb">
                      <img src={item.image} alt={item.title} />
                    </div>
                    <div className="tb-cart-meta">
                      <h4>{item.title}</h4>
                      <p>${money(item.price)}</p>
                    </div>
                    <button
                      className="tb-remove"
                      onClick={() => handleRemoveFromDrawer(item)}
                      aria-label={`Remove ${item.title}`}
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="tb-drawer-foot">
                <div className="tb-sum-row">
                  <span>Subtotal</span>
                  <span>${money(totalPrice)}</span>
                </div>
                <div className="tb-sum-row">
                  <span>Shipping</span>
                  <span>{shippingLeft === 0 ? 'Free' : 'Calculated at checkout'}</span>
                </div>
                <div className="tb-sum-row total">
                  <span>Total</span>
                  <strong>${money(totalPrice)}</strong>
                </div>
                <button className="tb-checkout" onClick={handleCheckout}>
                  Proceed to checkout →
                </button>
                <button className="tb-clear" onClick={handleClearCart}>
                  Clear cart
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}