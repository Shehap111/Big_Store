import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { loadSingleBlog, clearSingleBlog } from '../../redux/slices/blogsSlice';

const SingleBlog = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const { singleBlog, loading, error } = useSelector((state) => state.blogs);

  useEffect(() => {
    dispatch(loadSingleBlog(id));

    return () => {
      dispatch(clearSingleBlog());
    };
  }, [dispatch, id]);

  if (loading) return <p className="text-center">{t('loading')}</p>;
  if (error) return <p className="text-danger text-center">{t('error')} {error}</p>;
  if (!singleBlog) return <p className="text-warning text-center">{t('not_found')}</p>;

  return (
<section className='Blogs'>
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        ← {t('back')}
      </button>

      <div className="card p-4 shadow">
        <img src={singleBlog.imageUrl} alt={singleBlog.title} />
        <h2 className="mb-3">{singleBlog.title}</h2>
          <div className="bottom_Contant">
                    <div className="author-info">
                      <img className="author-image" src={singleBlog.authorImage} alt={singleBlog.authorName} />
                      <span>{singleBlog.authorName}</span>
                    </div>
                    <span className="blog-date">
                                            {singleBlog.createdAt 
  ? new Date(singleBlog.createdAt).toLocaleDateString() 
  : "Invalid Date"}
                    </span>                  
          </div>  
        <hr />
        <p>{singleBlog.content}</p>
      </div>
    </div>      

      
</section>    
  );
};

export default SingleBlog;
