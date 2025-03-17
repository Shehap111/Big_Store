import React, { useState } from 'react';
import defaultImage from '../../img/defaultImage.jpg';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../img/logo/shehap-high-resolution-logo-white-transparent.png';
import handelAlert from '../SweetAlert';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(defaultImage);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      handelAlert('error', t('register.invalidImage'), '#1A1A1A', '#d33');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let photoURL =
        'https://firebasestorage.googleapis.com/v0/b/dropshipping-db-ac6f3.appspot.com/o/pngtree-cartoon-color-simple-male-avatar-png-image_1934459.jpg?alt=media&token=b46a4397-6a9a-4531-85b6-71dcc929b31f';

      if (file) {
        const storageRef = ref(storage, `profile_pictures/${user.uid}`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        phone,
        photoURL,
        uid: user.uid,
        role: 'user',
        adminApproval: false,
        createdAt: new Date().toISOString(),
        isSuspended: false,
      });

      handelAlert('success', t('register.success'), '#1A1A1A', '#3085d6');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      handelAlert('error', `${t('register.error')} ${error.message}`, '#1A1A1A', '#d33');
    }
  };

  return (
    <section className="login Register">
      <div className="container">
        <form onSubmit={handleRegister}>
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>

          <label className="img_label" htmlFor="img_input">
            <img src={preview} alt="user preview" />
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
            placeholder={t('register.fullNamePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder={t('register.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder={t('register.phonePlaceholder')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t('register.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">{t('register.signUp')}</button>
          <Link className="lastlink" to="/login">
            {t('register.alreadyHaveAccount')}
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

export default Register;
