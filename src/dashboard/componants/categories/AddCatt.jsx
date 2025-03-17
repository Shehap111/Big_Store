import React, { useState } from 'react';
import { db, storage } from '../../../firebase'; // Firebase initialization
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddCatt = () => {
  const [category, setCategory] = useState({
    id: '',
    name: {
      en: '',
      ar: '',
      de: '',
      fr: '',
    },
    description: {
      en: '',
      ar: '',
      de: '',
      fr: '',
    },
    image: '',
  });
  const [imageFile, setImageFile] = useState(null); // Local image file
  const [imagePreview, setImagePreview] = useState(null); // Image preview
  const [loading, setLoading] = useState(false); // Loading state

  // Handle input changes for name and description
  const handleInputChange = (e, field, lang) => {
    setCategory({
      ...category,
      [field]: {
        ...category[field],
        [lang]: e.target.value,
      },
    });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !category.name.en ||
      !category.description.en ||
      !imageFile
    ) {
      alert('Please fill all required fields and select an image.');
      return;
    }

    setLoading(true); // Set loading to true

    try {
      // Save image to Firebase Storage
      const imageRef = ref(storage, `cat_supcat_imges/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      // Add category to Firestore and get the generated document ID
      const docRef = await addDoc(collection(db, 'categories'), {
        name: category.name,
        description: category.description,
        image: imageUrl,
      });

      // Update the document to include the Firestore-generated ID
      await setDoc(doc(db, 'categories', docRef.id), {
        id: docRef.id, // Add the generated ID to the document
        name: category.name,
        description: category.description,
        image: imageUrl,
      });

      alert('Category added successfully!');
      setCategory({
        id: '',
        name: { en: '', ar: '', de: '', fr: '' },
        description: { en: '', ar: '', de: '', fr: '' },
        image: '',
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error adding category:', error.message);
      alert('Error adding category. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="add-category-container">
      <h2>Add Category</h2>
      <form onSubmit={handleSubmit}>
        {['en', 'ar', 'de', 'fr'].map((lang) => (
          <div key={lang}>
            <label htmlFor={`name-${lang}`}>Name ({lang.toUpperCase()}):</label>
            <input
              type="text"
              id={`name-${lang}`}
              value={category.name[lang]}
              onChange={(e) => handleInputChange(e, 'name', lang)}
              placeholder={`Category Name (${lang.toUpperCase()})`}
              required={lang === 'en'}
            />

            <label htmlFor={`description-${lang}`}>Description ({lang.toUpperCase()}):</label>
            <textarea
              id={`description-${lang}`}
              value={category.description[lang]}
              onChange={(e) => handleInputChange(e, 'description', lang)}
              placeholder={`Category Description (${lang.toUpperCase()})`}
              required={lang === 'en'}
            ></textarea>
          </div>
        ))}

        <label htmlFor="image">Image:</label>
        <input type="file" id="image" onChange={handleImageChange} accept="image/*" />
        {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Category'}
        </button>
      </form>
    </div>
  );
};

export default AddCatt;
