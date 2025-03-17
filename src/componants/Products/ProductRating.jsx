import React from 'react';

const ProductRating = ({ rating = 0 }) => {
  const fullStars = Math.floor(rating); // عدد النجوم الممتلئة
  const halfStar = rating - fullStars >= 0.5; // نص نجمة لو فيه نص تقييم
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0); // النجوم الفاضية

  return (
    <div className="product-rating" title={`Rating: ${rating} out of 5`}>
      {Array(fullStars).fill().map((_, i) => (
        <i key={i} className="fas fa-star" style={{ color: 'gold' }}></i> // نجوم ممتلئة
      ))}
      {halfStar && <i className="fas fa-star-half-alt" style={{ color: 'gold' }}></i>} 
      {Array(emptyStars).fill().map((_, i) => (
        <i key={`empty-${i}`} className="far fa-star" style={{ color: 'gold' }}></i> // نجوم فاضية
      ))}
    </div>
  );
};

export default ProductRating;
