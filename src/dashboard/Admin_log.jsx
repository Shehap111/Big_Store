import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import {Link} from "react-router-dom";
import handelAlert from "../componants/SweetAlert"; 
import logo from '../img/logo/shehap-high-resolution-logo-white-transparent.png'
import '../componants/Log&reg/login.css'
const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const db = getFirestore();

    try {
      // تسجيل الدخول باستخدام Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // التحقق من الدور (Role) و الموافقة (adminApproval) في Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();

        // التحقق من أن المستخدم أدمن وإذا تم الموافقة عليه
        if (userData.role === "admin" && userData.adminApproval === true) {

    handelAlert("success", "Welcome Admin", "#1A1A1A", "#3085d6");
          window.location.href = "/main_dashboard"; 
        } else if (userData.role !== "admin") {
          throw new Error("You are not an admin.");
        } else if (userData.adminApproval === false) {
          
handelAlert("info", "Your admin registration is pending approval.", "#1A1A1A", "#3085d");

        }
      } else {
     handelAlert("error", `admin not found in Firestore.`, "#1A1A1A", "#d33");

      }
    }catch (err) {
  console.error("Login failed:", err);
  handelAlert("error", err.message || "Invalid email or password.", "#1A1A1A", "#d33");
  setSuccess(""); // لو محتاج الإبقاء على هذا السطر
}
  };

  return (
    <div className="login">
      <form onSubmit={handleLogin}>
      <Link to='/'> <img src={logo} alt="logo" /> </Link>  
      <h1>Admin Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{color: "green"}}>{success}</p>}
      

  <div className="logo">
      <Link to='/'> <img src={logo} alt="logo" /> </Link>  
  </div>
      
    </div>
  );
};

export default AdminLogin;
