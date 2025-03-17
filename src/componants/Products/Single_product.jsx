import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadSingleProduct } from '../../redux/slices/singleProduct_slice';
import ProductRating from './ProductRating';
import ProductColors from './ProductColors';
import { cartActions } from '../../redux/slices/CartSlice';
import FavoriteButton from './FavoriteButton';
import { useTranslation } from 'react-i18next';
import {loadCategories} from '../../redux/slices/categorys_slice';
import {loadSubcategories} from '../../redux/slices/supCategorys_slice';

const SingleProduct = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.singleProduct);
  const [selectedColor, setSelectedColor] = useState(null);
  const { t } = useTranslation();
  const languageCode = useSelector((state) => state.language.language);
  const categories = useSelector((state) => state.categories.items);
  const subCategories = useSelector((state) => state.subcategories.items); // ✅ تعديل هنا

  useEffect(() => {
    dispatch(loadSingleProduct(productId));
    dispatch(loadSubcategories());
    dispatch(loadCategories());
  }, [dispatch, productId]);

  const handleColorClick = (color) => {
    setSelectedColor(color);
    console.log('Selected Color:', color);
  };

  const addToCart = () => {
    if (!selectedColor) {
      alert('Please select a color before adding to cart.');
      return;
    }

    const productToAdd = {
      ...product,
      color: selectedColor,
    };

    dispatch(cartActions.addToCart(productToAdd));
  };

  const getCategoryName = (id) => {
    const category = categories?.find((cat) => cat.id == id);
    return category ? category.name || "Unknown" : "Unknown";
  };
  const getSubCategoryName = (id) => {
    const subCategory = subCategories?.find((subCat) => subCat.id == id);
    return subCategory ? subCategory.name || "Unknown" : "Unknown";
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="Single_product">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <div className="image">
              <img src={product?.imageUrl} alt={product?.title?.[languageCode]} />
            </div>
          </div>

          <div className="col-lg-8">
            <div className="product-details">
              <div className="topOfBox">
                <h2>{product?.title?.[languageCode]}</h2>
                <FavoriteButton product={product || []} />
              </div>
              <p className="price">{t("Single-product.Price")}:  ${product?.price}</p>
              <ul>
                <p className="brand"><strong>{t("Single-product.Brand")}:</strong> {product?.brand?.[languageCode]}</p>
                <p className="category">
                  <strong>{t("Single-product.Category")}:</strong>
                  <Link to={`/category/${product?.categoryId}`}>
                    {getCategoryName(product?.categoryId)}
                  </Link>
                </p>
                <p className="sub-category">
                  <strong>{t("Single-product.Subcategory")}:</strong>
                  <Link to={`/subcategory/${product?.subCategoryId}`}>
                    {getSubCategoryName(product?.subCategoryId)}
                  </Link>
                </p>
                <p className="discount"><strong>{t("Single-product.Discount")}:</strong> {product?.discount}%</p>
                <p className="stock"><strong>{t("Single-product.Stock")}:</strong> {product?.stock}</p>
                <p className="reviews"><strong>{t("Single-product.Reviews")}:</strong> {product?.reviews}</p>
                <div className="rating"><strong>{t("Single-product.Rating")}:</strong> <ProductRating rating={product?.rating || 0} /></div>
              
              <div className="colors">
                <strong> {t("Single-product.Available-Colors")}:</strong>
                <ul>
                  <ProductColors colors={product?.color || []} onColorClick={handleColorClick} selectedColor={selectedColor} />
                </ul>
              </div>              
                
              </ul>
              <div className='discrip'>
                <p className="description"><strong>{t("Single-product.description")}:</strong> {product?.description?.[languageCode]}</p>
              </div>

              <div className="butons">
                <button onClick={addToCart} className="add_to_cart">
                  {t("Single-product.Add-to-Cart")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleProduct;
