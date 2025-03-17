import React, {useEffect, useState} from 'react';
import {Route, Routes} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {  onAuthStateChanged } from 'firebase/auth';
import {setUser  , clearUser} from './redux/slices/userSlice';
import { auth , db} from './firebase'; 
import {doc, getDoc} from 'firebase/firestore';
import { useLocation } from "react-router-dom";
// /////////Componants
import Main_Home from './componants/Home/Main_Home';
import Main_apout from './componants/About/Main_apout';
import Products from './componants/Products/Products';
import Categorys from './componants/Categorys/Categorys';
import Blogs from './componants/Blogs/Blogs';
import SingleBlog from './componants/Blogs/SingleBlog';
import Contacts_us from './componants/Contacts/Contacts_us';
import Login from './componants/Log&reg/Login';
import Navbar from './componants/Navbar/Navbar';
import Footer from './componants/Fotter/Footer';
import Sup_Categorys from './componants/Categorys/Sup_Categorys';
import Products_by_supcat from './componants/Categorys/Products_by_supcat';
import SingleProduct from './componants/Products/Single_product';
import Register from './componants/Log&reg/Register';
import Profile from './componants/Users/Profile';
import Edit_profile from './componants/Users/Edit_profile';
import Orders from './componants/Users/Orders';
import Favorites from './componants/Users/Favorites';
import Address from './componants/Users/Address';
import Cart from './componants/cart/Cart';
import Wishlist from './componants/cart/Wishlist';
import Checkout from './componants/cart/Checkout';
import SuccessPage from './componants/cart/SuccessPage';
import SingleOrder from './componants/Users/SingleOrder';
import Offers_bage from './componants/OffersBage/Offers_bage';
import Single_Offer from './componants/OffersBage/Single_Offer';

// admins
import Admin_regest from './dashboard/Admin_regest';
import Admin_log from './dashboard/Admin_log';
import Main_dashboard from './dashboard/Main_dashboard';
import Dashboard_Products from "./dashboard/componants/products/Products";
import AddProduct from "./dashboard/componants/products/AddProduct";
import EditProduct from "./dashboard/componants/products/EditProduct";
import Categories from "./dashboard/componants/categories/Categories";
import EditCatt from "./dashboard/componants/categories/EditCatt";
import AddCatt from "./dashboard/componants/categories/AddCatt";
import Supcategory from "./dashboard/componants/supcatrgory/Supcategory";
import Add_SupCatt from "./dashboard/componants/supcatrgory/Add_SupCatt";
import Edit_supcat from "./dashboard/componants/supcatrgory/Edit_supcat";
import Dashboard_Orders from "./dashboard/componants/orders/Orders";
import Single_order from "./dashboard/componants/orders/Single_order";
import Users from "./dashboard/componants/users/Users";
import Single_user from "./dashboard/componants/users/Single_user";
import Dashboard_Blogs from "./dashboard/componants/Blog/Blogs";
import AddBlog from "./dashboard/componants/Blog/AddBlog";
import Edit_blog from "./dashboard/componants/Blog/Edit_blog";
import Offers from "./dashboard/componants/Offers/Offers";
import AddOffer from "./dashboard/componants/Offers/AddOffer";
import EditOffer from "./dashboard/componants/Offers/EditOffer";



import ScrollToTop from './componants/ScrollToTop';
function App() {
const dispatch = useDispatch();
const [loading, setLoading] = useState(true);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    setLoading(true); // ✅ بدء تحميل البيانات

    try {
      if (user) {

        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data() || {};
          const userState = {
            uid: user.uid,
            name: user.displayName || userData.name || "Unknown User",
            email: user.email || userData.email || "No Email",
            phone: user.phoneNumber || userData.phone || "No Phone Number",
            photoURL: user.photoURL || userData.photoURL || "No Photo Available",
            ...userData,
          };

          dispatch(setUser(userState));
        } else {
          clearUserData();
        }
      } else {
        clearUserData();
      }
    } catch (error) {
      console.error("Error handling user auth state:", error);
      clearUserData();
    } finally {
      setLoading(false); // ✅ التحميل انتهى
    }
  });

  return () => unsubscribe(); // ✅ تنظيف الاشتراك عند الخروج
}, [dispatch]);

