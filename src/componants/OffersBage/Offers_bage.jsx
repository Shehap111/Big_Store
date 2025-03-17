import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { loadOffers } from '../../redux/slices/offersSlice';
import { cartActions } from '../../redux/slices/CartSlice';
import OfferItem from './OfferItem';
import './offers.css';
import Intro from '../intro_sections/Intro';

const OffersPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { items: offers, loading, error } = useSelector((state) => state.offers);
  const currentLang = useSelector((state) => state.language.language);

  // ✅ حساب الوقت المتبقي للعرض
  const calculateTimeLeft = (endDate) => {
    const difference = new Date(endDate) - new Date();
    if (difference <= 0) return null; // لو انتهى العرض، نرجّع null
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  // ✅ تصفية العروض غير المنتهية فقط
  const validOffers = offers.filter((offer) => calculateTimeLeft(offer.endDate) !== null);

  useEffect(() => {
    dispatch(loadOffers());
  }, [dispatch]);

  return (
    <>
      <Intro link="Offers" />
      <div className="Offers">
        <div className="container">
          {loading && <p>{t('loading')}</p>}
          {error && <p>{t('error')}: {error}</p>}
          <div>
            {validOffers.map((offer) => (
              <div key={offer.id}>
                <OfferItem offer={offer} currentLang={currentLang} calculateTimeLeft={calculateTimeLeft} />
                <button
                  className="add_to_cart"
                  onClick={() => {
                    dispatch(cartActions.addOfferToCart({
                      id: offer.id,
                      title: offer.title,
                      discountPrice: offer.discountPrice || 0, 
                      products: offer.products || [], 
                    }));
                  }}
                >
                  {t('add_to_cart')}
                </button>
              </div>
            ))}
            <hr />
          </div>
        </div>
      </div>
    </>
  );
};

export default OffersPage;
