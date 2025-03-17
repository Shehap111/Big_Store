import React, { useEffect, useState } from 'react';
import { db } from '../../firebase'; // استيراد إعدادات Firebase
import { collection, getDocs, query, where } from 'firebase/firestore'; // استيراد الدوال اللازمة
import { Link, useParams } from 'react-router-dom'; // استيراد useParams للوصول للبارامترز
import { useDispatch, useSelector } from 'react-redux';
import { loadSubcategories } from '../../redux/slices/supCategorys_slice';
import Intro from '../intro_sections/Intro';
import { useTranslation } from 'react-i18next';

const Sup_Categorys = () => {
  const {categoryId} = useParams(); // الحصول على ID الكاتيجوري من URL
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.subcategories);

  // استخدام useEffect لجلب البيانات بناءً على categoryId
  useEffect(() => {
    if (categoryId) {
      dispatch(loadSubcategories(categoryId)); // إرسال الـ categoryId كـ string مباشرة
    }
  }, [dispatch, categoryId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Intro link={t('supCategories.introLink')} />
      
      <div className="Sup_cat Categorys">
        <div className="container">
          <div className="row">
            {items.map((subcategory) => (
              <div className="col-lg-4 col-md-6" key={subcategory.id}>
                <div className="box">
                  <div className="image">
                    <img src={subcategory.image} alt={subcategory.name} />
                  </div>
                  <h3>{subcategory.name}</h3>
                  <p>{subcategory.description}</p>
                  <Link to={`/subcategory/${subcategory.id}`}>{t('supCategories.view')}</Link>
                </div>
              </div>
            ))}
          </div>          
        </div>
      </div>
    </div>
  );
};

export default Sup_Categorys;
