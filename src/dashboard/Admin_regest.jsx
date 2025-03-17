import React, { useState } from 'react';
import defaultImage from '../img/defaultImage.jpg';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../img/logo/shehap-high-resolution-logo-white-transparent.png';
import handelAlert from "../componants/SweetAlert";

const AdminRegister = () => {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(defaultImage); // الصورة الافتراضية

  // التحقق من نوع الملف
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // تحديث الصورة المعروضة
    } else {
      handelAlert("error", "Please choose a correct picture", "#1A1A1A", "#d33");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // 1. إنشاء حساب الأدمن
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. رفع الصورة لو المستخدم اختار واحدة، وإلا استخدم الصورة الافتراضية
      let photoURL =
        'https://firebasestorage.googleapis.com/v0/b/dropshipping-db-ac6f3.appspot.com/o/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg?alt=media&token=b46a4397-6a9a-4531-85b6-71dcc929b31f'; // رابط الصورة الافتراضية

      if (file) {
        const storageRef = ref(storage, `profile_pictures/${user.uid}`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef); // تحديث رابط الصورة لو تم رفع صورة
      }

      // 3. تخزين بيانات الأدمن في Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        phone,
        photoURL,
        uid: user.uid,
        role: 'admin', // الدور أدمن
        adminApproval: false, // يجب الموافقة على الحساب
      });

      handelAlert("success", "Admin registration completed successfully", "#1A1A1A", "#3085d6");
      setTimeout(() => {
        navigate("/Admin_log");
      }, 2000);

    } catch (error) {
      handelAlert("error", `Registration failed: ${error.message}`, "#1A1A1A", "#d33");
    }
  };

  return (
    <section className="login">
      <div className="container">
        <form onSubmit={handleRegister}>
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>

          {/* عرض الصورة المختارة */}
          <label className="img_label" htmlFor="img_input">
            <img src={preview} alt="admin preview" />
          </label>
          <input
            className="img_input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="img_input"
          />

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Register as Admin</button>
          <Link className="lastlink" to="/Admin_log">
            I already have Admin account
          </Link>
        </form>

        <div className="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdminRegister;
