import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadTrendingProducts, setFilter, setSortBy } from "../../redux/slices/trendingProducts_Slice";
import PriceRangeSlider from "./PriceRangeSlider";
import Filtters_home from "./Filtters_home";
import { cartActions } from '../../redux/slices/CartSlice';
import {Link} from "react-router-dom";
import FavoriteButton from "../Products/FavoriteButton";
import ProductRating from "../Products/ProductRating";
import {t} from "i18next";

const Home_S4 = () => {
  const dispatch = useDispatch();
  const { items = [], loading, error, filters, sortBy } = useSelector((state) => state.trendingProducts);
  const languageCode = useSelector((state) => state.language.language);
  useEffect(() => {
    dispatch(loadTrendingProducts());
  }, [dispatch, JSON.stringify(filters), sortBy]); // ✅ استخدام JSON.stringify لتجنب الـ infinite loop

  const subcategories = useSelector((state) => state.subcategories.items) || [];
  const subcategoryOptions = subcategories.map((sub) => ({
    label: sub.name,
    value: sub.id,
  }));

  return (
    <section className="S4_home">
      <div className="container">
        <div className="intro">
          <h3>What's Trending Now</h3>
          <p> Lorem, ipsum dolor sit amet consectetur adipisicing. </p>
        </div>

        {/* ✅ الفلترات */}
        <div className="filters">
          {/* <div className="right_side">
              <PriceRangeSlider filters={filters} dispatch={dispatch} setFilter={setFilter} />
          </div> */}
          <div className="left_side">
            <Filtters_home
              filters={filters}
              dispatch={dispatch}
              setFilter={setFilter}
              setSortBy={setSortBy}
              subcategories={subcategoryOptions}
            />            
          </div>
          
        </div>

        {/* ✅ عرض المنتجات */}
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        <div className="Products row">
          {items.length > 0 ? (
            items.slice(0, 8).map((product) => (
              <div key={product.id} className="col-lg-3 col-md-6">
          <div className="box">
            <div className="image">
  {product.discount >= 1 && <div className="discount">%{product.discount}</div>}
              <img src={product.imageUrl} alt={product.title[languageCode]} />
            </div>
            <ul>
              <Link to={`/product/${product.id}`}>
                {product.title[languageCode] } {/* تأكد من أن القيمة هنا هي نص */}
              </Link>
              <FavoriteButton product={product} />
            </ul>
            <p>{product.description[languageCode]  || 'No description available'}</p> {/* نفس الشيء هنا، تأكد من أن الـ description هي نص */}
            <ul>
              <span>${product.price}</span>
              <ProductRating rating={product.rating} />
            </ul>
            <button onClick={() => dispatch(cartActions.addToCart(product))} className='add_to_cart'>
               {t('Products_by_supcat.addToCart')}
            </button>
          </div>
              </div>
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Home_S4;
