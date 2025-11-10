import React from 'react';
import type { CartItem } from '../App';

type Props = {
  isOpen: boolean;
  items: CartItem[];
  total: number;
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
};

const CartDrawer: React.FC<Props> = ({ isOpen, items, total, onClose, onUpdateQuantity, onRemove }) => {
  return (
    <aside
      role="dialog"
      aria-label="Shopping cart"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: 'opacity 200ms ease',
        opacity: isOpen ? 1 : 0,
        background: 'rgba(15, 23, 42, 0.45)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <div
        style={{
          width: 'min(420px, 100%)',
          background: '#ffffff',
          height: '100%',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 250ms ease',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem 1.5rem',
          gap: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Your Cart</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem' }}>
            ×
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.length === 0 ? (
            <p style={{ color: '#6b7280' }}>Your cart is empty. Add a pre-roll to get started.</p>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  borderBottom: '1px solid rgba(209, 213, 219, 0.4)',
                  paddingBottom: '1rem'
                }}
              >
                <strong>{item.name}</strong>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <label>
                    Qty:
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={event => onUpdateQuantity(item.id, Number(event.target.value))}
                      style={{
                        marginLeft: '0.5rem',
                        width: '72px',
                        borderRadius: '0.75rem',
                        padding: '0.35rem 0.5rem'
                      }}
                    />
                  </label>
                  <button
                    onClick={() => onRemove(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="primary-button" disabled={items.length === 0}>
            Checkout (Coming Soon)
          </button>
        </div>
      </div>
    </aside>
  );
};

export default CartDrawer;
