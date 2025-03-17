import React from "react";
import img1 from "../../img/settings.png";
import img2 from "../../img/settings.png";
import img3 from "../../img/settings.png";
import img4 from "../../img/settings.png";
import img5 from "../../img/settings.png";
import img6 from "../../img/settings.png";
import img7 from "../../img/settings.png";
import img8 from "../../img/settings.png";

const featuresData = [
  { img: img1, title: "Feature One", desc: "This is an amazing feature that helps you." },
  { img: img2, title: "Feature Two", desc: "Enhance your experience with this feature." },
  { img: img3, title: "Feature Three", desc: "A feature designed to make your life easier." },
  { img: img4, title: "Feature Four", desc: "The best feature for your business needs." },
  { img: img5, title: "Feature Five", desc: "A new way to improve your workflow." },
  { img: img6, title: "Feature Six", desc: "Save time and effort with this feature." },
  { img: img7, title: "Feature Seven", desc: "Boost your productivity with ease." },
  { img: img8, title: "Feature Eight", desc: "Stay ahead with this innovative feature." }
];

const Home_S2 = () => {
  return (
    <div className="S2_home">
      <div className="container">
        <div className="row">
          {featuresData.map((feature, index) => (
            <div className="col-lg-3 col-md-6 col-sm-6" key={index}>
              <div className="box">
                <div className="feature-card">
                  <div className="feature-inner">
                    <div className="feature-front">
                      <img src={feature.img} alt={feature.title} className="feature-img" />
                      <h3 className="feature-title">{feature.title}</h3>
                    </div>
                    <div className="feature-back">
                      <p className="feature-desc">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home_S2;
