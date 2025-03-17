import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../redux/slices/CartSlice"; 
import { t } from "i18next";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

    const currentLang = useSelector((state) => state.language.language);

  const incrementQuantityHandler = () => {
    dispatch(cartActions.incrementQuantity(item.id));
  };

  const decrementQuantityHandler = () => {
    dispatch(cartActions.decrementQuantity(item.id));
  };

  const removeItemHandler = () => {
    dispatch(cartActions.removeItem(item.id));
  };



  // تحديد إذا كان العنصر عرض أم منتج عادي
  const isOffer = !!item.products;

  return (
    <tr className={`cart-item ${isOffer ? "offer-item" : ""}`}>
      <td>
        <img 
          src={isOffer ? item.products[0].imageUrl : item.imageUrl} 
          alt={isOffer ? item.products[0].title[currentLang] : item.title[currentLang]} 
          className="cart-item-image" 
        />
      </td>
<td>
  <span>
    {isOffer ? (
      <>
        🎉 {item.title[currentLang]}: 
        <span className="badge me-2 ms-2  text-bg-secondary">Items {item.products.length} </span> 
      </>
    ) : (
      item.title[currentLang]
    )}
  </span>
</td>

      <td>${isOffer ? item.price : item.price}</td>
      <td >
        <div className="QuantityBtn">
          <button onClick={decrementQuantityHandler} className="btn">-</button>
          <span>{item.quantity}</span>
          <button onClick={incrementQuantityHandler} className="btn">+</button>
        </div>
      </td>
      <td>${(isOffer ? item.price * item.quantity: item.price * item.quantity)}</td>
      <td>
        <button onClick={removeItemHandler} className="btn remove-btn">
          <i className="fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>
  );
};

export default CartItem;