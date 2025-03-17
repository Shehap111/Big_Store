import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../redux/slices/CartSlice"; 
import CartItem from "./CartItem";
import './cart.css';
import CheckoutOrLogin from "./CheckoutOrLogin";
import { useTranslation } from 'react-i18next';
import Intro from '../intro_sections/Intro';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.CartItems);
  console.log("🔥 Cart Items in Cart Component:", cartItems);

  const { t } = useTranslation();

  // حساب المجموع الكلي
  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // حساب إجمالي الكمية
  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // حساب رسوم الشحن
  const calculateShippingFee = (totalAmount) => {
    return totalAmount > 200 ? 0 : 20;
  };

  const clearCartHandler = () => {
    dispatch(cartActions.clear());
  };

  const total = parseFloat(getTotalAmount());
  const shippingFee = calculateShippingFee(total);
  const finalTotal = total + shippingFee;

  return (
    <> 
      <Intro link={t('Cart.introLink')} />
      <div className="cart-page">
        {cartItems.length === 0 ? (
          <p>{t('Cart.emptyMessage')}</p>
        ) : (
          <>

              
<div className="table_container">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>{t('Cart.table.product')}</th>
                  <th>{t('Cart.table.name')}</th>
                  <th>{t('Cart.table.price')}</th>
                  <th>{t('Cart.table.quantity')}</th>
                  <th>{t('Cart.table.total')}</th>
                  <th>{t('Cart.table.delete')}</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </tbody>
            </table>

</div>              
 
            <div className="Container_clear-cart-btn" >
              <button onClick={clearCartHandler} className="clear-cart-btn">
                {t('Cart.table.Clear')}
              </button>              
            </div>

                    

            <div className="SubTotal mt-5">
              <ul>
                <li>{t('Cart.summary.totalProducts')}</li>
                <li>{cartItems.length}</li>
              </ul>
              <ul>
                <li>{t('Cart.summary.totalQuantity')}</li>
                <li>{getTotalQuantity()}</li>
              </ul>
              <ul>
                <li>{t('Cart.summary.subTotal')}</li>
                <li><span>${total.toFixed(2)}</span></li>
              </ul>
              <ul>
                <li>{t('Cart.summary.shippingFee')}</li>
                <li><span>{shippingFee === 0 ? t('Cart.summary.freeShipping') : `$${shippingFee.toFixed(2)}`}</span></li>
              </ul>
              <ul>
                <li>{t('Cart.summary.totalAmount')}</li>
                <li><span>${finalTotal.toFixed(2)}</span></li>
              </ul>
              <CheckoutOrLogin />
            </div>
          </>
        )}
      </div>   
    </>
  );
};

export default Cart;







