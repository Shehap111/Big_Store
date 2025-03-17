import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSubCategories } from "../apiCalls/product_api";

// ✅ تحميل الساب كاتيجوريز
export const loadSubcategories = createAsyncThunk(
  "subcategories/loadSubcategories",
  async (categoryId = "all", { getState, rejectWithValue }) => {
    try {
      const subcategories = await fetchSubCategories(categoryId);
      const { language } = getState().language;

      return subcategories.map((subcategory) => ({
        ...subcategory,
        name: subcategory.name?.[language] || subcategory.name?.en || "No Name",
        description:
          subcategory.description?.[language] || subcategory.description?.en || "No Description",
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const subcategoriesSlice = createSlice({
  name: "subcategories",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSubcategories(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSubcategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSubcategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadSubcategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSubcategories } = subcategoriesSlice.actions;
export default subcategoriesSlice.reducer;
