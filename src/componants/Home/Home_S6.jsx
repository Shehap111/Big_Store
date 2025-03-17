import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

const Home_S6 = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("language") || "en");

  useEffect(() => {
    const fetchBlogs = async () => {
      const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"), limit(5));
      const querySnapshot = await getDocs(q);
      const blogsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBlogs(blogsData);
    };

    fetchBlogs();

    // تحديث اللغة المختارة في حالة تغييرها داخل `localStorage`
    const handleStorageChange = () => {
      setSelectedLanguage(localStorage.getItem("language") || "en");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <section className="S6_home">
      <div className="container">
        <div className="intro">
          <h3> 📰 آخر الأخبار </h3>
          <p> Lorem ipsum dolor sit, amet consectetur adipisicing. </p>
        </div>
        <div className="row">
          {/* الشمال: أول خبر */}
          <div className="left-news col-lg-6">
            {blogs.slice(0, 1).map((blog) => (
              <div key={blog.id} className="news-item main-news">
                <div className="image">
                  <img className="news-image" src={blog.imageUrl} alt={blog.title[selectedLanguage]} />
                </div>
                <div className="news-overlay">
                  <Link to={`/blog/${blog.id}`}>
                    <h3>{blog.title[selectedLanguage]}</h3>
                  </Link>
                  <p>{blog.content[selectedLanguage]?.substring(0, 180)}...</p>
                  <div className="fott">
                    <div className="author-info">
                      <img className="author-image" src={blog.authorImage} alt={blog.authorName} />
                      <span>{blog.authorName}</span>
                    </div>
                    <span className="blog-date">
                      {new Date(blog.createdAt.seconds * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* اليمين: الثلاث أخبار الباقيين */}
          <div className="right-news col-lg-6">
            {blogs.slice(1, 4).map((blog) => (
              <div key={blog.id} className="right_news_box">
                <div className="box">
                  <Link to={`/blog/${blog.id}`}>
                    <h3>{blog.title[selectedLanguage]}</h3>
                  </Link>
                  <p>{blog.content[selectedLanguage]?.substring(0, 100)}...</p>
                  <div className="fott">
                    <div className="author-info">
                      <img className="author-image" src={blog.authorImage} alt={blog.authorName} />
                      <span>{blog.authorName}</span>
                    </div>
                    <span className="blog-date">
                      {new Date(blog.createdAt.seconds * 1000).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="side_image">
                  <img src={blog.imageUrl} alt={blog.title[selectedLanguage]} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <Link className="add_to_cart" to="/Blogs"> Read More Posts </Link>
      </div>
    </section>
  );
};

export default Home_S6;
