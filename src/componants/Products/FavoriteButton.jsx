import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../../redux/slices/wishlistsSlice";
import { useEffect, useState } from "react";
import { onSnapshot, doc } from "firebase/firestore"; // استيراد onSnapshot
import { db } from "../../firebase"; // تأكد من استيراد Firestore
import "./products.css";

const FavoriteButton = ({ product }) => {
  const dispatch = useDispatch();
  
  // جلب userId من Redux
  const userId = useSelector((state) => state.user.uid);
  
  // جلب الوشليست من Redux
  const wishlist = useSelector((state) => state.wishlist.items);

  // تخزين الحالة المحلية للكلاس
  const [isFavorite, setIsFavorite] = useState(false);

  // تحميل الوشليست من Firestore عند تغيير userId
  useEffect(() => {
    if (userId) {
      const wishlistRef = doc(db, "wishlist", userId);
      const unsubscribe = onSnapshot(wishlistRef, (snapshot) => {
        const wishlistData = snapshot.data()?.items || [];
        // تحديث الـ Redux Store بالمحتوى الجديد للـ wishlist
        dispatch({ type: "wishlist/setWishlist", payload: wishlistData });

        // تحديث الـ localStorage بالمحتوى الجديد للوشليست
        localStorage.setItem("wishlist", JSON.stringify(wishlistData));

        // التحقق مما إذا كان المنتج مضاف للوشليست أم لا
        const isProductInWishlist = wishlistData.some((item) => item.productId === product.id);
        setIsFavorite(isProductInWishlist); // تحديث الحالة المحلية
      });

      // تنظيف الاشتراك عند مغادرة الـ component
      return () => unsubscribe();
    } else {
      // مسح الـ wishlist من localStorage لو تم تسجيل الخروج
      localStorage.removeItem("wishlist");
    }
  }, [userId, dispatch, product.id]);

  const handleClick = () => {
    if (!userId) {
      alert("يجب تسجيل الدخول لإضافة المنتجات للمفضلة!");
      return;
    }

    const productDetails = {
      productId: product.id,
      title: product.title, // اختيار العنوان بناءً على اللغة
      price: product.price,
      imageUrl: product.imageUrl,
    };

    if (isFavorite) {
      dispatch(removeFromWishlist({ userId, productId: product.id, productDetails }));
    } else {
      dispatch(addToWishlist({ userId, productDetails }));
    }
  };

  return (
    <li className="favBtn_container">
      <button onClick={handleClick} className="fav_btn">
        <i className={isFavorite ? "fa-solid fa-heart fav_in" : "fa-regular fa-heart"}></i>
      </button>
    </li>
  );
};

export default FavoriteButton;
