import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { setUser } from '../../redux/slices/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import handelAlert from '../SweetAlert';
import logo from '../../img/logo/shehap-high-resolution-logo-white-transparent.png';
import google from '../../img/google.png';
import './login.css';

const Login = () => {
  const { t } = useTranslation();
  const auth = getAuth();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const db = getFirestore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));

      if (userDoc.exists()) {
        dispatch(
          setUser({
            uid: user.uid,
            name: userDoc.data().name,
            email: user.email,
            phone: userDoc.data().phone,
            photoURL: userDoc.data().photoURL,
          })
        );
        handelAlert('success', t('login.success'), '#1A1A1A', '#3085d6');
        setTimeout(() => navigate('/'), 2000);
      } else {
        handelAlert('info', t('login.noUserData'), '#1A1A1A', '#d33');
      }
    } catch (error) {
      handelAlert('error', t('login.invalidCredentials'), '#1A1A1A', '#d33');
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          phone: user.phoneNumber || '',
          photoURL: user.photoURL,
        });
      }

      dispatch(
        setUser({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          phone: user.phoneNumber || '',
          photoURL: user.photoURL,
        })
      );

      handelAlert('success', t('login.success'), '#1A1A1A', '#3085d6');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      handelAlert('error', t('login.error'), '#1A1A1A', '#d33');
    }
  };

  return (
    <section className="login">
      <div className="container">
        <form onSubmit={handleLogin}>
          <Link to='/'> <img src={logo} alt="logo" /> </Link>
          <button type="button" onClick={handleGoogleLogin} className="google-btn"> <img src={google} alt="google img" /> </button>
          <input
            type="email"
            placeholder={t('login.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t('login.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{t('login.signIn')}</button>
          <Link className='lastlink' to='/register'>{t('login.noAccount')}</Link>
        </form>
      </div>

      <div className="logo">
        <Link to='/'> <img src={logo} alt="logo" /> </Link>
      </div>
    </section>
  );
};

export default Login;