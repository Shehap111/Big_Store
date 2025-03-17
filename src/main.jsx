import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './componants/main_root.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './Libraries/fontawesome/all.min.css';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import i18n from './i18n';  // تأكد من استيراد i18n

// استرجاع اللغة من Local Storage أو تعيين اللغة الافتراضية 'en'
const savedLanguage = localStorage.getItem('language') || 'en';

// تعيين اتجاه الصفحة بناءً على اللغة المحفوظة
const direction = savedLanguage === 'ar' ? 'rtl' : 'ltr';
document.documentElement.dir = direction;

// استخدام i18n لتعيين اللغة المحفوظة
i18n.changeLanguage(savedLanguage);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

