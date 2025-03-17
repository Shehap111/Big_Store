import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { useParams } from 'react-router-dom';

const EditSubcategory = () => {
  const { subCategoryId } = useParams();
  const [subCategory, setSubCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [parentCategories, setParentCategories] = useState([]);
  const [selectedParentCategory, setSelectedParentCategory] = useState('');

  useEffect(() => {
    if (!subCategoryId) {
      console.error('SubCategory ID is missing');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch subcategory data
        const subCategoryRef = doc(db, 'subcategories', subCategoryId);
        const subCategoryDoc = await getDoc(subCategoryRef);

        if (subCategoryDoc.exists()) {
          setSubCategory(subCategoryDoc.data());
        } else {
          console.error('No such subcategory found!');
        }

        // Fetch parent categories
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesList = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setParentCategories(categoriesList);

      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subCategoryId]);

  const handleInputChange = (e) => {
    const { name, value, dataset } = e.target;
    const lang = dataset.lang || 'en';

    setSubCategory(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        [lang]: value,
      },
    }));
  };

  const handleParentCategoryChange = (e) => {
    setSelectedParentCategory(e.target.value);
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
      let imageUrl = subCategory.image;

      if (imageFile) {
        const imageRef = ref(storage, `cat_supcat_imges/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      await updateDoc(doc(db, 'subcategories', subCategoryId), {
        ...subCategory,
        image: imageUrl,
        parentCategory: selectedParentCategory,
      });

      alert('Subcategory updated successfully!');
    } catch (error) {
      console.error('Error updating subcategory:', error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!subCategory) return <p>Subcategory not found.</p>;

  return (
    <div className="edit-subcategory-container">
      <h2>Edit Subcategory</h2>

      <div className="image-pairnt">
        <label htmlFor="image">Image:</label>
        <input type="file" id="image" onChange={handleImageChange} accept="image/*" />
        {imagePreview && <img className='image-preview' src={imagePreview} alt="Preview" />}
      </div>

      <form onSubmit={handleSubmit}>
        {['en', 'ar', 'fr', 'de'].map(lang => (
          <div className='mb-5 mt-1' key={lang}>
            <label htmlFor={`name-${lang}`}>Subcategory Name ({lang}):</label>
            <input
              type="text"
              id={`name-${lang}`}
              name="name"
              data-lang={lang}
              value={subCategory.name?.[lang] || ''}
              onChange={handleInputChange}
              placeholder={`Subcategory Name (${lang})`}
              required
            />

            <label htmlFor={`description-${lang}`}>Description ({lang}):</label>
            <textarea
              id={`description-${lang}`}
              name="description"
              data-lang={lang}
              value={subCategory.description?.[lang] || ''}
              onChange={handleInputChange}
              placeholder={`Subcategory Description (${lang})`}
              required
            ></textarea>
          </div>
        ))}

        <label htmlFor="parentCategory">Parent Category:</label>
<select 
  id="parentCategory" 
  defaultValue={subCategory?.parentCategory || ""} 
  onChange={handleParentCategoryChange} 
  required
>
  <option value="">Select Parent Category</option>
  {parentCategories.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name?.en || category.id}
    </option>
  ))}
</select>


        <button type="submit">Update Subcategory</button>
      </form>
    </div>
  );
};

export default EditSubcategory;
