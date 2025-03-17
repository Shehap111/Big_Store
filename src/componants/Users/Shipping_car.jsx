import React, { useState, useEffect } from "react";
import "./users.css";
import { useTranslation } from "react-i18next";
import shipping_car from '../../img/shipping_car.png'
const ShippingCar = ({ orderDate, deliveryDate }) => {
  const [position, setPosition] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useTranslation();

  const steps = [t("User.SingleOrder.Processing") , t("User.SingleOrder.Shipped"), t("User.SingleOrder.Delivered")]; // الخطوات الرئيسية
  const stepPositions = [0, 50, 100]; // نسب مواقع الخطوات على الخط

  const calculateTimeLeft = () => {
    const now = new Date();
    const orderTime = new Date(orderDate).getTime();
    const deliveryTime = new Date(deliveryDate).getTime();

    const timePassed = Math.max(now - orderTime, 0); // الوقت اللي مر
    const totalDuration = Math.max(deliveryTime - orderTime, 1); // المدة الكاملة

    return { timePassed, totalDuration };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const { timePassed, totalDuration } = calculateTimeLeft();
      const percentagePassed = Math.min(
        (timePassed / totalDuration) * 100,
        100
      ); // ما يزيدش عن 100%
      setPosition(percentagePassed);

      // تحديث الخطوة الحالية بناءً على موقع العربية
      const stepIndex = stepPositions.findIndex(
        (stepPos) => percentagePassed < stepPos
      );
      setCurrentStep(stepIndex === -1 ? steps.length - 1 : stepIndex - 1);

      if (percentagePassed >= 100) {
        clearInterval(interval); // إيقاف الحركة عند الاكتمال
      }
    }, 1000);

    return () => clearInterval(interval); // تنظيف عند الخروج
  }, [orderDate, deliveryDate]);

  return (
    <div className="order-shipment">
      <div className="shipment-path">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`step ${index <= currentStep ? "active" : ""}`}
            style={{ left: `${stepPositions[index]}%` }}
          >
            {step}
          </div>
        ))}
        <div
          className="shipment-car"
          style={{ left: `${position}%` }}
        >
          <img src={shipping_car} alt="shipping_car" />
        </div>
      </div>
    </div>
  );
};

export default ShippingCar;
