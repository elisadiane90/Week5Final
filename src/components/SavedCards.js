import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SavedCards = ({ setSelectedCard }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [savedCards, setSavedCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCards = localStorage.getItem('savedCards');
    if (storedCards) {
      setSavedCards(JSON.parse(storedCards));
    }
    console.log(savedCards); // Check if cards are being loaded
  }, []);

  const handleInputChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); 
    value = value.replace(/(.{4})/g, '$1 ').trim(); 
    setCardNumber(value);
  };

  const handleSave = () => {
    if (cardNumber.length === 19) {
      const cleanedCardNumber = cardNumber.replace(/\s+/g, '');
      const newCard = { cardNumber: cleanedCardNumber };
      const updatedCards = [...savedCards, newCard];
      setSavedCards(updatedCards);
      localStorage.setItem('savedCards', JSON.stringify(updatedCards));
      setCardNumber('');
      alert('Card details saved!');
    } else {
      alert('Please enter a valid card number.');
    }
  };

  const handleRemoveCard = (cardNumber) => {
    const updatedCards = savedCards.filter(card => card.cardNumber !== cardNumber);
    setSavedCards(updatedCards);
    localStorage.setItem('savedCards', JSON.stringify(updatedCards));
  };

  const handleSelectCard = (cardNumber) => {
    setSelectedCard(cardNumber); 
    navigate('/checkout'); 
  };

  return (
    <div>
      <h2>Saved Credit Cards</h2>
      {savedCards.length > 0 ? (
        <div>
          <ul>
            {savedCards.map((card, index) => (
              <li key={index}>
                <p>**** **** **** {card.cardNumber.slice(-4)}</p>
                <button onClick={() => handleSelectCard(card.cardNumber)}>Select</button>
                <button onClick={() => handleRemoveCard(card.cardNumber)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No cards saved yet.</p>
      )}

      <h3>Save a New Card</h3>
      <input
        type="text"
        placeholder="1234 5678 9012 3456"
        maxLength="19"
        value={cardNumber}
        onChange={handleInputChange}
      />
      <button onClick={handleSave}>Save Card</button>
    </div>
  );
};

export default SavedCards;
