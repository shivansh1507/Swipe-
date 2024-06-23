import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './redux/productsSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
  },
});

export default store;
