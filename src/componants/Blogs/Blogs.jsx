import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { loadBlogs } from '../../redux/slices/blogsSlice'; // تأكد من المسار الصحيح للسلايس
import Intro from '../intro_sections/Intro';
import './blog.css';

const Blogs = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(); // لاستخدام الترجمة
  const { items: blogs, loading, error } = useSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(loadBlogs());
  }, [dispatch]);

  if (loading) return <p>{t('loading')}</p>;
  if (error) return <p>{t('error')}: {error}</p>;

  return (
    <>
<Intro link='Blogs'/>    
<section className='Blogs'>
<div className="container">
<div className="row">

        {blogs.map((blog) => (
          <div key={blog.id} className='col-lg-4'>
            <div className="box">
              <div className="image">
                <img src={blog.imageUrl} alt={blog.title} />
              </div>
              <div className="content">
                <h3>{blog.title}</h3>
                <p>{blog.content.substring(0, 130)}...</p>
                
                <div className="bottom_Contant">
                    <div className="author-info">
                      <img className="author-image" src={blog.authorImage} alt={blog.authorName} />
                      <span>{blog.authorName}</span>
                    </div>
                    <span className="blog-date">
                      {blog.createdAt 
  ? new Date(blog.createdAt).toLocaleDateString() 
  : "Invalid Date"}
                    </span>                  
              </div>                
                
                <Link className='add_to_cart' to={`/blog/${blog.id}`}>{t('read_more')}</Link>                
              </div>
            </div>
          </div>
        ))}
            
          


</div>      
</div>  
</section>
    </>
  );
};

export default Blogs;
