import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { db } from "../../firebase";
import { collection, query, where, getDocs, addDoc , writeBatch, doc, increment} from "firebase/firestore";
import { loadStripe } from "@stripe/stripe-js";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const stripePromise = loadStripe("pk_test_51QH9SCRudA1pE7179r11dWHXsCdraUdcQht2XZn6hoWl5m0T7MVzEW2zvIZ63Cvbj072HzO5vUPG2qVQGVImjfYc0044AZsHXI");

const ProductDisplay = () => {
  const { t } = useTranslation();
  const cartItems = JSON.parse(localStorage.getItem("CartItems")) || [];
    const currentLang = useSelector((state) => state.language.language);
    
  return (
    <section className="Products_Chekout">
      <h3>{t("Checkout.productDisplay.title")}</h3>
      <div className="row">
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div key={index} className="col-lg-3 col-md-4 col-sm-6">
              <div className="box">
                <div className="image">
                  <img src={item.isOffer ? item.products[0].imageUrl : item.imageUrl} alt={item.title[currentLang]} />
                </div>
                <div className="description">
                 <Link to={item.isOffer?`/offer/${item.id}`:`/product/${item.id}`}>  <h4>{item.title[currentLang]}</h4> </Link>
                  <h5>${(item.price * item.quantity).toFixed(2)}</h5>
                  <span>{t("Checkout.productDisplay.quantity", )} {  item.quantity }</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>{t("Checkout.productDisplay.noProductsMessage")}</p>
        )}
      </div>
    </section>
  );
};

const calculateTotal = () => {
  const cartItems = JSON.parse(localStorage.getItem("CartItems")) || [];
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = total >= 200 ? 0 : 20;
  const finalTotal = total + shippingFee;

  return { total, shippingFee, finalTotal };
};

