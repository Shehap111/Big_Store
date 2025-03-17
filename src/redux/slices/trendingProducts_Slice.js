import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTrendingProducts } from "../apiCalls/product_api";


// ✅ تحميل المنتجات بناءً على الفلاتر
export const loadTrendingProducts = createAsyncThunk(
  "trendingProducts/load",
  async (_, { getState }) => {
    const { filters, sortBy } = getState().trendingProducts;

    // ✅ تأكد أن الفلتر يتم تمريره حتى لو كان فارغًا
    const cleanFilters = {
      ...filters,
      subCategory: filters.subCategory.length > 0 ? filters.subCategory : undefined,
    };

    const products = await fetchTrendingProducts({ ...cleanFilters, sortBy });

    // ✅ تعديل البيانات حسب اللغة
    return products.map((product) => ({
      ...product,
    }));
  }
);

const trendingProductsSlice = createSlice({
  name: "trendingProducts",
  initialState: {
    items: [],
    loading: false,
    error: null,
    filters: {
      priceRange: null,
      color: null,
      subCategory: [], // ✅ تأكد إنه مصفوفة عشان يدعم أكتر من قيمة
    },
    sortBy: "rating",
  },
  reducers: {
    // ✅ تحديث الفلاتر بطريقة نظيفة
    setFilter: (state, action) => {
      if (action.payload.subCategory !== undefined) {
        state.filters.subCategory = action.payload.subCategory; // ✅ حفظ القيم المختارة مباشرة
      } else {
        state.filters = { ...state.filters, ...action.payload };
      }
    },

    // ✅ حذف الساب كاتيجوري المحدد
    removeSubCategory: (state, action) => {
      state.filters.subCategory = state.filters.subCategory.filter(
        (id) => id !== action.payload
      );
    },

    // ✅ تحديث طريقة الفرز
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadTrendingProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadTrendingProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadTrendingProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilter, removeSubCategory, setSortBy } = trendingProductsSlice.actions;
export default trendingProductsSlice.reducer;
