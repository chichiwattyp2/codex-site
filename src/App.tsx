import React, { useMemo, useState } from 'react';
import products from './data/products';
import strains from './data/strains';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import Concierge from './components/Concierge';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const addToCart = (id: string) => {
    setCart(current => {
      const product = products.find(p => p.id === id);
      if (!product) {
        return current;
      }

      const existing = current.find(item => item.id === id);
      if (existing) {
        return current.map(item =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...current,
        {
          id,
          name: product.name,
          price: product.price,
          quantity: 1
        }
      ];
    });
    setCartOpen(true);
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart(current =>
      current
        .map(item => (item.id === id ? { ...item, quantity } : item))
        .filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCart(current => current.filter(item => item.id !== id));
  };

  return (
    <>
      <nav>
        <div className="container inner">
          <div style={{ fontWeight: 800, fontSize: '1.35rem' }}>Lifted Leaf Co.</div>
          <ul>
            <li>
              <a href="#store">Shop</a>
            </li>
            <li>
              <a href="#concierge">Concierge</a>
            </li>
            <li>
              <a href="#ethos">Our Ethos</a>
            </li>
          </ul>
          <button className="primary-button" onClick={() => setCartOpen(true)}>
            View Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
        </div>
      </nav>

      <header className="container hero">
        <div>
          <span className="tag">New</span>
          <h1>Crafted Pre-Rolls, Guided by Mood.</h1>
          <p>
            Lifted Leaf Co. pairs premium, slow-cured pre-rolls with an AI concierge that
            reads your vibe and recommends the perfect strain from our curated library.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#store" className="primary-button">
              Shop the Collection
            </a>
            <a
              href="#concierge"
              className="primary-button"
              style={{
                background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                color: 'white',
                boxShadow: '0 10px 25px rgba(99, 102, 241, 0.25)'
              }}
            >
              Meet the Concierge
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glow" />
          <img
            src="https://images.unsplash.com/photo-1524592714635-7e75b0f79ff9?auto=format&fit=crop&w=900&q=80"
            alt="Pre-roll collection"
          />
        </div>
      </header>

      <main>
        <section id="store" className="section">
          <div className="container">
            <h2 className="section-title">Limited Batch Pre-Rolls</h2>
            <p className="section-subtitle">
              Sustainably grown, terpene-forward strains crafted by independent cultivators.
              Filtered with ceramic tips for a clean burn and layered with natural botanicals.
            </p>

            <div className="product-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} onAdd={() => addToCart(product.id)} />
              ))}
            </div>
          </div>
        </section>

        <section id="concierge" className="section" style={{ background: '#ecfeff' }}>
          <div className="container">
            <h2 className="section-title">AI Mood Concierge</h2>
            <p className="section-subtitle">
              Activate your camera to let our concierge read your current mood. It blends facial
              sentiment, your intentions, and our knowledge base to match you with a strain that
              complements your vibe.
            </p>

            <Concierge strains={strains} onAddToCart={addToCart} />
          </div>
        </section>

        <section id="ethos" className="section">
          <div className="container gradient-card">
            <h3>Our Ethos</h3>
            <p>
              We believe in mindful, plant-based elevation. Every Lifted Leaf pre-roll is crafted
              with regenerative farming practices, sun-grown flower, and cold-cured terpenes. Our
              concierge never stores images—it simply reads the moment and forgets, ensuring your
              privacy while guiding you to a tailored ritual.
            </p>
          </div>
        </section>
      </main>

      <footer>
        <div className="container inner">
          <strong>Lifted Leaf Co.</strong>
          <span>Premium pre-rolls | Responsible enjoyment | Crafted in small batches</span>
          <small>© {new Date().getFullYear()} Lifted Leaf Collective. All rights reserved.</small>
        </div>
      </footer>

      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        total={total}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
      />
    </>
  );
};

export default App;
