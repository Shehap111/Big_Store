import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "./home.css"; // استدعاء ملف CSS الخارجي
import img1 from "../../img/intro_section.webp";
import img2 from "../../img/background-S2-About.jpg";
import img3 from "../../img/S3_about_4.jpg";

const Home_S1 = () => {
  return (
    <div className="home-slider">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="swiper-container"
      >
        {[img1, img2, img3].map((img, index) => (
          <SwiperSlide key={index} className="swiper-slide" style={{ backgroundImage: `url(${img})` }}>
            <div className="overlay"></div>
            <div className="slide-content">
              <h1>Welcome to Our Store</h1>
              <p>Discover the best products at unbeatable prices</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Home_S1;
