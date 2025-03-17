import {configureStore, applyMiddleware} from '@reduxjs/toolkit';
import { thunk } from "redux-thunk"
import productsReducer from './slices/products_slice'; 
import categoriesReducer from './slices/categorys_slice'; 
import subcategoriesReducer from './slices/supCategorys_slice'; 
import productsBySubCategoryReducer from './slices/Products_by_supcat_slice'; 
import singleProductReducer from './slices/singleProduct_slice'; 
import userReducer from './slices/userSlice'; 
import languageReducer from './slices/language'; 
import {cartReducer} from './slices/CartSlice'; 
import wishlistReducer from './slices/wishlistsSlice'; 
import offersReducer from './slices/offersSlice';
import blogsReducer from './slices/blogsSlice';
import trendingProductsReducer from "./slices/trendingProducts_Slice";

const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    subcategories: subcategoriesReducer,
    productsBySubCategory: productsBySubCategoryReducer,
    singleProduct: singleProductReducer,
    user: userReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    language: languageReducer,  
    offers: offersReducer,
    blogs: blogsReducer,    
    trendingProducts: trendingProductsReducer,
  },
 middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk), // إضافة thunk
}

);

export default store;
