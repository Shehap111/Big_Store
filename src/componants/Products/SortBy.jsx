import React from 'react';
import { useTranslation } from 'react-i18next';

const SortBy = ({ onSortChange }) => {
  const handleSortChange = (e) => {
    onSortChange(e.target.value);
  };
  const { t } = useTranslation();

  return (
    <div className="sort-by">
      <h4> {t("Products.Filters.Sort-By")}</h4>
      
    <div>
            <input
            type="radio"
            name="sort"
            id='price-asc'
            value="price-asc"
            onChange={handleSortChange}
          />
        <label htmlFor='price-asc'>
            {t("Products.Filters.Low-to-High")}
        </label>
    </div>
          

    <div>
         <input
            type="radio"
            name="sort"
            id='price-desc'
            value="price-desc"
            onChange={handleSortChange}
          />
        <label htmlFor='price-desc'>
            {t("Products.Filters.High-to-Low")}
        </label>
    </div>
          

    </div>
  );
};

export default SortBy;
