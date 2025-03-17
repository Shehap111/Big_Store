import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

const CheckoutOrLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {isLoggedIn ? (
        <Link className='add_to_cart' to='/checkout'> {t('Cart.Checkout')}</Link>
      ) : (
        <Link className='add_to_cart' to='/login'> {t('Cart.Login')} </Link>
      )}
    </div>
  );
};

export default CheckoutOrLogin;
