import React, { useState, useEffect } from "react";
import { db, storage } from "../../../firebase";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Add_SupCatt = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    name: { en: "", ar: "", fr: "", de: "" },
    description: { en: "", ar: "", fr: "", de: "" },
    image: "",
    parentCategory: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, "categories"));
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (lang, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setFormData((prev) => ({
      ...prev,
      parentCategory: categoryId,
    }));
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

    const { name, description } = formData;
    if (!name.en || !description.en || !selectedCategory || !imageFile) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    setLoading(true);

    try {
      const imageRef = ref(storage, `cat_supcat_images/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      const docRef = await addDoc(collection(db, "subcategories"), {
        ...formData,
        image: imageUrl,
      });

      await updateDoc(doc(db, "subcategories", docRef.id), {
        id: docRef.id,
      });

      alert("Subcategory added successfully!");
      setFormData({
        name: { en: "", ar: "", fr: "", de: "" },
        description: { en: "", ar: "", fr: "", de: "" },
        image: "",
        parentCategory: "",
      });
      setImageFile(null);
      setImagePreview("");
      setSelectedCategory("");
    } catch (error) {
      console.error("Error adding subcategory:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-supcatt-container">
      <h2>Add Subcategory</h2>
      <form onSubmit={handleSubmit}>
        {["en", "ar", "fr", "de"].map((lang) => (
          <div key={lang}>
            <label htmlFor={`name-${lang}`}>Name ({lang.toUpperCase()}):</label>
            <input
              type="text"
              id={`name-${lang}`}
              value={formData.name[lang]}
              onChange={(e) => handleInputChange(lang, "name", e.target.value)}
              placeholder={`Enter name in ${lang.toUpperCase()}`}
              required={lang === "en"}
            />

            <label htmlFor={`description-${lang}`}>
              Description ({lang.toUpperCase()}):
            </label>
            <textarea
              id={`description-${lang}`}
              value={formData.description[lang]}
              onChange={(e) =>
                handleInputChange(lang, "description", e.target.value)
              }
              placeholder={`Enter description in ${lang.toUpperCase()}`}
              required={lang === "en"}
            ></textarea>
          </div>
        ))}

        <label htmlFor="parentCategory">Parent Category:</label>
        <select
          id="parentCategory"
          value={selectedCategory}
          onChange={handleCategoryChange}
          required
        >
          <option value="">Select a Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name.en}
            </option>
          ))}
        </select>

        <label htmlFor="image">Image:</label>
        <input
          type="file"
          id="image"
          onChange={handleImageChange}
          accept="image/*"
          required
        />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="image-preview" />
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Subcategory"}
        </button>
      </form>
    </div>
  );
};

export default Add_SupCatt;