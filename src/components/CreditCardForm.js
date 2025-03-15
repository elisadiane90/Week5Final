import React, { useState } from 'react';

const CreditCardForm = ({ 
  savedCards, 
  saveCard, 
  removeCard, 
  handleCardSelection, 
  handleUseSelectedCard, 
  selectedCard, 
  isCardSelected 
}) => {
  const [cardInput, setCardInput] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Format credit card number with spaces
  const formatCardNumber = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Add space after every 4 digits
    let formatted = '';
    for (let i = 0; i < digits.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += digits[i];
    }
    
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };
  
  // Format expiry date as MM/YY
  const formatExpiryDate = (value) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digits.length <= 2) {
      return digits;
    } else {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
  };
  
  const handleCardInputChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardInput(formattedValue);
  };
  
  const handleExpiryDateChange = (e) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setExpiryDate(formattedValue);
  };
  
  const handleCvvChange = (e) => {
    // Only allow numbers and limit to 3 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvv(value);
  };
  
  const handleAddNewCard = (event) => {
    event.preventDefault();
    
    // Remove spaces before processing
    const cardNumber = cardInput.replace(/\s/g, '');
    const expiry = expiryDate.replace(/\D/g, '');
    
    // Validate expiry date format
    if (expiry.length !== 4) {
      alert("Please enter a valid expiration date in MM/YY format");
      return;
    }
    
    // Validate CVV
    if (cvv.length !== 3) {
      alert("Please enter a valid 3-digit CVV code");
      return;
    }
    
    // Save card with expiry and CVV
    saveCard(cardNumber, expiryDate, cvv);
    
    // Clear form
    setCardInput('');
    setExpiryDate('');
    setCvv('');
  };

  return (
    <div className="credit-card-form">
      <h2>Checkout</h2>

      {/* Option to select a saved card */}
      {savedCards.length > 0 ? (
        <div className="saved-cards-section">
          <h3>Select a saved card:</h3>
          <div className="saved-cards-list">
            {savedCards.map((card) => (
              <div key={card.id} className="saved-card-option">
                <div className="card-selection">
                  <input
                    type="radio"
                    id={`card-${card.id}`}
                    name="savedCard"
                    value={card.cardNumber}
                    checked={selectedCard === card.cardNumber}
                    onChange={handleCardSelection}
                  />
                  <label htmlFor={`card-${card.id}`}>
                    {card.cardNumber} {/* Already masked in the saveCard function */}
                    {card.expiryDate && <span className="card-expiry">Exp: {card.expiryDate}</span>}
                  </label>
                </div>
                <button 
                  type="button" 
                  className="remove-card-btn"
                  onClick={() => removeCard(card.id)}
                  aria-label={`Remove card ending in ${card.cardNumber.slice(-4)}`}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          {isCardSelected && (
            <div className="selected-card">
              <h3>Selected Card:</h3>
              <p>{selectedCard}</p>
              <button 
                onClick={handleUseSelectedCard}
                className="use-card-btn"
              >
                Use this card for payment
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>No saved cards available. Add a new card.</p>
      )}

      {/* Option to add a new card */}
      <div className="new-card-section">
        <h3>Add a new card</h3>
        <form onSubmit={handleAddNewCard}>
          <div className="form-group">
            <label htmlFor="cardNumber">Card Number:</label>
            <input 
              type="text" 
              id="cardNumber" 
              name="cardNumber" 
              placeholder="1234 5678 9012 3456"
              value={cardInput}
              onChange={handleCardInputChange}
              maxLength="19" // 16 digits + 3 spaces
              required 
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate">Expiration Date:</label>
              <input 
                type="text" 
                id="expiryDate" 
                name="expiryDate" 
                placeholder="MM/YY"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                maxLength="5" // MM/YY format
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cvv">CVV:</label>
              <input 
                type="text" 
                id="cvv" 
                name="cvv" 
                placeholder="123"
                value={cvv}
                onChange={handleCvvChange}
                maxLength="3"
                required 
              />
            </div>
          </div>
          
          <button type="submit" className="add-card-btn">Add New Card</button>
        </form>
      </div>
    </div>
  );
};

export default CreditCardForm;
