import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import './navbar.css';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import logo from '../../img/logo/shehap-high-resolution-logo-black-transparent.png';
import { getAuth } from 'firebase/auth';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from 'firebase/auth';
import { clearUser } from '../../redux/slices/userSlice';
import { useTranslation } from 'react-i18next';
import '../../i18n';
import flagEn from '../../img/flags/united-kingdom.png';
import flagAr from '../../img/flags/egypt.png';
import flagDe from '../../img/flags/german-flag.png';
import flagFr from '../../img/flags/france.png';

const languageOptions = [
  { value: 'en', label: 'English', flag: flagEn },
  { value: 'ar', label: 'العربية', flag: flagAr },
  { value: 'de', label: 'Deutsch', flag: flagDe },
  { value: 'fr', label: 'Français', flag: flagFr }
];

const Navbar = () => {
  const auth = getAuth();
  const userData = useSelector((state) => state.user);
  const { t, i18n } = useTranslation();
  const { CartItems } = useSelector(state => state.cart);
  const wishlistCount = useSelector((state) => state.wishlist.count); // جلب عدد المنتجات من الـ Redux store

  const dispatch = useDispatch();
  const [activeNav, setActiveNav] = useState(false);
  const [open, setOpen] = useState(false);

  const handleLanguageChange = (selectedOption) => {
    i18n.changeLanguage(selectedOption.value).then(() => {
      window.location.reload();
    });
  };

  const getTotalQuantity = useMemo(() => {
    return CartItems.reduce((total, item) => total + item.quantity, 0);
  }, [CartItems]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleClick = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  const fixedNav = () => {
    setActiveNav(window.scrollY >= 80);
  };

  useEffect(() => {
    window.addEventListener('scroll', fixedNav);
    return () => {
      window.removeEventListener('scroll', fixedNav);
    };
  }, []);

  return (
    <div>
      <div className="containers">
        <nav className={activeNav ? 'fixed_nav Navbar' : 'Navbar'}>
          <Link to="/" className="nav-logo">
            <img src={logo} alt="Logo" />
          </Link>
          <div onClick={handleClick} className="nav-icon">
            {open ? <FiX /> : <FiMenu />}
          </div>
          <ul className={open ? 'nav-links active' : 'nav-links'}>
            <li><Link to="/" onClick={closeMenu}>{t('header.home')}</Link></li>
            <li><Link to="/About" onClick={closeMenu}>{t('header.about')}</Link></li>
            <li><Link to="/Products" onClick={closeMenu}>{t('header.shop')}</Link></li>
            <li><Link to="/Categorys" onClick={closeMenu}>{t('header.categorys')}</Link></li>
            <li><Link to="/Blogs" onClick={closeMenu}>{t('header.blogs')}</Link></li>
            <li><Link to="/Contact" onClick={closeMenu}>{t('header.contact')}</Link></li>
<Select
  options={languageOptions}
  value={languageOptions.find(option => option.value === i18n.language)}
  onChange={handleLanguageChange}
  className="language-selector phone"
    styles={{
    menu: provided => ({ ...provided, zIndex: 9999 })
  }}
  getOptionLabel={(e) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img className='Flag' src={e.flag} alt={e.label} style={{ width: 20, height: 15, marginRight: 10 }} />
      {e.label}
    </div>
  )}
/>      
            
{userData && userData.uid ? (
  <div className="dropdown dropdown123 phone">
    <button className="btn dropdown-toggle-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      <img src={userData.photoURL} alt="Profile" style={{ width: '30px', borderRadius: '50%' }} />
      {userData.name}
    </button>
    <ul className="dropdown-menu">
      <li><Link to="/profile/edit-profile">{t('header.profile')}</Link></li>
      <li><button onClick={handleLogout}>{t('header.logout')}</button></li>
    </ul>
  </div>
) : userData === null ? (
  <span>Loading...</span> // ممكن تحط سبينر هنا بدلها
) : (
  <Link to="/login" className="login_icon">
    <i className="fa-solid fa-user"></i>
  </Link>
)}

          </ul>
          <div className="right_side_nav">
<Select
  options={languageOptions}
  value={languageOptions.find(option => option.value === i18n.language)}
  onChange={handleLanguageChange}
  className="language-selector desktop"
    styles={{
    menu: provided => ({ ...provided, zIndex: 9999 })
  }}  
  getOptionLabel={(e) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img className='Flag' src={e.flag} alt={e.label} style={{ width: 20, height: 15, marginRight: 10 }} />
      {e.label}
    </div>
  )}
/>

      

            


    <Link className='cart_icon icon-shop desktop' to="/Cart">
      <li>
        <i className="fa-solid fa-cart-shopping"></i>
        {CartItems.length > 0 && <span className="cunt_cart">{getTotalQuantity}</span>}
      </li>
    </Link>

    <Link className="cart_icon icon-shop desktop fav" to="/profile/favorites">
      <li>
        <i className="fa-solid fa-heart"></i>
        {wishlistCount > 0 && <span className="cunt_cart">{wishlistCount}</span>}
      </li>
    </Link>


{userData && userData.uid ? (
  <div className="dropdown dropdown123 desktop">
    <button className="btn dropdown-toggle-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
      <img src={userData.photoURL} alt="Profile" style={{ width: '30px', borderRadius: '50%' }} />
      {userData.name}
    </button>
    <ul className="dropdown-menu">
      <li><Link to="/profile/edit-profile">{t('header.profile')}</Link></li>
      <li><button onClick={handleLogout}>{t('header.logout')}</button></li>
    </ul>
  </div>
) : userData === null ? (
  <span>Loading...</span> // ممكن تحط سبينر هنا بدلها
) : (
  <Link to="/login" className="login_icon desktop">
    <i className="fa-solid fa-user"></i>
  </Link>
)}

          </div>
        </nav>
      </div>
<div className='media_phone phone'>
    <Link className='cart_icon icon-shop' to="/Cart">
      <li>
        <i className="fa-solid fa-cart-shopping"></i>
        {CartItems.length > 0 && <span className="cunt_cart">{getTotalQuantity}</span>}
      </li>
    </Link>

    <Link className="cart_icon icon-shop fav" to="/profile/favorites">
      <li>
        <i className="fa-solid fa-heart"></i>
        {wishlistCount > 0 && <span className="cunt_cart">{wishlistCount}</span>}
      </li>
    </Link>

</div>        

    </div>
  );
};

export default Navbar;
