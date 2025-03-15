import React, { useState } from 'react';

const Checkout = ({ savedCards, addSavedCard }) => {
  const [selectedCard, setSelectedCard] = useState(""); // For storing the selected card
  const [newCard, setNewCard] = useState(""); // For storing new card input
  const [cardError, setCardError] = useState(""); // For displaying card number errors

  const handleCardSelection = (event) => {
    setSelectedCard(event.target.value); // Update selected card state
  };

  const handleAddCard = () => {
    if (!newCard) {
      setCardError("Please enter a card number.");
      return;
    }

    const cardNumberPattern = /^\d{16}$/;
    if (!cardNumberPattern.test(newCard.replace(/\s+/g, ''))) {
      setCardError("Please enter a valid 16-digit card number.");
      return;
    }

    setCardError(""); // Clear error if card number is valid
    const cardDetails = {
      cardNumber: newCard.replace(/\s+/g, ''), // Clean spaces from card number
    };
    addSavedCard(cardDetails); // Add the new card to saved cards
    setNewCard(""); // Clear the input field
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      
      {/* Displays saved cards if any */}
      {savedCards.length > 0 ? (
        <div className="checkout-cards">
          <label htmlFor="saved-cards">Select a saved card:</label>
          <select 
            id="saved-cards" 
            value={selectedCard} 
            onChange={handleCardSelection}
          >
            <option value="">-- Choose a card --</option>
            {savedCards.map((card, index) => (
              <option key={index} value={card.cardNumber}>
                **** **** **** {card.cardNumber.slice(-4)} {/* Displays last 4 digits */}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p>No saved cards available. Add a new card.</p>
      )}

      {/* Option to add a new card */}
      <div className="add-card">
        <label htmlFor="new-card">Add a new card:</label>
        <input 
          type="text" 
          id="new-card" 
          value={newCard} 
          onChange={(e) => setNewCard(e.target.value)} 
          placeholder="Enter card number" 
        />
        <button onClick={handleAddCard}>Add Card</button>
        {cardError && <p className="error">{cardError}</p>} {/* Displays error message */}
      </div>

      {/* Displays the selected card */}
      {selectedCard && (
        <div className="selected-card">
          <h3>Selected Card:</h3>
          <p>**** **** **** {selectedCard.slice(-4)}</p>
        </div>
      )}

      <button className="checkout-button">Proceed to Payment</button>
    </div>
  );
};

export default Checkout;
