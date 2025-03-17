import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../firebase'; // Firebase initialization
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams } from 'react-router-dom';

const EditProduct = () => {
  const { productId } = useParams();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      console.error('Product ID is missing');
      return;
    }

    const fetchData = async () => {
      try {
        const productRef = doc(db, 'products', productId);
        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          const productData = productDoc.data();
          setProduct(productData);
          setSelectedCategory(productData.categoryId);
          setSelectedSubCategory(productData.subCategoryId);
          setRating(productData.rating);
          setImagePreview(productData.imageUrl);
        } else {
          console.error('No such product found in Firestore!');
        }

        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesData);

        const subCategoriesSnapshot = await getDocs(collection(db, 'subcategories'));
        const subCategoriesData = subCategoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSubCategories(subCategoriesData);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const handleInputChange = (e, field, lang) => {
    setProduct({
      ...product,
      [field]: {
        ...product[field],
        [lang]: e.target.value,
      },
    });
  };

  const handleSimpleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = product.imageUrl;

      if (imageFile) {
        const imageRef = ref(storage, `Products_images/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      await updateDoc(doc(db, 'products', productId), {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock),
        discount: Number(product.discount),
        rating,
        imageUrl,
      });

      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product: ', error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="add-product-container">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        {['en', 'ar', 'de', 'fr'].map((lang) => (
          <div key={lang}>
            <label htmlFor={`title-${lang}`}>Title ({lang.toUpperCase()}):</label>
            <input
              type="text"
              id={`title-${lang}`}
              value={product.title?.[lang] || ''}
              onChange={(e) => handleInputChange(e, 'title', lang)}
              placeholder={`Product Title (${lang.toUpperCase()})`}
              required
            />

            <label htmlFor={`brand-${lang}`}>Brand ({lang.toUpperCase()}):</label>
            <input
              type="text"
              id={`brand-${lang}`}
              value={product.brand?.[lang] || ''}
              onChange={(e) => handleInputChange(e, 'brand', lang)}
              placeholder={`Product Brand (${lang.toUpperCase()})`}
              required
            />

            <label htmlFor={`description-${lang}`}>Description ({lang.toUpperCase()}):</label>
            <textarea
              id={`description-${lang}`}
              value={product.description?.[lang] || ''}
              onChange={(e) => handleInputChange(e, 'description', lang)}
              placeholder={`Product Description (${lang.toUpperCase()})`}
              required
            ></textarea>
          </div>
        ))}

        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          name="price"
          value={product.price}
          onChange={handleSimpleChange}
          placeholder="Product Price"
          required
          min={0}
          step="0.01"
        />

        <label htmlFor="stock">Stock:</label>
        <input
          type="number"
          id="stock"
          name="stock"
          value={product.stock}
          onChange={handleSimpleChange}
          placeholder="Product Stock"
          required
          min={0}
        />

        <label htmlFor="discount">Discount (%):</label>
        <input
          type="number"
          id="discount"
          name="discount"
          value={product.discount}
          onChange={handleSimpleChange}
          placeholder="Product Discount"
          min={0}
        />

        <div className="cattSupcatt">
          <h3>{categories.find((cat) => cat.id === selectedCategory)?.name.en || 'No Category Selected'}</h3>
          <h5>{subCategories.find((sub) => sub.id === selectedSubCategory)?.name.en || 'No Subcategory Selected'}</h5>
        </div>

        <label htmlFor="rating">Rating (1 to 5):</label>
        <select id="rating" value={rating} onChange={(e) => setRating(Number(e.target.value))} required>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <label htmlFor="image">Image:</label>
        <input type="file" id="image" onChange={handleImageChange} accept="image/*" />
        {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default EditProduct;