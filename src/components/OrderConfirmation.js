import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = ({ clearCart }) => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Get order details from localStorage
    const savedOrderDetails = JSON.parse(localStorage.getItem('orderDetails'));
    if (savedOrderDetails) {
      setOrderDetails(savedOrderDetails);
    }
  }, []);

  const handlePlaceOrder = () => {
    // Clear cart after placing the order
    clearCart();

    // Navigate to a confirmation page or another step
    navigate('/');
    alert('Your order has been placed successfully!');
  };

  if (!orderDetails) return <p>Loading...</p>;

  return (
    <div>
      <h2>Order Confirmation</h2>
      <p>Order ID: {orderDetails.orderId}</p>
      <p>Payment Method: Ending in {orderDetails.selectedCard.slice(-4)}</p>
      <h3>Order Summary:</h3>
      <ul>
        {orderDetails.orderSummary.map((item, index) => (
          <li key={index}>{item.name} x {item.quantity} - ${item.price}</li>
        ))}
      </ul>
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
};

export default OrderConfirmation;
