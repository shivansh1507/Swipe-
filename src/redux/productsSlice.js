import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      console.log('Product added:', action.payload); // Debugging statement
      state.push(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});


export const { addProduct, updateProduct } = productsSlice.actions;
export const selectProducts = state => state.products;
export default productsSlice.reducer;
