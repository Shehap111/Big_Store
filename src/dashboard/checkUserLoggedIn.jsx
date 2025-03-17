import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const checkAdminLoggedIn = async () => {
  const auth = getAuth();
  const db = getFirestore();

  const user = auth.currentUser;
  if (user) {
    const userDocRef = doc(db, "users", user.uid);  // التأكد من استخدام كولكشن "users"
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      // التحقق من أن الدور أدمن وأنه تم الموافقة عليه
      if (userData.role === "admin" && userData.adminApproval === true) {
        return true;  // إذا كان أدمن ومعتمد
      }
    }
  }
  return false;  // إذا لم يكن أدمن أو لم يتم الموافقة عليه
};

export default checkAdminLoggedIn;
