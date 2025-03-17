import { useState, useEffect } from "react";
import { db, storage } from "../../../firebase"; // تأكد من استيراد Firestore و Storage
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AddBlog = () => {
  const [blog, setBlog] = useState({
    title: { en: "", ar: "", de: "", fr: "" },
    content: { en: "", ar: "", de: "", fr: "" },
  });
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [blogImage, setBlogImage] = useState(null);
  const [authorImage, setAuthorImage] = useState(null);
  const [blogImageUrl, setBlogImageUrl] = useState("");
  const [authorImageUrl, setAuthorImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "categories"));
      setCategories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCategories();
  }, []);

  const handleUpload = async (file, folder, setImageUrl) => {
    const fileRef = ref(storage, `${folder}/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    setImageUrl(url);
  };

  const handleInputChange = (e, field, lang) => {
    setBlog({
      ...blog,
      [field]: {
        ...blog[field],
        [lang]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "blogs"), {
        title: blog.title,
        content: blog.content,
        category,
        authorName,
        authorImage: authorImageUrl,
        imageUrl: blogImageUrl,
        createdAt: serverTimestamp(),
      });
      alert("Blog added successfully!");
      setBlog({ title: { en: "", ar: "", de: "", fr: "" }, content: { en: "", ar: "", de: "", fr: "" } });
      setCategory("");
      setAuthorName("");
      setBlogImage(null);
      setAuthorImage(null);
      setBlogImageUrl("");
      setAuthorImageUrl("");
    } catch (error) {
      console.error("Error adding blog: ", error);
      alert("Failed to add blog");
    }
    setLoading(false);
  };

  return (
    <form className="Add_blog" onSubmit={handleSubmit}>

      <input type="file" id="img_blog" accept="image/*"  onChange={(e) => { setBlogImage(e.target.files[0]); handleUpload(e.target.files[0], "blogs", setBlogImageUrl); }} required />
      {blogImageUrl && <img src={blogImageUrl} alt="Blog Preview" width="100" />}   
      <label className="file-label" htmlFor="img_blog"> Choose image for blog </label>  

      {['en', 'ar', 'de', 'fr'].map((lang) => (
        <div key={lang}>
          <h4>{lang.toUpperCase()}</h4>
          <input
            type="text"
            placeholder={`Title (${lang.toUpperCase()})`}
            value={blog.title[lang]}
            onChange={(e) => handleInputChange(e, 'title', lang)}
            required={lang === 'en'}
          />
          <textarea
            placeholder={`Content (${lang.toUpperCase()})`}
            rows={5}
            value={blog.content[lang]}
            onChange={(e) => handleInputChange(e, 'content', lang)}
            required={lang === 'en'}
          />
        </div>
      ))}
      
      <select value={category} onChange={(e) => setCategory(e.target.value)} required>
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name.en}</option>
        ))}
      </select>
      
      <input type="text" placeholder="Author Name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} required />
      
 
      
      <input type="file" id="img_author" accept="image/*" onChange={(e) => { setAuthorImage(e.target.files[0]); handleUpload(e.target.files[0], "authors", setAuthorImageUrl); }} required />
      {authorImageUrl && <img src={authorImageUrl} alt="Author Preview" width="100" />}
      <label className="file-label" htmlFor="img_author"> Choose image for author </label>   
      
      <button type="submit" disabled={loading}>{loading ? "Uploading..." : "Add Blog"}</button>
    </form>
  );
};

export default AddBlog;
