import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Intro from '../intro_sections/Intro';
import { useTranslation } from "react-i18next";

// على صفحة success (التي تتعامل مع checkout-success)
const queryParams = new URLSearchParams(window.location.search);
const sessionId = queryParams.get("session_id");

if (sessionId) {
  // إرسال الـ sessionId إلى السيرفر لمعالجة الأوردر
  const response = await fetch('http://localhost:4242/checkout-success', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId }),
  });

  if (response.ok) {
    console.log("Order successfully saved.");
    // يمكنك توجيه المستخدم لصفحة أخرى أو عرض رسالة بنجاح
  } else {
    console.log("Error saving order.");
  }
}





const SuccessPage = () => {
  const navigate = useNavigate();
    const { t } = useTranslation();


  useEffect(() => {

      // فرغ  السلة من الـ Local Storage
    localStorage.removeItem('CartItems');
    setTimeout(() => {
      navigate('/Profile/orders'); 
      window.location.reload(); 
    }, 2000);
  }, [navigate]);


  return (
    <div >
 <Intro link='Success purchasing'/>
        
 <div className="SuccessPage  w-50 d-flex flex-column mx-auto  pt-5 vh-100 bg-light">
      <div className="alert alert-success text-center p-4 shadow-lg rounded">
        <div className="mb-3">
          <i className="fa fa-check-circle fa-3x text-success"></i>
        </div>
          <h3 className="mb-0">
            {t("Checkout.SuccessPage.Payment-completed-successfully")}
        </h3>
          <p className="mt-2">
            {t("Checkout.SuccessPage.Thank-for-purchasing")}
        </p>
      </div>
    </div>

    </div>
  );
};

export default SuccessPage;
