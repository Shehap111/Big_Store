import React, { useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { collection, getDocs, deleteDoc, doc ,orderBy ,query} from "firebase/firestore";
import { db } from "../../../firebase";
import handelAlert from "../DeleatSweetAlert"; // استيراد السويت أليرت

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب الطلبات من Firestore
const fetchOrders = async () => {
  try {
    const ordersQuery = query(collection(db, "Orders"), orderBy("orderDate", "desc")); // 🔥 ترتيب من الأحدث للأقدم

    const querySnapshot = await getDocs(ordersQuery);
    const fetchedOrders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setOrders(fetchedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchOrders();
  }, []);

  // حذف الطلب مع التأكيد باستخدام SweetAlert
  const handleDelete = async (id) => {
    try {
      const result = await handelAlert({
        title: "Are you sure you want to delete this order?",
        text: "This action cannot be undone!",
        icon: "warning",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await deleteDoc(doc(db, "Orders", id));
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
        handelAlert({
          title: "Deleted!",
          text: "The order has been deleted.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      handelAlert({
        title: "Error!",
        text: "Failed to delete the order. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // أعمدة الجدول
  const columns = [
    { accessorKey: "address.fullName", header: "Customer Name" },
    { accessorKey: "address.city", header: "City" },
    { accessorKey: "orderStatus", header: "Status" },
    { accessorKey: "totalAmount", header: "Total Amount", Cell: ({ cell }) => `$${cell.getValue()}` },
    { accessorKey: "paymentMethod", header: "Payment Method" },
    {
      id: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => window.location.href = `single_order/${row.original.id}`}
            style={{ backgroundColor: "#007BFF", color: "#fff", padding: "5px 10px", borderRadius: "5px" }}
          >
            View
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            style={{ backgroundColor: "#d33", color: "#fff", padding: "5px 10px", borderRadius: "5px" }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Orders</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <MaterialReactTable
          columns={columns}
          data={orders}
          enableColumnDragging={false}
        />
      )}
    </div>
  );
};

export default Orders;
