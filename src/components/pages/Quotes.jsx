import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

const Quotes = () => {
  const { openQuoteModal } = useOutletContext();
  const [quotes, setQuotes] = useState([]);

  const handleEdit = (quote) => {
    openQuoteModal(quote);
  };

  const handleCreate = () => {
    openQuoteModal();
  };

  return (
    <div className="quotes-container">
      <div className="quotes-header">
        <h1>Quotes</h1>
        <button onClick={handleCreate} className="create-quote-btn">
          Create Quote
        </button>
      </div>
      <div className="quotes-list">
        {quotes.map((quote) => (
          <div key={quote.id} className="quote-item">
            <div className="quote-content">
              <p>{quote.content}</p>
            </div>
            <button onClick={() => handleEdit(quote)} className="edit-btn">
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quotes;