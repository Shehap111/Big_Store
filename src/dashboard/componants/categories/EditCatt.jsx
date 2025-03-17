import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { useParams } from 'react-router-dom';

const EditCatt = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (!categoryId) {
      console.error('Category ID is missing');
      return;
    }

    const fetchData = async () => {
      try {
        const categoryRef = doc(db, 'categories', categoryId);
        const categoryDoc = await getDoc(categoryRef);
        if (categoryDoc.exists()) {
          const categoryData = categoryDoc.data();
          setCategory(categoryData);
          if (categoryData.image) {
            setImagePreview(categoryData.image);
          }
        } else {
          console.error('No such category found in Firestore!');
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  const handleInputChange = (e, field, lang) => {
    setCategory({
      ...category,
      [field]: {
        ...category[field],
        [lang]: e.target.value,
      },
    });
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
      let imageUrl = category.image;

      if (imageFile) {
        const imageRef = ref(storage, `cat_supcat_imges/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      await updateDoc(doc(db, 'categories', categoryId), {
        ...category,
        image: imageUrl,
      });

      alert('Category updated successfully!');
    } catch (error) {
      console.error('Error updating category: ', error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!category) return <p>Category not found.</p>;

  const languages = ['en', 'ar', 'fr', "de"]; // اللغات المدعومة

  return (
    <div className="edit-category-container">
      <h2>Edit Category</h2>

      <div className="image_pairnt">
        <label htmlFor="image">Image:</label>
        <input type="file" id="image" onChange={handleImageChange} accept="image/*" />
        {imagePreview && <img className='' src={imagePreview} alt="Preview" />}
      </div>

      <form onSubmit={handleSubmit}>
        {languages.map((lang) => (
          <div key={lang}>
            <label htmlFor={`name-${lang}`}>Category Name ({lang}):</label>
            <input
              type="text"
              id={`name-${lang}`}
              value={category?.name?.[lang] || ''}
              onChange={(e) => handleInputChange(e, 'name', lang)}
              placeholder={`Category Name (${lang})`}
              required
            />

            <label htmlFor={`description-${lang}`}>Description ({lang}):</label>
            <textarea
              id={`description-${lang}`}
              value={category?.description?.[lang] || ''}
              onChange={(e) => handleInputChange(e, 'description', lang)}
              placeholder={`Category Description (${lang})`}
              required
            ></textarea>
          </div>
        ))}

        <button type="submit">Update Category</button>
      </form>
    </div>
  );
};

export default EditCatt;