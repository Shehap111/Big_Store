import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../firebase';
import { collection, getDocs, addDoc ,serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [productData, setProductData] = useState({
    title: { ar: '', en: '', fr: '', de: '' },
    brand: { ar: '', en: '', fr: '', de: '' },
    description: { ar: '', en: '', fr: '', de: '' },
    price: '',
    discount: '',
    stock: '',
    reviews: '',
    color: [],
    imageFile: null,
    imageUrl: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(categoriesData);
    };
    fetchCategories();
  }, []);

const handleCategoryChange = async (e) => {
  const categoryId = e.target.value;
  setSelectedCategory(categoryId);

  try {
    const subCategoriesSnapshot = await getDocs(collection(db, 'subcategories'));
    const filteredSubCategories = subCategoriesSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(subCategory => subCategory.parentCategory === categoryId); // المقارنة المباشرة للنصوص
    setSubCategories(filteredSubCategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
  }
};


  const handleInputChange = (e, field, lang = null) => {
    const { value } = e.target;
    if (lang) {
      setProductData(prevData => ({
        ...prevData,
        [field]: {
          ...prevData[field],
          [lang]: value
        }
      }));
    } else {
      setProductData({ ...productData, [field]: value });
    }
  };

  const handleColorChange = (index, value) => {
    const updatedColors = [...productData.color];
    updatedColors[index] = value;
    setProductData({ ...productData, color: updatedColors });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductData({ ...productData, imageFile: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddColor = () => {
    setProductData({ ...productData, color: [...productData.color, ''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory || !selectedSubCategory || !productData.imageFile) {
      alert('Please fill all required fields and select an image.');
      return;
    }

    setIsSubmitting(true);

    try {
      const imageRef = ref(storage, `Products_imges/${productData.imageFile.name}`);
      await uploadBytes(imageRef, productData.imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      await addDoc(collection(db, 'products'), {
        title: productData.title,
        brand: productData.brand,
        description: productData.description,
        price: Number(productData.price),
        discount: Number(productData.discount),
        stock: Number(productData.stock),
        reviews: Number(productData.reviews),
        color: productData.color,
        categoryId: selectedCategory,
        subCategoryId: selectedSubCategory,
        imageUrl,
        createdAt: serverTimestamp(),
        sales: 0,
        rating:0
      });

      alert('Product added successfully!');
      setProductData({
        title: { ar: '', en: '', fr: '', de: '' },
        brand: { ar: '', en: '', fr: '', de: '' },
        description: { ar: '', en: '', fr: '', de: '' },
        price: '',
        discount: '',
        stock: '',
        reviews: '',
        color: [],
        imageFile: null,
        imageUrl: '',
      });
      setImagePreview(null);
      setSelectedCategory('');
      setSelectedSubCategory('');
    } catch (error) {
      console.error('Error adding product: ', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit} className="form">
        {['ar', 'en', 'fr', 'de'].map(lang => (
          <div key={lang}>
            <label>Title ({lang}):</label>
            <input
              type="text"
              value={productData.title[lang]}
              onChange={(e) => handleInputChange(e, 'title', lang)}
              placeholder={`Product Title (${lang})`}
              required
            />

            <label>Brand ({lang}):</label>
            <input
              type="text"
              value={productData.brand[lang]}
              onChange={(e) => handleInputChange(e, 'brand', lang)}
              placeholder={`Product Brand (${lang})`}
              required
            />

            <label>Description ({lang}):</label>
            <textarea
              value={productData.description[lang]}
              onChange={(e) => handleInputChange(e, 'description', lang)}
              placeholder={`Product Description (${lang})`}
              required
            ></textarea>
          </div>
        ))}

        <label>Price:</label>
        <input
          type="number"
          value={productData.price}
          onChange={(e) => handleInputChange(e, 'price')}
          placeholder="Product Price"
          required
          min={0}
          step="0.01"
        />

        <label>Discount (%):</label>
        <input
          type="number"
          value={productData.discount}
          onChange={(e) => handleInputChange(e, 'discount')}
          placeholder="Product Discount"
          min={0}
        />

        <label>Stock:</label>
        <input
          type="number"
          value={productData.stock}
          onChange={(e) => handleInputChange(e, 'stock')}
          placeholder="Product Stock"
          required
          min={0}
        />

        <label>Category:</label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name.en}
            </option>
          ))}
        </select>

        <label>Subcategory:</label>
        <select
          value={selectedSubCategory}
          onChange={(e) => setSelectedSubCategory(e.target.value)}
          required
        >
          <option value="">Select Subcategory</option>
          {subCategories.map(subCategory => (
            <option key={subCategory.id} value={subCategory.id}>
              {subCategory.name.en}
            </option>
          ))}
        </select>

        <label>Colors:</label>
        {productData.color.map((color, index) => (
          <div key={index} className="color-input">
            <input
              type="text"
              value={color}
              onChange={(e) => handleColorChange(index, e.target.value)}
              placeholder={`Color ${index + 1}`}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddColor} className="add-color-button">
          Add Color
        </button>

        <label>Image:</label>
        <input type="file" onChange={handleImageChange} accept="image/*" />
        {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;