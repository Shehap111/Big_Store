import { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { MaterialReactTable } from "material-react-table";
import { Link } from "react-router-dom"; // استيراد Link من react-router-dom

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب المستخدمين من Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const fetchedUsers = [];

      for (const doc of querySnapshot.docs) {
        const userData = doc.data();
        const userId = doc.id;

        // نعرض المستخدمين فقط الذين ليس لديهم دور "admin"
        if (userData.role !== "admin") {
          // جلب الطلبات الخاصة بالمستخدم
          const ordersQuery = query(collection(db, "Orders"), where("userId", "==", userId));
          const ordersSnapshot = await getDocs(ordersQuery);

          // حساب عدد الطلبات المكتملة والمكنسلة وإجمالي الإنفاق
          let ordersCount = 0;
          let cancelledOrdersCount = 0;
          let totalSpend = 0;

          ordersSnapshot.forEach(orderDoc => {
            const orderData = orderDoc.data();
            if (orderData.orderStatus === "Delivered") {
              ordersCount++;
              totalSpend += orderData.totalAmount;
            } else if (orderData.orderStatus === "Cancelled") {
              cancelledOrdersCount++;
            }
          });

          // إنشاء الكائن الخاص بكل مستخدم
          fetchedUsers.push({
            id: userId,
            name: userData.name,
            email: userData.email,
            photoURL: userData.photoURL,
            role: userData.role,
            adminApproval: userData.adminApproval,
            accountStatus: userData.isSuspended ? "Suspended" : "Active", // استخدام `isSuspended`
            ordersCount,
            cancelledOrdersCount, // إضافة عدد الطلبات المكنسلة
            totalSpend,
          });
        }
      }

      setUsers(fetchedUsers); // تخزين البيانات في الـ state
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false); // إيقاف التحميل بعد الحصول على البيانات
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // الأعمدة التي سيتم عرضها في الجدول
  const columns = [
    {
      accessorKey: "name", 
      header: "Full Name", 
      Cell: ({ row }) => (
        <Link to={`${row.original.id}`} style={{ textDecoration: "none", color: "#1976d2" }}>
          {row.original.name}
        </Link>
      ) // تحويل الاسم إلى لينك
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "accountStatus", header: "Account Status" },
    { accessorKey: "ordersCount", header: "Orders Count" },
    { accessorKey: "cancelledOrdersCount", header: "Cancelled Orders" }, // العمود الجديد
    { accessorKey: "totalSpend", header: "Total Spend" },
  ];

  return (
    <div>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <MaterialReactTable columns={columns} data={users} />
      )}
    </div>
  );
};

export default Users;
