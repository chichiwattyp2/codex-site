import React from 'react';
import type { Product } from '../data/products';

type Props = {
  product: Product;
  onAdd: () => void;
};

const ProductCard: React.FC<Props> = ({ product, onAdd }) => {
  return (
    <article className="product-card" aria-label={`Product ${product.name}`}>
      <div>
        <div className="tag">{product.category}</div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span className="price">${product.price.toFixed(2)}</span>
        <button className="primary-button" onClick={onAdd}>
          Add to Cart
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
