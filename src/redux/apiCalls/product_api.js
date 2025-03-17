import { db } from '../../firebase'; // تأكد من المسار الصحيح
import { collection, getDocs, doc, getDoc, where , query , or ,orderBy } from 'firebase/firestore';

// فانكشن جميع الكاتيجوريز
export const fetchCategories = async () => {
  const snapshot = await getDocs(collection(db, 'categories'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// فانكشن جميع الساب كاتيجوريز

export const fetchSubCategories = async (categoryId) => {
  const subCategoryRef = collection(db, 'subcategories');

  let q;
  if (!categoryId || categoryId === "all") {
    q = subCategoryRef; // ✅ لو مفيش `categoryId` هنجيب كل البيانات
  } else {
    q = query(
      subCategoryRef,
      or(
        where('parentCategory', '==', categoryId), // النص
        where('parentCategory', '==', parseInt(categoryId)) // الرقم
      )
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};


export const fetchProducts = async () => {
  try {
    const productsRef = collection(db, "products"); // مرجع الكوليكشن
    const q = query(productsRef, orderBy("createdAt", "desc")); // ترتيب حسب createdAt
    
    const snapshot = await getDocs(q);

    // تحويل البيانات مع ضمان أن الـ ID يكون `string`
    const products = snapshot.docs.map((doc) => ({
      id: doc.id.toString(), // تأكيد أن الـ ID نصي
      ...doc.data(),
      
    }));

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products"); // رمي خطأ للتحكم فيه عند الاستدعاء
  }
};


//subCategoryId فانكشن المنتجات  على 
export const fetchProductsBySubCategory = async (subCategoryId) => {
  const productsRef = collection(db, 'products');
  
  // إنشاء استعلام يدعم النصوص والأرقام
  const q = query(
    productsRef,
    or(
      where('subCategoryId', '==', subCategoryId), // النص
      where('subCategoryId', '==', parseInt(subCategoryId)) // الرقم
    )
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};



// فانكشن منتج واحد    


export const fetchSingleProduct = async (productId) => {
  const productRef = doc(db, 'products', productId.toString()); // استخدم الـ ID كمرجع
  const productSnap = await getDoc(productRef);

  if (productSnap.exists()) {
    return { id: productSnap.id, ...productSnap.data() }; // إضافة الـ ID للمستند
  } else {
    throw new Error('No such product!'); // إذا لم يوجد المنتج
  }
};


export const fetchTrendingProducts = async ({ 
  priceRange = null, 
  color = null, 
  subCategory = [],  
  sortBy = "rating"
}) => {
  let productsQuery = collection(db, "products");

  // ✅ فلترة السعر
  if (priceRange) {
    productsQuery = query(
      productsQuery, 
      where("price", ">=", priceRange.min), 
      where("price", "<=", priceRange.max)
    );
  }

  // ✅ فلترة اللون
  if (color) {
    productsQuery = query(productsQuery, where("color", "==", color));
  }

  const snapshot = await getDocs(productsQuery);
  let products = snapshot.docs.map(doc => {
    const data = doc.data();
    
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.seconds ? data.createdAt.seconds * 1000 : Date.now(), // ✅ تحويل `createdAt` إلى milliseconds
    };
  });

  // ✅ فلترة الساب كاتيجوري
  if (subCategory.length > 0) {
    products = products.filter(product => subCategory.includes(product.subCategoryId));
  }

  // ✅ ترتيب المنتجات
  const sortOptions = {
    rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
    latest: (a, b) => (b.createdAt - a.createdAt), // ✅ المقارنة بالملي ثانية
    bestSelling: (a, b) => (b.sales ?? 0) - (a.sales ?? 0),
    priceLowToHigh: (a, b) => (a.price ?? 0) - (b.price ?? 0),
    priceHighToLow: (a, b) => (b.price ?? 0) - (a.price ?? 0),
  };

  products.sort(sortOptions[sortBy] || sortOptions.rating);

  return products;
};

