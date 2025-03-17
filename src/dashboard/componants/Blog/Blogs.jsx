import React, { useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { Button } from "@mui/material";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState({});
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesSnapshot = await getDocs(collection(db, "categories"));
      const categoriesData = {};
      categoriesSnapshot.docs.forEach((doc) => {
        categoriesData[doc.id] = doc.data().name.en; // جلب اسم الكاتيجوري بناءً على ID
      });
      setCategories(categoriesData);
    };

    const fetchBlogs = async () => {
      const blogsSnapshot = await getDocs(collection(db, "blogs"));
      const blogsData = blogsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(blogsData);
      setLoading(false);
    };

    fetchCategories();
    fetchBlogs();
  }, []);

  const deleteBlog = async (id) => {
    await deleteDoc(doc(db, "blogs", id));
    setBlogs(blogs.filter((blog) => blog.id !== id));
  };

  const columns = [
    {
      accessorKey: "imageUrl",
      header: "Image",
      Cell: ({ row }) =>
        row.original.imageUrl ? (
          <img src={row.original.imageUrl} alt="Blog" style={{ width: "50px", height: "50px" }} />
        ) : (
          "No Image"
        ),
    },
    {
      accessorKey: "title.en",
      header: "Title",
    },
    {
      accessorKey: "authorName",
      header: "Author",
    },
    {
      accessorKey: "category",
      header: "Category",
      Cell: ({ row }) => categories[row.original.category] || "Unknown",
    },
    {
      id: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setSelectedBlog(row.original)}
            data-bs-toggle="modal"
            data-bs-target="#blogModal"
          >
            View
          </Button>
          <Link to={`/main_dashboard/edit-blog/${row.original.id}`} className="btn btn-warning">
            Edit
          </Link>
          <Button variant="contained" color="error" onClick={() => deleteBlog(row.original.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Blog List</h2>
      <Button
        variant="contained"
        color="success"
        onClick={() => window.location.href = 'addBlog'}
        style={{ marginBottom: "20px" }}
      >
        Add New Blog
      </Button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <MaterialReactTable columns={columns} data={blogs} />
      )}

      {/* Modal for Blog Details */}
      <div className="modal fade" id="blogModal" tabIndex="-1" aria-labelledby="blogModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="blogModalLabel">Blog Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedBlog && (
                <div>
                  <p><strong>Title:</strong> {selectedBlog.title.en}</p>
                  <p><strong>Author:</strong> {selectedBlog.authorName}</p>
                  <p><strong>Category:</strong> {categories[selectedBlog.category] || "Unknown"}</p>
                  {selectedBlog.imageUrl && (
                    <img src={selectedBlog.imageUrl} alt="Blog" style={{ width: "100%", height: "auto" }} />
                  )}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
