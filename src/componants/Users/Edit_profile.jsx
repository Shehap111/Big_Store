import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { setUser } from '../../redux/slices/userSlice';
import { useTranslation } from 'react-i18next';
import './users.css';
import default_img from '../../img/defaultImage.jpg';
import handelAlert from '../SweetAlert';

const Edit_profile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const db = getFirestore();
  const storage = getStorage();

  const [name, setName] = useState(user.name || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user.uid) {
        console.error('User UID is not available');
        return;
      }
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setName(userData.name || '');
        setPhone(userData.phone || '');
        setPreview(userData.photoURL || default_img);
      } else {
        console.error('No such document!');
      }
    };
    fetchUserData();
  }, [db, user.uid]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, 'users', user.uid);
      let photoURL = preview;
      if (file) {
        const storageRef = ref(storage, `profile_pictures/${user.uid}`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
      }
      await updateDoc(userRef, { name, phone, photoURL });
      dispatch(setUser({ ...user, name, phone, photoURL }));
      handelAlert('success', t('User.Edit_profile.profile_updated'), '#fff', '#5cb85c');
    } catch (error) {
      console.error('Error updating profile:', error);
      handelAlert('error', t('User.Edit_profile.profile_update_failed'), '#fff', 'red');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      handelAlert('warning', t('User.Edit_profile.invalid_image'), '#fff', 'red');
    }
  };

  return (
    <section className='Edit_profil'>
      <form className='edit_form' onSubmit={handleUpdate}>
        <div className='user_edit_img'>
          <label htmlFor='photo_user'>
            <img src={preview || default_img} alt={t('User.Edit_profile.profile_picture')} />
          </label>
          <input id='photo_user' type='file' onChange={handleFileChange} accept='image/*' />
        </div>
        <div>
          <label>{t('User.Edit_profile.name')}</label>
          <input type='text' required minLength={5} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>{t('User.Edit_profile.phone')}</label>
          <input required minLength={11} type='text' value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <button type='submit'>{t('User.Edit_profile.update_profile')}</button>
      </form>
    </section>
  );
};

export default Edit_profile;
