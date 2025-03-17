import React, { useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Button } from "@mui/material";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../../firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const Subcategories = () => {
  const [subcategories, setSubcategories] = useState([]); // لتخزين الساب كاتيجوريز
  const [categories, setCategories] = useState([]); // لتخزين الكاتيجوريز
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null); // لتخزين الساب كاتيجوري المختار للعرض في البوب أب

  // جلب الكاتيجوريز من Firebase
  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);

      const subcategoriesSnapshot = await getDocs(collection(db, 'subcategories'));
      const subcategoriesData = subcategoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubcategories(subcategoriesData);
      setLoading(false);
    };

    fetchCategoriesAndSubcategories();
  }, []);

  // دالة لحذف ساب كاتيجوري
  const deleteSubcategory = async (id) => {
    await deleteDoc(doc(db, "subcategories", id));
    setSubcategories(subcategories.filter(subcategory => subcategory.id !== id)); // تحديث القائمة بعد الحذف
  };

  // الأعمدة التي سيتم عرضها
  const columns = [
    {
      accessorKey: "name.en",
      header: "Subcategory Name",
    },
    {
      accessorKey: "description.en",
      header: "Description",
    },
    {
      accessorKey: "parentCategory",
      header: "Parent Category",
      Cell: ({ row }) => {
        // جلب اسم الكاتيجوري الأب بناءً على الـ parentCategory
        const parentCategory = categories.find(cat => cat.id === row.original.parentCategory);
        return parentCategory ? parentCategory.name.en : "No Parent";
      },
    },
    {
      id: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setSelectedSubcategory(row.original)}
            data-bs-toggle="modal"
            data-bs-target="#subcategoryModal"
          >
            View
          </Button>
          <Link
            to={`/main_dashboard/edit-subcategory/${row.original.id}`}
            className="btn btn-warning"
          >
            Edit
          </Link>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteSubcategory(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Subcategory List</h2>
      <Button
        variant="contained"
        color="success"
        onClick={() => window.location.href = 'add_SupCatt'}
        style={{ marginBottom: "20px" }}
      >
        Add New Subcategory
      </Button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <MaterialReactTable columns={columns} data={subcategories} />
      )}

      {/* Modal for Viewing Subcategory Details */}
      <div className="modal fade" id="subcategoryModal" tabIndex="-1" aria-labelledby="subcategoryModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="subcategoryModalLabel">Subcategory Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedSubcategory && (
                <div>
                  <p><strong>Name:</strong> {selectedSubcategory.name}</p>
                  <p><strong>Description:</strong> {selectedSubcategory.description}</p>
                  <p><strong>Parent Category:</strong> {categories.find(cat => cat.id === selectedSubcategory.parentCategory)?.name}</p>
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

export default Subcategories;
