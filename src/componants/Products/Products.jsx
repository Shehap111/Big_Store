import React from 'react'
import './products.css'
import ProductList from './ProductList'
import Intro from '../intro_sections/Intro';
import { useTranslation } from 'react-i18next';

const Products = () => {
    const { t } = useTranslation();
  
  return (
    <>
      <Intro link={t("Products.Products")} />
    
      
      
    <div className='Products pt-5'>

      <ProductList/>
    </div>
    
    </>
  )
}

export default Products