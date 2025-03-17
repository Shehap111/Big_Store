import { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { doc, getDoc, updateDoc ,collection , query ,where ,getDocs} from "firebase/firestore";
import handelAlert from "../DeleatSweetAlert"; // استيراد SweetAlert من الفايل الخارجي
import { useParams } from "react-router-dom"; // لاستقبال الـ id من الـ URL
import './SingleUser.css'; // استيراد ملف الـ CSS

const Single_user = () => {
  const { userId } = useParams(); // استخراج الـ id من الـ URL
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]); // حفظ الطلبات في حالة جديدة
  const [loading, setLoading] = useState(true);

  // جلب بيانات المستخدم من Firestore
  const fetchUser = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId)); // استخدام userId بدلاً من id
      if (userDoc.exists()) {
        setUser(userDoc.data());
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // جلب الطلبات الخاصة بالمستخدم
  const fetchOrders = async () => {
    try {
      const ordersQuery = query(collection(db, "Orders"), where("userId", "==", userId)); // استخدام userId لجلب الطلبات
      const ordersSnapshot = await getDocs(ordersQuery);
      const fetchedOrders = [];
      ordersSnapshot.forEach((doc) => {
        fetchedOrders.push(doc.data());
      });
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // تفعيل أو إيقاف الحساب
  const toggleSuspendAccount = async () => {
    const newStatus = !user.isSuspended; // عكس القيمة الحالية

    const result = await handelAlert({
      title: newStatus ? "Suspend Account" : "Activate Account",
      text: `Do you really want to ${newStatus ? "suspend" : "activate"} this account?`,
      icon: "warning",
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    });

    if (result.isConfirmed) {
      try {
        await updateDoc(doc(db, "users", userId), {
          isSuspended: newStatus
        });
        setUser((prevUser) => ({
          ...prevUser,
          isSuspended: newStatus
        }));
      } catch (error) {
        console.error("Error updating account status:", error);
      }
    }
  };

  const deleteAccount = async () => {
    const result = await handelAlert({
      title: "Delete Account",
      text: "This action cannot be undone!",
      icon: "error",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6"
    });

    if (result.isConfirmed) {
      // هنا نفذ الكود لحذف الحساب
      console.log("Account deleted");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchOrders(); // استدعاء دالة جلب الطلبات بعد تحميل بيانات المستخدم
  }, [userId]); // استخدام userId في الـ dependency array

  useEffect(() => {
    if (user && orders.length > 0) {
      setLoading(false); // التأكد من أنه يتم تغيير حالة loading فقط بعد جلب البيانات بالكامل
    }
  }, [user, orders]);

  if (loading) return <p>Loading...</p>;

const formatDate = (timestamp) => {
  const date = new Date(timestamp); // التاريخ هو string مباشرة
  return date.toLocaleDateString(); // تنسيق التاريخ
};

  return (
    <div className="single-user-container">
      <div className="user-info">
        <img src={user.photoURL || "default-avatar.png"} alt="User Avatar" className="user-avatar" />
        <h2>{user.name}</h2>
        <p><span>Email:</span> <span>{user.email}</span></p>
        <p><span>Phone:</span> <span>{user.phone}</span></p>
        <p><span>Account Status:</span> <span>{user.isSuspended ? "Suspended" : "Active"}</span></p>
        <p><span>Created At:</span> <span>{formatDate(user.createdAt)}</span></p> {/* عرض تاريخ الإنشاء */}
        <p><span>Orders Count:</span> <span>{orders.length}</span></p> {/* عرض عدد الطلبات */}
        <p><span>Cancelled Orders:</span> <span>{orders.filter(order => order.orderStatus === "Cancelled").length}</span></p> {/* عرض عدد الطلبات المكنسلة */}
        <p><span>Total Spend:</span> <span>${orders.reduce((total, order) => order.orderStatus === "Delivered" ? total + order.totalAmount : total, 0)}</span></p> {/* إجمالي الإنفاق */}

        <div className="user-actions">
          <button 
            onClick={toggleSuspendAccount} 
            className="btn suspend-btn"
          >
            {user.isSuspended ? "Activate Account" : "Suspend Account"}
          </button>
          <button onClick={deleteAccount} className="btn delete-btn">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Single_user;
