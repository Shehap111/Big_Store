import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Orders = () => {
  const { t } = useTranslation();
  const userId = useSelector((state) => state.user.uid);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;
      try {
        const q = query(
          collection(db, "Orders"),
          where("userId", "==", userId) // ✅ جلب الأوردرات الخاصة باليوزر فقط
        );
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => b.orderDate + a.orderDate); // 🔥 ترتيب الأوردرات بالأحدث يدويًا
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [userId]);

  return (
    <div className="oreders">
      <div className="container">
        <h2>{t("User.orders.your_orders")}</h2>
        {orders.map((order) => (
          <div className="box" key={order.id}>
            <ul>
              <li>{t("User.orders.order_id")} - <span>{order.id}</span></li>
              <li>{t("User.orders.order_status")} - <span>{order.orderStatus}</span></li>
            </ul>

            <ul>
              <li>{t("User.orders.payment_status")} - <span>{order.status}</span></li>
              <li><span>{order.products.length} {t("User.orders.products_count")}</span></li>
            </ul>

            <ul className="top_of_box">
              <li>{t("User.orders.total")} - <span>${order.totalAmount}</span></li>
              <Link to={`/Profile/orders/${order.id}`}>{t("User.orders.view_details")} <i className="fa-solid fa-caret-right"></i></Link>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
