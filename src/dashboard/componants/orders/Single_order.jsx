import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc ,writeBatch, increment } from "firebase/firestore";
import { db } from "../../../firebase";
import "../../../componants/Users/users.css";
import ShippingCar from "../../../componants/Users/Shipping_car";

const SingleOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(""); // للتحكم في حالة الطلب

  // جلب بيانات الطلب من Firestore
  const fetchOrder = async () => {
    try {
      const docRef = doc(db, "Orders", orderId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const orderData = docSnap.data();
        setOrder(orderData);
        setStatus(orderData.orderStatus); // ضبط الحالة الحالية
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      alert("Error fetching order: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // تحديث حالة الطلب
const handleStatusUpdate = async () => {
  try {
    const docRef = doc(db, "Orders", orderId);
    const orderSnap = await getDoc(docRef);

    if (!orderSnap.exists()) {
      alert("Order not found!");
      return;
    }

    const orderData = orderSnap.data();

    // لو الأوردر بيتحول لـ Cancelled و كان مش ملغي قبل كده
    if (status === "Cancelled" && orderData.orderStatus !== "Cancelled") {
      const batch = writeBatch(db);

      order.products.forEach((product) => {
        const productRef = doc(db, "products", String(product.id));
        batch.update(productRef, {
          stock: increment(product.quantity),  // زيادة المخزون
          sales: increment(-product.quantity), // تقليل المبيعات
        });
      });

      await batch.commit();
      console.log("Stock and sales reverted successfully!");
    }

    // تحديث حالة الطلب
    await updateDoc(docRef, { orderStatus: status });
    alert("Order status updated successfully!");
  } catch (error) {
    console.error("Error updating order status:", error);
    alert("Failed to update order status. Please try again.");
  }
};


  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p>Error loading order details: {error}</p>;

  return (
    <div className="single-order">
      <h2>Order Details</h2>

      {/* Shipping Info */}
      {/* <ShippingCar orderDate={order.orderDate} deliveryDate={order.deliveryDate} /> */}

      {/* Address Box */}
      <div className="address-box">
        <h3>Shipping Address</h3>
        <div className="box">
          <ul>
            <p><strong>Name:</strong> {order.address.fullName}</p>
            <p><strong>Address:</strong> {order.address.detailedAddress}</p>
            <p><strong>City:</strong> {order.address.city}</p>
          </ul>
          <ul>
            <p><strong>State:</strong> {order.address.governorate}</p>
            <p><strong>Postal Code:</strong> {order.address.postalCode}</p>
            <p><strong>Phone:</strong> {order.address.phoneNumber}</p>
          </ul>
        </div>
      </div>

      {/* Products Box */}
      <div className="products-box">
        <h3>Products</h3>
        <div className="Pro">
          {order.products && order.products.length > 0 ? (
            order.products.map((product) => (
              <div key={product.id} className="allBox">
                <div className="box">
                  <div className="image">
                    <img src={product.isOffer? product.products[0].imageUrl : product.imageUrl} alt={product.title.en} />
                  </div>
                  <Link to={ product.isOffer?  `/offer/${product.id}`  :  `/product/${product.id}`} className="product-link">
                    {product.title.en}
                  </Link>
                  <p><strong>x</strong>{product.quantity}</p>
                  <p><strong>Price:</strong> ${product.price * product.quantity}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No products in this order.</p>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="order-summary">
        <ul>
          <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
          <p><strong>Shipping Fee:</strong> ${order.shippingFee}</p>
        </ul>
        <ul>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          <p><strong>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleDateString()}</p>
        </ul>
      </div>

      {/* Order Status Update */}
      <div className="order-status">
        <h3>Update Order Status</h3>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="status-select"
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button  onClick={handleStatusUpdate} className="update-button mt-5">
          Confirm
        </button>
      </div>
    </div>
  );
};

export default SingleOrder;
