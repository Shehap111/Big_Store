import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../firebase"; // تأكد من استيراد Firestore
import { doc, updateDoc, arrayUnion, arrayRemove, setDoc, getDoc } from "firebase/firestore";

// ✅ إضافة المنتج للوشليست
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ userId, productDetails }, { rejectWithValue, getState, dispatch }) => {
    if (!userId) return rejectWithValue("User ID is required");

    const userWishlistRef = doc(db, "wishlist", userId);

    try {
      const docSnap = await getDoc(userWishlistRef);

      // تحقق إذا كان الـ doc موجود، لو مش موجود أنشئه
      if (!docSnap.exists()) {
        await setDoc(userWishlistRef, { items: [productDetails] }); // إضافة المنتج كـ object كامل
      } else {
        // تحقق إذا كان المنتج موجود بالفعل في الوشليست قبل إضافته
        const currentWishlist = docSnap.data()?.items || [];
        const isProductInWishlist = currentWishlist.some((item) => item.productId === productDetails.productId);
        
        if (!isProductInWishlist) {
          await updateDoc(userWishlistRef, {
            items: arrayUnion(productDetails), // إضافة الـ productDetails للـ wishlist
          });
        }
      }

      // جلب الوشليست المحدثة بعد الإضافة
      const updatedWishlist = await getDoc(userWishlistRef);
      const updatedItems = updatedWishlist.data()?.items || [];

      // تحديث الـ Redux مع العدد الجديد
      dispatch(setWishlist(updatedItems));

      return productDetails;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ حذف المنتج من الوشليست
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async ({ userId, productDetails }, { rejectWithValue, dispatch }) => {
    if (!userId) return rejectWithValue("User ID is required");

    const userWishlistRef = doc(db, "wishlist", userId);

    try {
      await updateDoc(userWishlistRef, {
        items: arrayRemove(productDetails), // إزالة الـ productDetails من الـ wishlist
      });

      // جلب الوشليست المحدثة بعد الحذف
      const updatedWishlist = await getDoc(userWishlistRef);
      const updatedItems = updatedWishlist.data()?.items || [];

      // تحديث الـ Redux مع العدد الجديد
      dispatch(setWishlist(updatedItems));

      return productDetails.productId; // نرجع الـ productId
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Reducer لإضافة الـ Wishlist إلى الـ Redux
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [], count: 0 }, // إضافة count لحساب عدد المنتجات
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload; // تحديث الوشليست في الـ state
      state.count = action.payload.length; // تحديث العدد
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToWishlist.fulfilled, (state, action) => {
        // عند إضافة المنتج، نقوم بتحديث العدد في الـ Redux
        state.count = state.items.length;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        // عند حذف المنتج، نقوم بتحديث العدد في الـ Redux
        state.count = state.items.length;
      });
  },
});

export const { setWishlist } = wishlistSlice.actions; // تصدير الـ action

export default wishlistSlice.reducer;
