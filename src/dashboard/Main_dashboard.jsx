import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; 
import "./dashboard.css"; // اسم ملف الـ CSS الخاص بك
import Sidebar from "./componants/Sidebar";
import { Link, Outlet } from "react-router-dom";


const Main_dashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useSelector((state) => state.user); // استرجاع بيانات المستخدم من الـ Redux
    

    
    
  useEffect(() => {
    if (user) {
      // تحقق من أن المستخدم هو أدمن معتمد
      if (user.role === "admin" && user.adminApproval === true) {
        setIsAdmin(true); // إذا كان أدمن مسجل دخول
      } else {
        setIsAdmin(false); // إذا كان ليس أدمن
      }
    }
  }, [user]);


    
  return (
    <div>
      {isAdmin ? (
<section className="Main_dashboard">                
<Sidebar/>


        <div className="dash-contant" style={{flex: 1, padding: "20px"}}>
                      
          <Outlet /> 
        </div>


</section>     



              
      ) : (
        <h1>سجل دخول ادمن !</h1> // إذا لم يكن الأدمن مسجل دخول
      )}
    </div>
  );
};

export default Main_dashboard;
