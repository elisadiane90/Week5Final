import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CreditCardForm from './components/CreditCardForm';
import OrderConfirmation from './components/OrderConfirmation';
import Login from './components/Login'; 

const App = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    try {
      const parsedCart = storedCart ? JSON.parse(storedCart) : [];
      if (!Array.isArray(parsedCart)) {
        console.error("Invalid cart format in localStorage");
        return [];
      }
      parsedCart.forEach(item => {
        if (typeof item !== 'object' || !item.id || !item.quantity) {
          console.error("Invalid item structure in cart:", item);
        }
      });
      return parsedCart;
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error);
      return [];
    }
  });

  const [savedCards, setSavedCards] = useState(() => {
    const storedCards = localStorage.getItem('savedCards');
    return storedCards ? JSON.parse(storedCards) : [];
  });

  const [selectedCard, setSelectedCard] = useState('');
  const [isCardSelected, setIsCardSelected] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleLogin = useCallback((username, password) => {
    const validUsername = 'admin';
    const validPassword = 'password123';

    if (username === validUsername && password === validPassword) {
      const userData = { name: username };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const addToCart = useCallback((product, selectedSize, selectedModel) => {
    setCartItems(prevCart => {
      let updatedProduct = { ...product, quantity: 1 };

      if (product.category === 'shirt' && selectedSize) {
        updatedProduct.shirtSize = selectedSize;
      }
      if (product.name === 'EZTech Phone Case' && selectedModel) {
        updatedProduct.phoneModel = selectedModel;
      }

      // Ensure only one subscription is added at a time
      if (product.category === 'subscription' && prevCart.some(item => item.category === 'subscription')) {
        alert('Only one subscription can be added at a time.');
        return prevCart;
      }

      // Check if the item already exists in the cart
      const existingItem = prevCart.find(
        item => item.id === product.id &&
        item.shirtSize === updatedProduct.shirtSize &&
        item.phoneModel === updatedProduct.phoneModel
      );

      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && item.shirtSize === updatedProduct.shirtSize && item.phoneModel === updatedProduct.phoneModel
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, updatedProduct];
      }
    });
  }, []);

  const removeFromCart = useCallback((id, shirtSize, phoneModel) => {
    setCartItems(prevItems => 
      prevItems.filter(item => !(item.id === id && item.shirtSize === shirtSize && item.phoneModel === phoneModel))
    );
  }, []);

  const updateQuantity = useCallback((id, shirtSize, phoneModel, quantity) => {
    if (quantity < 1) return;
    setCartItems(prevItems => 
      prevItems.map(item => (item.id === id && item.shirtSize === shirtSize && item.phoneModel === phoneModel)
        ? { ...item, quantity }
        : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('cart');
  }, []);

  // Updated saveCard function to include expiry date and CVV
  const saveCard = useCallback((cardNumber, expiryDate, cvv) => {
    const cardNumberPattern = /^\d{16}$/; // Validates if the card number is exactly 16 digits long

    if (!cardNumberPattern.test(cardNumber)) {
      alert("Please enter a valid 16-digit card number.");
      return;
    }

    // In a real app, you would tokenize this card number through a payment processor
    // and only store the last 4 digits + the token
    const maskedCardNumber = `xxxx xxxx xxxx ${cardNumber.slice(-4)}`;
    const newCard = { 
      cardNumber: maskedCardNumber,
      expiryDate: expiryDate,  // Store expiry date      
      id: Date.now() // Add a unique ID for each card
    };
    
    setSavedCards(prevCards => {
      const updatedCards = [...prevCards, newCard];
      localStorage.setItem('savedCards', JSON.stringify(updatedCards));
      return updatedCards;
    });
  }, []);

  // New function to remove a card
  const removeCard = useCallback((cardId) => {
    setSavedCards(prevCards => {
      const updatedCards = prevCards.filter(card => card.id !== cardId);
      localStorage.setItem('savedCards', JSON.stringify(updatedCards));
      
      // If the removed card was selected, clear the selection
      if (selectedCard && !updatedCards.some(card => card.cardNumber === selectedCard)) {
        setSelectedCard('');
        setIsCardSelected(false);
      }
      
      return updatedCards;
    });
  }, [selectedCard]);

  const handleCardSelection = useCallback((event) => {
    const cardNumber = event.target.value;
    setSelectedCard(cardNumber);
    setIsCardSelected(cardNumber !== '');
  }, []);

  const handleUseSelectedCard = useCallback(() => {
    if (!selectedCard) {
      alert('Please select a card before proceeding.');
      return;
    }

    // Create order details
    const orderId = Math.floor(Math.random() * 1000000);
    const orderSummary = cartItems.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const orderDetails = {
      orderId,
      selectedCard,
      orderSummary,
      date: new Date().toISOString()
    };

    // Store order details in localStorage
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
      
    localStorage.setItem('redirectToConfirmation', 'true');
    window.location.href = '/order-confirmation';
  }, [cartItems, selectedCard]);

  return (
    <Router>
      <Navbar 
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        user={user}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
      <div className="container">
        <Routes>
          <Route path="/" element={user ? <ProductList addToCart={addToCart} /> : <Navigate to="/login" />} />
          <Route 
            path="/cart" 
            element={user ? 
              <Cart 
                cartItems={cartItems} 
                removeFromCart={removeFromCart} 
                updateQuantity={updateQuantity} 
              /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/saved-cards"
            element={
              user ? (
                <CreditCardForm
                  savedCards={savedCards}
                  saveCard={saveCard}
                  removeCard={removeCard} 
                  handleCardSelection={handleCardSelection}
                  handleUseSelectedCard={handleUseSelectedCard}
                  selectedCard={selectedCard}
                  isCardSelected={isCardSelected}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route 
            path="/order-confirmation" 
            element={user ? <OrderConfirmation clearCart={clearCart} /> : <Navigate to="/login" />} 
          />          
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" /> : <Login handleLogin={handleLogin} />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
