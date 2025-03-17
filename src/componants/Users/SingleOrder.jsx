import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import './users.css'
import { useTranslation } from "react-i18next";
import Shipping_car from "./Shipping_car";
import {useSelector} from "react-redux";

const SingleOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const languageCode = useSelector((state) => state.language.language);

    
const fetchOrder = async () => {
  try {
    const docRef = doc(db, "Orders", orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const orderData = docSnap.data();
      setOrder(orderData);
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    alert("Error fetching order: " + error.message);
  }
};
    
useEffect(() => {
  if (orderId) {
    fetchOrder();
  }
}, [orderId]);

if (!order) return <p>Loading order details...</p>;

  return (
    <div className="single-order">
      <h2> {t("User.SingleOrder.Order-Details")}</h2>
      <Shipping_car orderDate={order.orderDate} deliveryDate={order.deliveryDate } />
      {/* بوكس العنوان */}
      <div className="address-box">
        <h3>{t("User.Address.shipping_address")} </h3>
        <div className="box">
          <ul>
          <p><strong>{t("User.Address.name")}:</strong> {order.address.fullName}</p>
          <p><strong>{t("User.Address.address")}:</strong> {order.address.detailedAddress}</p>
          <p><strong>{t("User.Address.city")}:</strong> {order.address.city}</p>
        </ul>
        <ul>
          <p><strong>{t("User.Address.state")}:</strong> {order.address.governorate}</p>
          <p><strong>{t("User.Address.postal_code")}:</strong> {order.address.postalCode}</p>
          <p><strong>{t("User.Address.phone")}:</strong> {order.address.phoneNumber}</p>          
        </ul>
        </div>

      </div>

      {/* بوكس المنتجات */}
      <div className="products-box">
        <h3>{t("Products.Products")}</h3>
      <div  className="Pro">
        {order.products && order.products.length > 0 ? (
          order.products.map((product) => (
            <div key={product.id} className="allBox">
              <div  className="box">
                <div className="image">
                  <img src={product.isOffer? product.products[0].imageUrl :product.imageUrl } alt={product.title[languageCode]} />
              </div>
                <Link to={product.isOffer? `/offer/${product.id}` :`/product/${product.id}` } className="product-link">
                    {product.title[languageCode]}
                </Link>
                
                <p><strong>x</strong>{product.quantity}</p>
                <p><strong> {t("User.SingleOrder.Price")}:</strong> ${product.price * product.quantity}</p>
              </div>              
            </div>
          ))
        ) : (
          <p>No products in this order.</p>
        )}          

      </div>
      </div>

      <div className="order-summary">
        <ul>
           <p><strong> {t("User.SingleOrder.Total-Amount")}:</strong> ${order.totalAmount}</p>
           <p><strong> {t("User.SingleOrder.Shipping-Fee")}:</strong> ${order.shippingFee}</p>
       </ul>
      <ul>
          <p><strong> {t("User.SingleOrder.Payment-Method")}:</strong> {order.paymentMethod}</p>
          <p><strong> {t("User.SingleOrder.Delivery-Date")}:</strong> {new Date(order.deliveryDate).toLocaleDateString()}</p>
        
      </ul> 
      </div>
    </div>
  );
};

export default SingleOrder;
