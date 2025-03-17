import React, { useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Button } from "@mui/material";
import { collection, getDocs, doc, deleteDoc ,orderBy ,query} from "firebase/firestore";
import { db } from '../../../firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';

const Products = () => {
  const [data, setData] = useState([]); // لتخزين البيانات من Firebase
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null); // لتخزين المنتج المختار للعرض في البوب أب
  const [categories, setCategories] = useState([]); // لتخزين الكاتيجوريز
  const [subCategories, setSubCategories] = useState([]); // لتخزين الساب كاتيجوريز

  // جلب الكاتيجوريز من Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);
    };

    fetchCategories();
  }, []);

  // جلب الساب كاتيجوريز من Firebase
  useEffect(() => {
    const fetchSubCategories = async () => {
      const subCategoriesSnapshot = await getDocs(collection(db, 'subcategories'));
      const subCategoriesData = subCategoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubCategories(subCategoriesData);
    };

    fetchSubCategories();
  }, []);

const fetchData = async () => {
  try {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    setData(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, []);

  // دالة لحذف منتج
  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    fetchData(); // بعد الحذف، قم بتحديث البيانات
  };

const getCategoryName = (id) => {
  const category = categories.find((cat) => cat.id == id); // استخدم == بدل === للمقارنة بين رقم ونص
  return category ? category.name.en : 'Unknown';
};

const getSubCategoryName = (id) => {
  const subCategory = subCategories.find((subCat) => subCat.id == id);
  return subCategory ? subCategory.name.en : 'Unknown';
};

  // الأعمدة التي سيتم عرضها
  const columns = [
    {
      accessorKey: "image",
      header: "Image",
      Cell: ({ row }) => (
        <img
          src={row.original.imageUrl}
          alt={row.original.title.en}
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    {
      accessorKey: "title.en",
      header: "Product Name",
    },
    {
      accessorKey: "categoryId",
      header: "Category",
      Cell: ({ row }) => getCategoryName(row.original.categoryId), // عرض الكاتيجوري باستخدام الـ ID
    },
    {
      accessorKey: "subCategoryId",
      header: "Subcategory",
      Cell: ({ row }) => getSubCategoryName(row.original.subCategoryId), // عرض الساب كاتيجوري باستخدام الـ ID
    },
    {
      id: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setSelectedProduct(row.original)}
            data-bs-toggle="modal"
            data-bs-target="#productModal"
          >
            View
          </Button>

           <Link className='btn secondary' to={`/main_dashboard/edit-product/${row.original.id}`}>Edit</Link>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteProduct(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Product List</h2>
      <Button
        variant="contained"
        color="success"
        onClick={() => window.location.href = 'addProduct'}
        style={{ marginBottom: "20px" }}
      >
        Add New Product
      </Button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <MaterialReactTable columns={columns} data={data} />
      )}

      {/* Modal for Viewing Product Details */}
      <div className="modal fade" id="productModal" tabIndex="-1" aria-labelledby="productModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="productModalLabel">Product Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedProduct && (
                <div>
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.title.en}
                    style={{ width: "100%", height: "auto", marginBottom: "10px" }}
                  />
                  <p><strong>Name:</strong> {selectedProduct.title.en}</p>
                  <p><strong>Category:</strong> {getCategoryName(selectedProduct.categoryId)}</p>
                  <p><strong>Subcategory:</strong> {getSubCategoryName(selectedProduct.subCategoryId)}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
