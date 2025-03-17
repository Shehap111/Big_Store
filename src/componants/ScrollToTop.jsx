import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);  // يعيد التمرير إلى أعلى الصفحة عند التبديل إلى صفحة جديدة
  }, [location]);  // كلما تغير الـ location (الـ route)، يتم تنفيذ الكود

  return null;  // لا نحتاج لعرض أي مكون
};

export default ScrollToTop;