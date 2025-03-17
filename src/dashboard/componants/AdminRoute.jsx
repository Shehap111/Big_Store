import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (!adminDoc.exists() || adminDoc.data().role !== 'admin') {
        navigate('/not-authorized'); // لو مش أدمن، يتم منعه
      }
    };

    checkAdmin();
  }, [auth, db, navigate]);

  return children;
};

export default AdminRoute;
