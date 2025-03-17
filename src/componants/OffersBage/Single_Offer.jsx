import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { loadSingleOffer, clearSingleOffer } from '../../redux/slices/offersSlice';
import { loadProducts } from '../../redux/slices/products_slice';
import FavoriteButton from '../Products/FavoriteButton';

const SingleOffer = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { singleOffer, loading, error } = useSelector((state) => state.offers);
  const { items: products } = useSelector((state) => state.products);
  const currentLang = useSelector((state) => state.language.language);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(loadProducts());
    }
    dispatch(loadSingleOffer(id));

    return () => {
      dispatch(clearSingleOffer());
    };
  }, [dispatch, id, products.length]);

  if (loading) return <p>{t('loading')}</p>;
  if (error) return <p>{t('error')} {error}</p>;
  if (!singleOffer) return <p>{t('not_found')}</p>;

  return (
    <div className='offer_box'>
      <h2>{singleOffer.title[currentLang]}</h2>
      <div className="content">
        <p><strong>{t('discount_price')}:</strong> ${singleOffer.discountPrice}</p>
        <p>{t('products')}: {singleOffer.products?.length || 0}</p>
        <p><strong>{t('expiry_date')}:</strong> {singleOffer.endDate}</p>
      </div>
      
<h3>{t('products')}</h3>
<div className="container Products">
  <div className="row">
    {Array.isArray(singleOffer.products) && singleOffer.products.length > 0 ? (
      singleOffer.products.map((productObj, index) => {
        const productId = productObj.id || productObj.productId;

        const product = products.find((p) => Number(p.id) === Number(productId));

        return product ? (
          <div key={product.id} className="col-lg-3 col-md-6">
            <div className=" box">
              <div className="image">
              <img src={product.imageUrl} alt={product.title?.[currentLang]} />
              </div>
              
              <div className="card-body">
                <Link to={`/product/${product.id}`}><h5 className="card-title">{product.title?.[currentLang]}</h5></Link>
                <p className="card-text">{product.description?.[currentLang]}</p>
              </div>
            </div>
          </div>
        ) : (
          <p key={index}>{t('product_not_found')} ({productId})</p>
        );
      })
    ) : (
      <p>{t('no_products')}</p>
    )}
  </div>
</div>

    </div>
  );
};

export default SingleOffer;
