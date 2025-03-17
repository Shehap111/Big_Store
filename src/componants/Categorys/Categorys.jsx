import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { loadCategories } from '../../redux/slices/categorys_slice';
import { Link } from 'react-router-dom';
import Intro from '../intro_sections/Intro';
import './Categorys.css';

const Categorys = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { items, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(loadCategories());
  }, [dispatch]);

  if (loading) return <div>{t('loading')}</div>;
  if (error) return <div>{t('error')}: {error}</div>;

  return (
    <>
      <Intro link={t('categories.introLink')} />
      <div className="Categorys">
        <div className="container">
          <div className="row">
            {items.map((category) => (
              <div className="col-lg-4 col-md-6" key={category.id}>
                <div className="box">
                  <div className="image">
                    <img src={category.image} alt={category.name} />
                  </div>
                  <h3>{category.name}</h3> {/* بيانات من Firestore */}
                  <p>{category.description}</p> {/* بيانات من Firestore */}
                  <Link to={`/Category/${category.id}`}>{t('categories.view')}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Categorys;
