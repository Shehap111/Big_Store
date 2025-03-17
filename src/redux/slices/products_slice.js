import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProducts } from '../apiCalls/product_api';

// دالة لجلب المنتجات بناءً على اللغة المخزنة في Redux
export const loadProducts = createAsyncThunk(
  'products/loadProducts',
  async (_, { getState }) => {
    const products = await fetchProducts();
    return products.map((product) => ({
      ...product,
      id: String(product.id), // تحويل id إلى string
      createdAt: product.createdAt?.toMillis(),
    }));
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productsSlice.reducer;
