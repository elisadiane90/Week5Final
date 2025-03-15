import React from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ cartItems, removeFromCart, updateQuantity }) => {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart">
        <h2>Your Cart</h2>
        <p>Your cart is empty.</p>
        <Link to="/">
          <button>Continue Shopping</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cartItems.map((item) => (
        <div key={`${item.id}-${item.shirtSize || ''}-${item.phoneModel || ''}`} className="cart-item">
          <div>
            <h3>{item.name}</h3>
            <p>${item.price}</p>
            {item.shirtSize && <p>Size: {item.shirtSize}</p>}
            {item.phoneModel && <p>Model: {item.phoneModel}</p>}
          </div>
          <div className="cart-item-actions">
            <div className="quantity-controls">
              <button 
                className="quantity-btn" 
                onClick={() => updateQuantity(item.id, item.shirtSize, item.phoneModel, item.quantity - 1)}
                disabled={item.quantity <= 1}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="quantity-display">{item.quantity}</span>
              <button 
                className="quantity-btn" 
                onClick={() => updateQuantity(item.id, item.shirtSize, item.phoneModel, item.quantity + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button 
              onClick={() => removeFromCart(item.id, item.shirtSize, item.phoneModel)}
              className="remove-btn"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <div className="cart-summary">
        <h3>Total: ${calculateTotal()}</h3>
        <Link to="/saved-cards">
          <button className="checkout-btn">Proceed to Checkout</button>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
