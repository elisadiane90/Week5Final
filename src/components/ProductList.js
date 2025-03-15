import React, { useState } from 'react';
import { products } from '../Data';

const ProductList = ({ addToCart }) => {
  const [selectedOptions, setSelectedOptions] = useState({});

  const handleOptionChange = (productId, key, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [key]: value },
    }));
  };

  return (
    <div className="product-list">
      <h2>Products</h2>
      <div className="products">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price.toFixed(2)}</p>

            {/* Shirt Size Selection (Dropdown) */}
            {product.category === 'shirt' && (
              <div>
                <label>Select Size:</label>
                <select
                  value={selectedOptions[product.id]?.size || ''}
                  onChange={(e) => handleOptionChange(product.id, 'size', e.target.value)}
                >
                  <option value="">Choose a size</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                  <option value="XXXL">XXXL</option>
                </select>
              </div>
            )}

            {/* Phone Model Selection (Dropdown) */}
            {product.name === 'EZTech Phone Case' && (
              <div>
                <label>Select Phone Model:</label>
                <select
                  value={selectedOptions[product.id]?.model || ''}
                  onChange={(e) => handleOptionChange(product.id, 'model', e.target.value)}
                >
                  <option value="">Choose a model</option>
                  <option value="iPhone 14">iPhone 14</option>
                  <option value="iPhone 15">iPhone 15</option>
                  <option value="iPhone 16">iPhone 16</option>
                  <option value="Samsung S22">Samsung S22</option>
                  <option value="Samsung S23">Samsung S23</option>
                  <option value="Samsung S24">Samsung S24</option>
                </select>
              </div>
            )}

            <button
              onClick={() => addToCart(product, selectedOptions[product.id]?.size, selectedOptions[product.id]?.model)}
              disabled={
                (product.category === 'shirt' && !selectedOptions[product.id]?.size) ||
                (product.name === 'EZTech Phone Case' && !selectedOptions[product.id]?.model)
              }
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;