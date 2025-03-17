import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore'; // استيراد onSnapshot لجلب البيانات
import { setWishlist, removeFromWishlist } from '../../redux/slices/wishlistsSlice'; // إضافة الـ action لتحديث الـ wishlist وحذف المنتجات من الوشليست
import { Link } from 'react-router-dom'; // استيراد Link من react-router-dom للتوجيه إلى صفحة سينجل برودكت
import './users.css'

const Favorites = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.uid); // جلب userId من الـ Redux
  const wishlist = useSelector((state) => state.wishlist.items); // جلب الـ wishlist من الـ Redux
  const languageCode = useSelector((state) => state.language.language);

  // عند تغيير الـ userId أو تحميل الصفحة، نقوم بجلب الوشليست الخاصة باليوزر من Firestore
  useEffect(() => {
    if (userId) {
      const wishlistRef = doc(db, 'wishlist', userId);
      const unsubscribe = onSnapshot(wishlistRef, (snapshot) => {
        const wishlistData = snapshot.data()?.items || [];
        dispatch(setWishlist(wishlistData)); // تحديث الـ Redux store
      });

      // تنظيف الاشتراك عند مغادرة الـ component
      return () => unsubscribe();
    }
  }, [userId, dispatch]);

  // دالة لحذف المنتج من الوشليست
  const handleRemoveFromWishlist = (productDetails) => {
    dispatch(removeFromWishlist({ userId, productDetails }));
  };

  return (
    <div className='wishlist'>
      <h2>Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>No products in your wishlist.</p>
      ) : (
        <div className='row'>
          {wishlist.map((product) => (
            <div key={product.productId} className="col-lg-4 col-md-6">
              <div className="allbox">
              <div className="image">
                <img src={product.imageUrl} alt={product.title[languageCode]} />
              </div>
              <Link to={`/product/${product.productId}`}>
                {product.title[languageCode]}
              </Link>
              <p>Price: ${product.price}</p>
              <button 
                onClick={() => handleRemoveFromWishlist(product)} 
                className="remove-btn"
              >
                Remove
              </button>                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
