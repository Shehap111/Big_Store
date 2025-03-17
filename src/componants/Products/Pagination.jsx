import React from 'react';

const Pagination = ({ totalPages, currentPage, paginate }) => {
  const pageNumbers = [];

  // المنطق لإظهار أرقام الصفحات مع "..."
  const maxPagesToShow = 3; // عدد الصفحات التي نعرضها في المرة الواحدة
  let startPage = currentPage - Math.floor(maxPagesToShow / 2); // الصفحة الأولى التي سيتم عرضها
  let endPage = currentPage + Math.floor(maxPagesToShow / 2); // الصفحة الأخيرة التي سيتم عرضها

  // إذا كانت الصفحة الحالية قريبة من البداية
  if (startPage < 1) {
    startPage = 1;
    endPage = Math.min(maxPagesToShow, totalPages);
  }

  // إذا كانت الصفحة الحالية قريبة من النهاية
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, totalPages - maxPagesToShow + 1);
  }

  // إضافة الأرقام إلى المصفوفة
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      {startPage > 1 && (
        <>
          <button onClick={() => paginate(1)}>1</button>
          <span className='dots'>....</span>
        </>
      )}

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={currentPage === number ? 'active' : ''}
        >
          {number}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          <span className='dots'>....</span>
          <button onClick={() => paginate(totalPages)}>{totalPages}</button>
        </>
      )}
    </div>
  );
};

export default Pagination;
