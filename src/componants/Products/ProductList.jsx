import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadProducts } from '../../redux/slices/products_slice';
import { loadCategories } from '../../redux/slices/categorys_slice';
import { Link } from 'react-router-dom';
import ProductRating from '../Products/ProductRating';
import FavoriteButton from '../Products/FavoriteButton';
import { cartActions } from '../../redux/slices/CartSlice';
import './products.css';
import Pagination from './Pagination';
import SortBy from './SortBy';
import { useTranslation } from 'react-i18next';

const ProductsList = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);
  const { items: categories, loading: categoriesLoading, error: categoriesError } = useSelector(
    (state) => state.categories
  );
  
const languageCode = useSelector((state) => state.language.language);
  // States for Filters
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 2500]);
  const [minRating, setMinRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('');
  const itemsPerPage = 12; // Number of products per page
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const ratings = [1, 2, 3, 4, 5];
  const { t } = useTranslation();

  // Load Products and Categories
  useEffect(() => {
    dispatch(loadProducts());
    dispatch(loadCategories());
  }, [dispatch]);

  if (loading || categoriesLoading) return <div>Loading...</div>;
  if (error || categoriesError) return <div>Error: {error || categoriesError}</div>;


  
const filteredProducts = items.filter((product) => {
  const matchesCategory = category ? String(product.categoryId) === String(category) : true;
  const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
  const matchesRating = product.rating >= minRating;
  console.log(matchesRating);
  return matchesCategory && matchesPrice && matchesRating;
});


  // Sort Logic
  const sortProducts = (products) => {
    switch (sortOption) {
      case 'price-asc':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...products].sort((a, b) => b.price - a.price);
      case 'rating-asc':
        return [...products].sort((a, b) => a.rating - b.rating);
      case 'rating-desc':
        return [...products].sort((a, b) => b.rating - a.rating);
      default:
        return products;
    }
  };
  const sortedProducts = sortProducts(filteredProducts);

  // Pagination Logic
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };



  return (
    <section className="Product_list">
      <div className="container">
        <div className="row">
          {/* Filters Section */}
          <div className="col-lg-3">
            <div className="filters">
              <h3>{t("Products.Filters.Filters")}</h3>

              {/* Category Filter */}
              <div className="filter-item">
                <h4>{t("Products.Filters.Category")}</h4>
                <select value={category} onChange={(e) => setCategory(e.target.value.toString())}>
                  <option value="">{t("Products.Filters.All")}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>

                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="filter-item">
                <h4>
                 {t("Products.Filters.Minimum-Rating")} <i className="fa-regular fa-star"></i>
                </h4>
                <div className="custom-dropdown">
                  <button
                    className="dropdown-toggle"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {Array.from({ length: minRating }, (_, index) => (
                      <i key={index} className="fa-solid fa-star"></i>
                    ))}
                    {Array.from({ length: 5 - minRating }, (_, index) => (
                      <i key={index} className="fa-regular fa-star"></i>
                    ))}
                  </button>
                  {dropdownOpen && (
                    <ul className="dropdown_menu">
                      <li onClick={() => setMinRating(0)}>
                        <i className="fa-regular fa-star"></i> {t("Products.Filters.All")}
                      </li>
                      {ratings.map((rating) => (
                        <li key={rating} onClick={() => setMinRating(rating)}>
                          {Array.from({ length: rating }, (_, index) => (
                            <i key={index} className="fa-solid fa-star"></i>
                          ))}
                          {Array.from({ length: 5 - rating }, (_, index) => (
                            <i key={index} className="fa-regular fa-star"></i>
                          ))}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="filter-item">
                <h4>{t("Products.Filters.Price-Range")}</h4>
                <input
                  className='Price_range'
                  type="range"
                  min="0"
                  max="1500"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                />
                <p>
                  <span> ${priceRange[0]} </span> <span> ${priceRange[1]} </span>
                </p>
              </div>

              {/* SortBy Component */}
              <div className="sortBy">
                <SortBy onSortChange={handleSortChange} />
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="col-lg-9">
            <div className="Products">
              <div className="container">
                <div className="row">
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <div className="col-lg-4 col-md-6" key={product.id}>
                        <div className="box">
                          <div className="image">
                          {product.discount >= 1 && <div className="discount">%{product.discount}</div>}

                            <img src={product.imageUrl} alt={product.title[languageCode]} />
                          </div>
                          <ul>
                            <Link to={`/product/${product.id}`}>{product.title[languageCode]}</Link>
                            <FavoriteButton product={product } />
                          </ul>
                          <p>{product.description[languageCode]}</p>
                          <ul>
                            <span>${product.price}</span>
                            <ProductRating rating={product.rating} />
                          </ul>
<button
  onClick={() => {
    dispatch(cartActions.addToCart(product));
  }}
  className="add_to_cart"
>
  {t("Products.Product.Add-to-Cart")}
</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-products">{t("Products.Product.No-products-match")}</div>
                  )}
                </div>

                {/* Pagination Controls */}
                <div className="pagination-controls">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                  >
                    <i className="fa-solid fa-angle-left"></i>
                  </button>

                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    paginate={paginate}
                  />

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <i className="fa-solid fa-angle-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsList;
