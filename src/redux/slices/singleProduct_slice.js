import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSingleProduct } from "../apiCalls/product_api";

// Thunk لجلب منتج فردي ومعالجة البيانات دايناميك
export const loadSingleProduct = createAsyncThunk(
  "singleProduct/loadSingleProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const product = await fetchSingleProduct(productId);

      return {
        ...product,
        createdAt: product.createdAt?.toMillis(),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const singleProductSlice = createSlice({
  name: "singleProduct",
  initialState: {
    product: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSingleProduct(state) {
      state.product = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSingleProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSingleProduct.fulfilled, (state, action) => {
        state.product = action.payload;
        state.loading = false;
      })
      .addCase(loadSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSingleProduct } = singleProductSlice.actions;
export default singleProductSlice.reducer;
