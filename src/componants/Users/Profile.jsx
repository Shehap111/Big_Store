import React, { useEffect, useState } from 'react';
import { Link, Outlet , NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { setUser } from '../../redux/slices/userSlice';
import './users.css';
import Intro from '../intro_sections/Intro';
import { signOut } from "firebase/auth";
import {clearUser} from '../../redux/slices/userSlice';
import handelAlert from "../SweetAlert"; 
import { useTranslation } from "react-i18next";

const Profile = () => {
  const dispatch = useDispatch();
  const auth = getAuth();
  const db = getFirestore();
  const userData = useSelector((state) => state.user);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          dispatch(setUser(userDoc.data()));
        } else {
          console.error("لا يوجد بيانات لهذا المستخدم");
        }
      } 
      setLoading(false);
    };

    fetchUserData();
  }, [auth, dispatch, db]);

const handleLogout = async () => {
  try {
    await signOut(auth); // تسجيل الخروج من Firebase
    dispatch(clearUser()); // إعادة تعيين حالة المستخدم في Redux
    handelAlert("success", "You are logged out", "#1A1A1A", "#3085d6");

  } catch (error) {
    console.error("Error signing out: ", error);
  }
};



  if (loading) {
    return <div className="alert alert-primary" role="alert"> { t("User.Profile.Lodding") } </div>;
  }

  if (!userData || !userData.uid) {
    return <div className="alert alert-danger" role="alert"> { t("User.Profile.User_not_login") } </div>;
  }

  return (  
    <>
      <Intro link={ t("User.Profile.Profile") } />
    
      <div className='Profile'> 
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <div className="Profile_sidebar">
                <div className="box">
                  <h3>  { t("User.Profile.Hello") } - <span> {userData.name} </span></h3>
                    
                  <div className="Profile_sidebar_links">
                    <ul>
                      <li><NavLink  className={({ isActive }) => (isActive ? "active" : "")}  to="/profile/edit-profile"> <i className="fa-solid fa-id-card"></i> <span>  { t("User.Profile.Edit-Profile") } </span> </NavLink></li>
                      <li><NavLink  className={({ isActive }) => (isActive ? "active" : "")}  to="/profile/orders"> <i className="fa-solid fa-truck-fast"></i>   <span>  { t("User.Profile.Orders") } </span> </NavLink></li>
                      <li><NavLink  className={({ isActive }) => (isActive ? "active" : "")} to="/profile/favorites"> <i className="fa-solid fa-heart"></i>   <span>  { t("User.Profile.Favorites") } </span></NavLink></li>
                      <li><NavLink  className={({ isActive }) => (isActive ? "active" : "")} to="/profile/address"> <i className="fa-solid fa-map-location-dot"></i>  <span>  { t("User.Profile.Address") } </span></NavLink></li>
                <li>  <button onClick={handleLogout}>   { t("User.Profile.Logout") }</button>	  </li>
                    
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-9">
              <div className="profile_content">
                <Outlet/>
              </div>
            </div>
          </div>
        </div>
      </div>    
    </>
  );
};

export default Profile;
