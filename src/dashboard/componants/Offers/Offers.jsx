import React, { useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { Button } from "@mui/material";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      const offersSnapshot = await getDocs(collection(db, "offers"));
      const offersData = offersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOffers(offersData);
      setLoading(false);
    };

    fetchOffers();
  }, []);

  const deleteOffer = async (id) => {
    await deleteDoc(doc(db, "offers", id));
    setOffers(offers.filter((offer) => offer.id !== id));
  };

  const columns = [
    {
      accessorKey: "title.en",
      header: "Offer Name",
    },
    {
      accessorKey: "discountPrice",
      header: "Price ($)",
    },
{
  accessorKey: "products",
  header: "Product Count",
  Cell: ({ row }) => row.original.products?.length || 0,
},
    {
      accessorKey: "endDate",
      header: "Expiry Date",
    },
    {
      id: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setSelectedOffer(row.original)}
            data-bs-toggle="modal"
            data-bs-target="#offerModal"
          >
            View
          </Button>
          <Link to={`/main_dashboard/edit-offer/${row.original.id}`} className="btn btn-warning">
            Edit
          </Link>
          <Button variant="contained" color="error" onClick={() => deleteOffer(row.original.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Offers List</h2>
      <Button
        variant="contained"
        color="success"
        onClick={() => window.location.href = 'addOffer'}
        style={{ marginBottom: "20px" }}
      >
        Add New Offer
      </Button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <MaterialReactTable columns={columns} data={offers} />
      )}

      {/* Modal for Offer Details */}
      <div className="modal fade" id="offerModal" tabIndex="-1" aria-labelledby="offerModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="offerModalLabel">Offer Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {selectedOffer && (
                <div>
                  <p><strong>Offer Name:</strong> {selectedOffer.title.en}</p>
                  <p><strong>Price:</strong> ${selectedOffer.discountPrice}</p>
                  <p><strong>Product Count:</strong> {selectedOffer.products.length}</p>
                  <p><strong>Expiry Date:</strong> {selectedOffer.endDate}</p>
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

export default Offers;