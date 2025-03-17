import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../../../firebase";
import { doc, getDoc, updateDoc, getDocs, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const LANGUAGES = ["en", "ar","de" , "fr"]; // اللغات المتاحة

const Edit_blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState({});
  const [content, setContent] = useState({});
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [blogImageUrl, setBlogImageUrl] = useState("");
  const [authorImageUrl, setAuthorImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      const docRef = doc(db, "blogs", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title || {});
        setContent(data.content || {});
        setCategory(data.category);
        setAuthorName(data.authorName);
        setBlogImageUrl(data.imageUrl);
        setAuthorImageUrl(data.authorImage);
      }
    };
    fetchBlog();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "categories"));
      setCategories(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchCategories();
  }, []);

  const handleUpload = async (file, folder, setImageUrl) => {
    const fileRef = ref(storage, `${folder}/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    setImageUrl(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = doc(db, "blogs", id);
      await updateDoc(docRef, {
        title,
        content,
        category,
        authorName,
        imageUrl: blogImageUrl,
        authorImage: authorImageUrl,
      });
      alert("Blog updated successfully!");
      navigate("/Main_dashboard/blogs");
    } catch (error) {
      console.error("Error updating blog: ", error);
      alert("Failed to update blog");
    }
    setLoading(false);
  };

  return (
    <form className="Add_blog" onSubmit={handleSubmit}>
      <input
        type="file"
        id="img_blog"
        accept="image/*"
        onChange={(e) => handleUpload(e.target.files[0], "blogs", setBlogImageUrl)}
      />
      {blogImageUrl && <img src={blogImageUrl} alt="Blog Preview" width="100" />}
      <label className="file-label" htmlFor="img_blog">Choose image for blog</label>

      {LANGUAGES.map((lang) => (
        <div key={lang}>
          <h4>{lang.toUpperCase()}</h4>
          <input
            type="text"
            placeholder={`Title (${lang})`}
            value={title[lang] || ""}
            onChange={(e) => setTitle((prev) => ({ ...prev, [lang]: e.target.value }))}
            required
          />
          <textarea
            placeholder={`Content (${lang})`}
            rows={5}
            value={content[lang] || ""}
            onChange={(e) => setContent((prev) => ({ ...prev, [lang]: e.target.value }))}
            required
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

      <input
        type="file"
        id="img_author"
        accept="image/*"
        onChange={(e) => handleUpload(e.target.files[0], "authors", setAuthorImageUrl)}
      />
      {authorImageUrl && <img src={authorImageUrl} alt="Author Preview" width="100" />}
      <label className="file-label" htmlFor="img_author">Choose image for author</label>

      <button type="submit" disabled={loading}>{loading ? "Updating..." : "Update Blog"}</button>
    </form>
  );
};

export default Edit_blog;
