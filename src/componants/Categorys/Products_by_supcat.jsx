import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadProductsBySubCategory } from "../../redux/slices/Products_by_supcat_slice";
import { cartActions } from "../../redux/slices/CartSlice";
import { useTranslation } from "react-i18next";
import Intro from "../intro_sections/Intro";
import ProductRating from "../Products/ProductRating";
import FavoriteButton from "../Products/FavoriteButton";
import "../Products/products.css";

const ProductsBySubcat = () => {
  const { subcategoryId } = useParams();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.productsBySubCategory);
  const languageCode = useSelector((state) => state.language.language);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(loadProductsBySubCategory(subcategoryId));
  }, [dispatch, subcategoryId]);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Intro link={t("Products_by_supcat.products")} />
      <div className="Products">
        <div className="container">
          <div className="row">
            {items.map((product) => (
              <div className="col-lg-4 col-md-6" key={product.id}>
                <div className="box">
                  <div className="image">
                    <div className="discount">%{product.discount}</div>
                    <img src={product.imageUrl} alt={product.title[languageCode] } />
                  </div>
                  <ul>
                    <Link to={`/product/${product.id}`}>{product.title[languageCode] }</Link>
                    <FavoriteButton product={product} />
                  </ul>
                  <p>{product.description[languageCode] }</p>
                  <ul>
                    <span>${product.price}</span>
                    <ProductRating rating={product.rating} />
                  </ul>
                  <button onClick={() => dispatch(cartActions.addToCart(product))} className="add_to_cart">
                    {t("Products_by_supcat.addToCart")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsBySubcat;