const AddressSelection = ({ onSelectAddress }) => {
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user.uid);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!userId) return;
      try {
        const q = query(collection(db, "Address"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const addressesData = [];
        querySnapshot.forEach((doc) => {
          addressesData.push({ id: doc.id, ...doc.data() });
        });
        setAddresses(addressesData);
      } catch (error) {
        console.error(t("Checkout.addressSelection.loading"), error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [userId, t]);

  if (loading) return <p>{t("Checkout.addressSelection.loading")}</p>;
  if (!addresses.length) return <p>{t("Checkout.addressSelection.noAddresses")}</p>;

  return (
    <div className="Select_address">
      <h3>{t("Checkout.addressSelection.title")}</h3>
      {addresses.map((address) => (
        <div key={address.id}>
          <input
            type="radio"
            id={address.id}
            name="address"
            value={address.id}
            onChange={() => onSelectAddress(address)}
          />
          <label htmlFor={address.id}>
            {address.fullName} - {address.governorate}
          </label>
        </div>
      ))}
    </div>
  );
};

const PaymentMethodSelection = ({ onPaymentMethodSelect }) => {
  const { t } = useTranslation();
  return (
    <div className="PaymentMethodSelection">
      <h3>{t("Checkout.paymentMethodSelection.title")}</h3>
      <input
        type="radio"
        name="paymentMethod"
        value="online"
        id="online"
        onChange={() => onPaymentMethodSelect("online")}
      />
      <label htmlFor="online">{t("Checkout.paymentMethodSelection.onlinePayment")}</label>
      <input
        type="radio"
        name="paymentMethod"
        value="cashOnDelivery"
        id="cashOnDelivery"
        onChange={() => onPaymentMethodSelect("cashOnDelivery")}
      />
      <label htmlFor="cashOnDelivery">{t("Checkout.paymentMethodSelection.cashOnDelivery")}</label>
    </div>
  );
};

const PaymentForm = () => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userId = useSelector((state) => state.user.uid);
  const navigate = useNavigate();

  const language = useSelector((state) => state.language.language);

const handleCheckout = async () => {
  if (isLoading) return;
  setIsLoading(true);

  if (!userId) {
    alert(t("Checkout.checkout.alerts.loginRequired"));
    setIsLoading(false);
    return;
  }
  if (!selectedAddress) {
    alert(t("Checkout.checkout.alerts.selectAddress"));
    setIsLoading(false);
    return;
  }
  if (!paymentMethod) {
    alert(t("Checkout.checkout.alerts.selectPaymentMethod"));
    setIsLoading(false);
    return;
  }

  const { total, shippingFee, finalTotal } = calculateTotal();
  const cartItems = JSON.parse(localStorage.getItem("CartItems")) || [];

  if (!cartItems.length) {
    alert(t("Checkout.checkout.alerts.emptyCart"));
    setIsLoading(false);
    return;
  }

  try {
    if (paymentMethod === "cashOnDelivery") {
      const order = {
        userId,
        address: selectedAddress,
        products: cartItems,
        totalAmount: finalTotal,
        shippingFee,
        orderDate: new Date().toISOString(),
        deliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: "cashOnDelivery",
        status: "Cash",
        orderStatus: "Processing",
      };

      await addDoc(collection(db, "Orders"), order);

      // تحديث المخزون والمبيعات بعد إنشاء الطلب بنجاح
      const batch = writeBatch(db);
      cartItems.forEach((item) => {
        const productRef = doc(db, "products", String(item.id));
        batch.update(productRef, {
          stock: increment(-item.quantity),
          sales: increment(item.quantity),
        });
      });
      await batch.commit();

      localStorage.removeItem("CartItems");
      alert(t("Checkout.checkout.alerts.orderSuccess"));
      navigate("/Profile/orders");
      window.location.reload();
    } else if (paymentMethod === "online") {
const API_BASE_URL = process.env.NODE_ENV === "production"
  ? "https://your-live-server.com"
  : "http://localhost:4242";
     const response = await fetch(`${API_BASE_URL}/checkout-success`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod,
          selectedAddress,
          cartItems,
          totalAmount: finalTotal,
          shippingFee,
          userId,
          language,
        }),
      });

      if (response.ok) {
        const { sessionId } = await response.json();
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({ sessionId });

  if (error) {
    console.error("خطأ أثناء الدفع:", error);
    alert(t("Checkout.checkout.alerts.errors.paymentError"));
  } else {
    localStorage.removeItem("CartItems");
    alert(t("Checkout.checkout.alerts.orderSuccess"));
    navigate("/Profile/orders");
    window.location.reload();
  }
} else {
  alert(t("Checkout.checkout.alerts.errors.paymentError"));
}
    }
  } catch (error) {
    console.error("خطأ أثناء تنفيذ عملية الدفع:", error);
    alert(t("Checkout.checkout.alerts.errors.paymentError"));
  } finally {
    setIsLoading(false);
  }
};



  const { total, shippingFee, finalTotal } = calculateTotal();

  return (
    <div>

      <ProductDisplay />

      <AddressSelection onSelectAddress={setSelectedAddress} />
      <PaymentMethodSelection onPaymentMethodSelect={setPaymentMethod} />

      <div className="SubTotal">
        <ul>
          <li>{t("Checkout.checkout.subtotal")}</li>
          <li><span>${total.toFixed(2)}</span></li>
        </ul>
        <ul>
          <li>{t("Checkout.checkout.shippingFee")}</li>
          <li><span>{shippingFee === 0 ? t("Checkout.checkout.freeShipping") : `$${shippingFee.toFixed(2)}`}</span></li>
        </ul>
        <ul>
          <li>{t("Checkout.checkout.totalAmount")}</li>
          <li><span>${finalTotal.toFixed(2)}</span></li>
        </ul>
      </div>


<button onClick={handleCheckout} disabled={isLoading}>
  {isLoading ? t("Checkout.checkout.processingOrder") : t("Checkout.checkout.completeOrder")}
</button>



    </div>
  );
};

export default PaymentForm;
