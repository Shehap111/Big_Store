import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useTranslation } from 'react-i18next';
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';


const OfferItem = ({offer , calculateTimeLeft,currentLang}) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(offer.endDate));




  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(offer.endDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [offer.endDate]);



  return (
    <div className='offer_box'>
            <hr />

      <div className='content'>
        <Link to={`/offer/${offer.id}`}><h3>{offer.title[currentLang]}</h3></Link>
        <p>{t('discount')}: ${offer.discountPrice}</p>
<p>{t('products')}: {offer.products?.length || 0}</p>
        {timeLeft ? (
          <p className='expiry_date'>{t('expiry_date')}: <span> {timeLeft.days}d </span> <span> {timeLeft.hours}h </span> <span> {timeLeft.minutes}m  </span> <span> {timeLeft.seconds}s </span> </p>
        ) : (
          <p>{t('expired')}</p>
        )}
      </div>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={4}
        loop={true}
        navigation={true}
        pagination={{ clickable: true }}
        className='offer-swiper'
          breakpoints={{
    320: { slidesPerView: 2, spaceBetween: 10 }, // الموبايل
    768: { slidesPerView: 3, spaceBetween: 15 }, // التابلت
    1024: { slidesPerView: 4, spaceBetween: 20 }, // الديسكتوب
  }}
      >
        {offer.products.map((product) => (
          <SwiperSlide key={product.id} className='box_slider'>
            <div className='image'>
              <img src={product.imageUrl} alt={product.title[currentLang]} />
            </div>
            <Link to={`/product/${product.id}`}> <h4>{product.title[currentLang]}</h4>  </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
export default OfferItem