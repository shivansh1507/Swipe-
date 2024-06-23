import axios from 'axios';

const API_KEY = process.env.REACT_APP_API_KEY;

export const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  try {
    const response = await axios.get(`https://api.freecurrencyapi.com/v1/latest`, {
      params: {
        apikey: API_KEY,
        base_currency: fromCurrency,
        currencies: toCurrency,
      },
    });
    const rate = response.data.data[toCurrency];
    return amount * rate;
  } catch (error) {
    console.error('Currency conversion error:', error.response ? error.response.data : error.message);
    throw new Error('Currency conversion failed.');
  }
};
