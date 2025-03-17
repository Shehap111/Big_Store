import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSubcategories } from "../../redux/slices/supCategorys_slice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {Link} from "react-router-dom";

const Home_S3 = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.subcategories);
  
useEffect(() => {
  dispatch(loadSubcategories()); // ✅ امسح الداتا عشان تتصفر الأول
  dispatch(loadSubcategories("all")); // ✅ بعد المسح، حمّل كل الساب كاتيجوريز
}, [dispatch]);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="subcategories-slider">
      <h2>Explore Subcategories</h2>
<Swiper
  modules={[Autoplay, Pagination]}
  autoplay={{ delay: 3000, disableOnInteraction: false }}
  slidesPerView={5} // الافتراضي
  spaceBetween={20}
  pagination={{ clickable: true }}
  loop={true}
  breakpoints={{
    320: { slidesPerView: 2, spaceBetween: 10 }, // الموبايل
    768: { slidesPerView: 3, spaceBetween: 15 }, // التابلت
    1024: { slidesPerView: 5, spaceBetween: 20 }, // الديسكتوب
  }}
>

        {items.length > 0 ? (
          items.map((sub) => (
            <SwiperSlide key={sub.id}>
              <div className="subcategory-box">
                <img src={sub.image} alt={sub.name} className="subcategory-image" />
                <h4> <Link to={`/subcategory/${sub.id}`}> {sub.name} </Link>  </h4>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <div>No subcategories available</div>
        )}
      </Swiper>
    </div>
  );
};

export default Home_S3;
