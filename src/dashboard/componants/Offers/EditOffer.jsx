import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import MultiSelectOffer from "./MultiSelectOffer";
import { Button } from "@mui/material";

const LANGUAGES = ["en", "ar", "fr", "de"]; // اللغات المتاحة

const EditOffer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offerData, setOfferData] = useState({
    title: {},
    discountPrice: "",
    endDate: "",
    products: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffer = async () => {
      const offerRef = doc(db, "offers", id);
      const offerSnap = await getDoc(offerRef);
      if (offerSnap.exists()) {
        setOfferData(offerSnap.data());
      } else {
        console.error("Offer not found");
      }
      setLoading(false);
    };
    fetchOffer();
  }, [id]);

  const handleTitleChange = (lang, value) => {
    setOfferData((prev) => ({
      ...prev,
      title: { ...prev.title, [lang]: value },
    }));
  };

  const handleChange = (e) => {
    setOfferData({ ...offerData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const offerRef = doc(db, "offers", id);
    await updateDoc(offerRef, offerData);
    navigate("/Main_dashboard/Offers"); // بعد الحفظ يرجع لصفحة العروض
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Offer</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {LANGUAGES.map((lang) => (
            <div key={lang}>
              <h4>{lang.toUpperCase()}</h4>
              <input
                type="text"
                placeholder={`Offer Title (${lang})`}
                value={offerData.title?.[lang] || ""}
                onChange={(e) => handleTitleChange(lang, e.target.value)}
                fullWidth
                margin="normal"
              />
            </div>
          ))}

          <input
            name="discountPrice"
            type="number"
            placeholder="Price ($)"
            value={offerData.discountPrice}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <input
            name="endDate"
            type="date"
            value={offerData.endDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <MultiSelectOffer
            selectedProducts={offerData.products}
            setSelectedProducts={(products) => setOfferData({ ...offerData, products })}
          />
          <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: "20px" }}>
            Save Changes
          </Button>
        </>
      )}
    </div>
  );
};

export default EditOffer;
