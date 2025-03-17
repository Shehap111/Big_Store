import React from "react";
import { collection, getDocs, writeBatch, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // تأكد إن مسار Firebase صحيح

const UpdateProducts = () => {
  const updateAllProducts = async () => {
    try {
      const productsRef = collection(db, "products");
      const snapshot = await getDocs(productsRef);
      const batch = writeBatch(db);

      snapshot.forEach((doc) => {
        const productRef = doc.ref;
        batch.update(productRef, {
          createdAt: serverTimestamp(),
          sales: doc.data().sales || 0,
        });
      });

      await batch.commit();
      console.log("✅ All products updated successfully!");
    } catch (error) {
      console.error("❌ Error updating products:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={updateAllProducts} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
        Update All Products
      </button>
    </div>
  );
};

export default UpdateProducts;
