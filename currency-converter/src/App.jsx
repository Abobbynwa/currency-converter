import { useState, useEffect } from 'react';
import './App.css';

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
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/NGN');
        const data = await response.json();
        setRates(data.rates);
        setLoading(false);
      } catch (err) {
        setError('Failed to load exchange rates');
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  const convert = () => {
    if (rates[toCurrency] && rates[fromCurrency]) {
      const rate = rates[toCurrency] / rates[fromCurrency];
      setConverted((amount * rate).toFixed(2));
    }
  };

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
              onChange={e => setAmount(e.target.value)}
            />
            <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value)}>
              {Object.keys(rates).map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            <button onClick={handleSwap}>⇄</button>
            <select value={toCurrency} onChange={e => setToCurrency(e.target.value)}>
              {Object.keys(rates).map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            <button onClick={convert}>Convert</button>
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
