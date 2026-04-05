import { useState, useEffect } from 'react';
import './App.css';

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const App = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('NGN');
  const [toCurrency, setToCurrency] = useState('USD');
  const [converted, setConverted] = useState(null);
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${API_BASE}/rates/${fromCurrency}`);

        if (!response.ok) {
          throw new Error('Failed to fetch rates');
        }

        const data = await response.json();

        // exchangerate-api v6 returns conversion_rates
        if (!data.conversion_rates) {
          throw new Error('Invalid API response');
        }

        setRates(data.conversion_rates);
      } catch (err) {
        setError('Failed to load exchange rates');
        setRates({});
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [fromCurrency]);

  useEffect(() => {
    if (rates[toCurrency] && amount !== '') {
      setConverted((Number(amount) * rates[toCurrency]).toFixed(2));
    } else {
      setConverted(null);
    }
  }, [amount, toCurrency, rates]);

  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <div className="app">
      <h1>🌍 Currency Converter</h1>

      {loading ? (
        <p>Loading exchange rates...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <div className="converter">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
            />

            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              {Object.keys(rates).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>

            <button onClick={handleSwap}>⇄</button>

            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              {Object.keys(rates).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          {converted && (
            <p className="result">
              {amount} {fromCurrency} = <strong>{converted} {toCurrency}</strong>
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default App;