// دالة مساعدة لمسح بيانات المستخدم من Redux
const clearUserData = () => {
  dispatch(clearUser());
};


  const location = useLocation();
  const noNavFooterRoutes = ["/Main_dashboard",
    "/main_dashboard/products",
    "/dashboard/profile",
    "/login","/Login",
    "/register",
    "/Admin_log",
    "/Admin_regest",
    "/main_dashboard/dashboard_Orders",
    "/main_dashboard/single_order"
  ];

  const showNavFooter = !noNavFooterRoutes.includes(location.pathname);

  
  return (
    <div className="App">
<ScrollToTop/>      
      {showNavFooter && <Navbar />}
  <Routes>
    <Route path="/" element={<Main_Home/>}/>
    
    <Route path="/About" element={<Main_apout/>}/>
    <Route path="/Products" element={<Products/>}/>
    <Route path="/Categorys" element={<Categorys/>}/>
    <Route path="/Blogs" element={<Blogs/>}/>
    <Route path="/blog/:id" element={<SingleBlog/>}/>    
    <Route path="/Contact" element={<Contacts_us/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/Profile" element={<Profile />}>
      <Route path="edit-profile" element={<Edit_profile />} />
      <Route path="orders" element={<Orders />} />
      <Route path="orders/:orderId" element={<SingleOrder />} />
      <Route path="favorites" element={<Favorites />} />
      <Route path="address" element={<Address />} />
    </Route>
    <Route path="/Category/:categoryId" element={<Sup_Categorys/>} />
    <Route path="/subcategory/:subcategoryId" element={<Products_by_supcat/>} />
    <Route path="/product/:productId" element={<SingleProduct/>} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/wishlist" element={<Wishlist/>} />
    <Route path="/checkout" element={<Checkout/>} />
    <Route path="/success" element={<SuccessPage/>} />
    <Route path="/Offers_bage" element={<Offers_bage/>} />
    <Route path="/offer/:id" element={<Single_Offer/>} />
    
    {/* admins */}
    <Route path="/Admin_regest" element={<Admin_regest/>} />
    <Route path="/Admin_log" element={<Admin_log/>} />
    <Route path="/main_dashboard" element={<Main_dashboard />} >
        <Route path="Products" element={<Dashboard_Products/>} />            
        <Route path="addProduct" element={<AddProduct/>} />            
        <Route path="edit-product/:productId" element={<EditProduct/>} />            

        <Route path="categories" element={<Categories/>} />            
         <Route path="addCatt" element={<AddCatt/>} />            
         <Route path="edit-category/:categoryId" element={<EditCatt/>} />            
       
        <Route path="supcategory" element={<Supcategory />} />
        <Route path="add_SupCatt" element={<Add_SupCatt />} />
        <Route path="edit-subcategory/:subCategoryId" element={<Edit_supcat />} />

        <Route path="dashboard_Orders" element={<Dashboard_Orders />} />
        <Route path="single_order/:orderId" element={<Single_order />} />
        
        <Route path="users" element={<Users />} />
        <Route path="users/:userId" element={<Single_user />} />
        
        <Route path="blogs" element={<Dashboard_Blogs />} />
        <Route path="AddBlog" element={<AddBlog />} />
        <Route path="edit-blog/:id" element={<Edit_blog />} />

        <Route path="offers" element={<Offers />} />
        <Route path="addOffer" element={<AddOffer />} />
        <Route path="edit-offer/:id" element={<EditOffer />} />



    </Route>

        
  </Routes>
{showNavFooter && <Footer />}
    
    
    
    
    
    
    </div>
  );
}

export default App;
