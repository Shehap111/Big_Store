import { wishlistActions } from "./wishlistsSlice";
import { db } from "../../firebase";
import { collection, addDoc, deleteDoc, doc, getDocs, onSnapshot } from "firebase/firestore";

// مزامنة البيانات لحظيًا من Firestore
export const listenToWishlist = (userId) => (dispatch) => {
  if (!userId) return;

  const wishlistRef = collection(db, "users", userId, "wishlists");
  return onSnapshot(wishlistRef, (snapshot) => {
    const wishlist = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("📌 Wishlist from Firestore:", wishlist);
    dispatch(wishlistActions.setWishlist(wishlist));
  });
};

// إضافة منتج إلى الـ Wishlist في Firestore
export const addToFav = (userId, product) => async (dispatch) => {
  if (!userId) return;

  dispatch(wishlistActions.addToFav()); // 🔥 تشغيل اللودينج
  
  try {
    const wishlistRef = collection(db, "users", userId, "wishlists");
    const docRef = await addDoc(wishlistRef, product);
    const newProduct = { id: docRef.id, ...product };

    dispatch(wishlistActions.addToFavSuccess(newProduct)); // ✅ إضافة ناجحة
  } catch (error) {
    console.error("❌ Error adding to wishlist:", error);
  }
};

// حذف منتج من الـ Wishlist
export const removeFromFav = (userId, productId) => async (dispatch) => {
  try {
    if (!userId || !productId) {
      console.error("❌ Invalid userId or productId:", { userId, productId });
      return;
    }

    const productRef = doc(db, "users", userId, "wishlists", productId);
    await deleteDoc(productRef);

    console.log("🗑️ Product removed from Firestore:", productId);
    dispatch(wishlistActions.removeFromFavSuccess(productId));
  } catch (error) {
    console.error("❌ Error removing from wishlist:", error);
  }
};

// مسح الـ Wishlist بالكامل
export const clearWishlist = (userId) => async (dispatch) => {
  try {
    const wishlistRef = collection(db, "users", userId, "wishlists");
    const snapshot = await getDocs(wishlistRef);

    await Promise.all(snapshot.docs.map((doc) => deleteDoc(doc.ref))); // حذف كل المنتجات
    
    console.log("🧹 Wishlist cleared successfully");
    dispatch(wishlistActions.clearWishlistSuccess());
  } catch (error) {
    console.error("❌ Error clearing wishlist:", error);
  }
};
