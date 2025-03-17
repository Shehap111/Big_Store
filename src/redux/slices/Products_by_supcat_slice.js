import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchProductsBySubCategory } from '../apiCalls/product_api';

// دالة لجلب المنتجات بناءً على subCategoryId
export const loadProductsBySubCategory = createAsyncThunk(
  'products/loadBySubCategory',
  async (subCategoryId, { getState }) => {
    const products = await fetchProductsBySubCategory(subCategoryId);

    // تعديل البيانات حسب اللغة
return products.map((product) => ({
  ...product,
        createdAt: product.createdAt?.toMillis(),

}));
  }
);

const productsBySubCategorySlice = createSlice({
  name: 'productsBySubCategory',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearProducts(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProductsBySubCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadProductsBySubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadProductsBySubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearProducts } = productsBySubCategorySlice.actions;
export default productsBySubCategorySlice.reducer;
