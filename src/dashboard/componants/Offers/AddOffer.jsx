import { useState } from "react";
import { db } from "../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import ProductSelector from "./MultiSelectOffer";

const LANGUAGES = ["en", "ar", "fr", "de"]; // اللغات المتاحة

const AddOffer = () => {
  const [title, setTitle] = useState({});
  const [discountPrice, setDiscountPrice] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(title).some((val) => !val) || !discountPrice || !endDate || selectedProducts.length === 0) {
      alert("Please fill all fields and select at least one product");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "offers"), {
        title,
        discountPrice: Number(discountPrice),
        endDate,
        products: selectedProducts,
        isHomePageOffer: false,
        createdAt: serverTimestamp(), // 🔥 إضافة تاريخ الإنشاء تلقائيًا
      });
      alert("Offer added successfully!");
      setTitle({});
      setDiscountPrice("");
      setEndDate("");
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error adding offer: ", error);
      alert("Failed to add offer");
    }
    setLoading(false);
  };

  return (
    <form className="add-offer" onSubmit={handleOfferSubmit}>
      {LANGUAGES.map((lang) => (
        <div key={lang}>
          <h4>{lang.toUpperCase()}</h4>
          <input
            type="text"
            placeholder={`Offer Title (${lang})`}
            value={title[lang] || ""}
            onChange={(e) => setTitle((prev) => ({ ...prev, [lang]: e.target.value }))}
            required
          />
        </div>
      ))}

      <input
        type="number"
        placeholder="Discount Price"
        value={discountPrice}
        onChange={(e) => setDiscountPrice(e.target.value)}
        required
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        required
      />
      <ProductSelector selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts} />
      <button type="submit" disabled={loading}>
        {loading ? "Adding Offer..." : "Add Offer"}
      </button>
    </form>
  );
};

export default AddOffer;
