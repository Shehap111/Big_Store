import React, { useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Button } from "@mui/material";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from '../../../firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]); // لتخزين الكاتيجوريز
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null); // لتخزين الكاتيجوري المختار للعرض في البوب أب

  // جلب الكاتيجوريز من Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);
      setLoading(false);
    };

    fetchCategories();
  }, []);

  // دالة لحذف كاتيجوري
  const deleteCategory = async (id) => {
    await deleteDoc(doc(db, "categories", id));
    setCategories(categories.filter(category => category.id !== id)); // تحديث القائمة بعد الحذف
  };

  // الأعمدة التي سيتم عرضها
  const columns = [
    {
      accessorKey: "name.en",
      header: "Category Name",
    },
    {
      accessorKey: "description.en",
      header: "Description",
    },
    {
      id: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setSelectedCategory(row.original)}
            data-bs-toggle="modal"
            data-bs-target="#categoryModal"
          >
            View
          </Button>
          <Link
            to={`/main_dashboard/edit-category/${row.original.id}`}
            className="btn btn-warning"
          >
            Edit
          </Link>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteCategory(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Category List</h2>
      <Button
        variant="contained"
        color="success"
        onClick={() => window.location.href = 'addCatt'}
        style={{ marginBottom: "20px" }}
      >
        Add New Category
      </Button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <MaterialReactTable columns={columns} data={categories} />
      )}

      {/* Modal for Viewing Category Details */}
      <div className="modal fade" id="categoryModal" tabIndex="-1" aria-labelledby="categoryModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="categoryModalLabel">Category Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedCategory && (
                <div>
                  <p><strong>Name:</strong> {selectedCategory.name}</p>
                  <p><strong>Description:</strong> {selectedCategory.description}</p>
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

export default Categories;
