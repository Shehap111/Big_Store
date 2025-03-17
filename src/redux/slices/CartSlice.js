import { createSlice } from "@reduxjs/toolkit";
import handelAlert from "./SweetAlert";

// Function to update LocalStorage and show alert
const updateLocalStorageAndShowAlert = (state, message, color) => {
  localStorage.setItem("CartItems", JSON.stringify(state.CartItems));
  handelAlert("success", message, color, "#fff");
};

const CartSlice = createSlice({
  name: "CartItems",
  initialState: {
    CartItems: localStorage.getItem("CartItems") ? JSON.parse(localStorage.getItem("CartItems")) : [],
  },
  reducers: {
    addToCart: (state, action) => {
      const itemInCart = state.CartItems.find((item) => item.id === action.payload.id);
      if (itemInCart) {
        itemInCart.quantity++;
        updateLocalStorageAndShowAlert(state, `( ${action.payload.title} ) Quantity Increased`, "#D1E7DD");
      } else {
        state.CartItems.push({ ...action.payload, quantity: 1 });
        updateLocalStorageAndShowAlert(state, `( ${action.payload.title} ) Added To Cart`, "#CFE2FF");
      }
    },
    addOfferToCart: (state, action) => {
      const offer = action.payload;
      const existingOffer = state.CartItems.find((item) => item.id === offer.id && item.isOffer);
      
      if (existingOffer) {
        existingOffer.quantity++;
        updateLocalStorageAndShowAlert(state, `( Special Offer ) Quantity Increased`, "#D1E7DD");
      } else {
        state.CartItems.push({
          id: offer.id,
          title: offer.title,
          price: offer.discountPrice,
          products: offer.products, // Contains all products in the offer
          quantity: 1,
          isOffer: true,
        });
        updateLocalStorageAndShowAlert(state, `( Special Offer ) Added To Cart`, "#CFE2FF");
      }
    },
    incrementQuantity: (state, action) => {
      const item = state.CartItems.find((item) => item.id === action.payload);
      if (item) {
        item.quantity++;
        updateLocalStorageAndShowAlert(state, `( ${item.title} ) Quantity Increased`, "#D1E7DD");
      }
    },
    decrementQuantity: (state, action) => {
      const item = state.CartItems.find((item) => item.id === action.payload);
      if (item) {
        if (item.quantity === 1) {
          state.CartItems = state.CartItems.filter((item) => item.id !== action.payload);
          updateLocalStorageAndShowAlert(state, `( ${item.title} ) Removed From Cart`, "#F27474");
        } else {
          item.quantity--;
          updateLocalStorageAndShowAlert(state, `( ${item.title} ) Quantity Decreased`, "#D1E7DD");
        }
      }
    },
    removeItem: (state, action) => {
      const item = state.CartItems.find((item) => item.id === action.payload);
      state.CartItems = state.CartItems.filter((item) => item.id !== action.payload);
      if (item) {
        updateLocalStorageAndShowAlert(state, `( ${item.title} ) Removed From Cart`, "#F27474");
      }
    },
    clear: (state) => {
      state.CartItems = [];
      updateLocalStorageAndShowAlert(state, "Cart Cleared", "#F27474");
    },
  }
});

const cartActions = CartSlice.actions;
const cartReducer = CartSlice.reducer;

export { cartActions, cartReducer };