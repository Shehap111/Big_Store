import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCategories } from '../apiCalls/product_api';

export const loadCategories = createAsyncThunk(
  'categories/loadCategories',
  async (_, { getState }) => {
    const categories = await fetchCategories();
    const { language } = getState().language;

    // معالجة البيانات حسب اللغة هنا مباشرة
    return categories.map((category) => ({
      ...category,
      name: category.name[language] || category.name.en,
      description: category.description[language] || category.description.en,
    }));
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCategories(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;
