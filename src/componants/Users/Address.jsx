import React, { useEffect, useState } from 'react';
import { db } from "../../firebase";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { useSelector } from 'react-redux';
import handelAlert from "../SweetAlert"; 
import { useTranslation } from "react-i18next";
const Address = () => {
  const { t } = useTranslation();
  const userId = useSelector((state) => state.user.uid);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    detailedAddress: '',
    city: '',
    governorate: '',
    postalCode: '',
    phoneNumber: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!userId) return;
      try {
        const q = query(collection(db, "Address"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const addressesData = [];
        querySnapshot.forEach((doc) => {
          addressesData.push({ id: doc.id, ...doc.data() });
        });
        setAddresses(addressesData);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [userId]);

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    try {
      if (editingId) {
        await updateDoc(doc(db, "Address", editingId), formData);
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === editingId ? { ...addr, ...formData } : addr
          )
        );
        handelAlert("success", t("User.Address.address_updated"), "#fff", "#5cb85c");
      } else {
        const newAddress = { ...formData, userId };
        const docRef = await addDoc(collection(db, "Address"), newAddress);
        setAddresses((prev) => [...prev, { id: docRef.id, ...newAddress }]);
        handelAlert("success", t("User.Address.address_added"), "#fff", "#5cb85c");
      }
      setFormData({
        fullName: '',
        detailedAddress: '',
        city: '',
        governorate: '',
        postalCode: '',
        phoneNumber: '',
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error adding/updating address:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "Address", id));
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      handelAlert("success", t("User.Address.address_deleted"), "#fff", "#5cb85c");
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingId(address.id);
  };

  if (loading) return <p>{t("User.Address.loading")}</p>;

  if (loading) return <p>Loading addresses...</p>;

   return (
    <div className='Address'>
      <div className="container">
        <h2>{t("User.Address.your_addresses")}</h2>
        <div className="form-container">
          <h3>{editingId ? t("User.Address.edit_address") : t("User.Address.add_new_address")}</h3>
          <form onSubmit={handleAddOrEdit}>
            <input required type="text" placeholder={t("User.Address.full_name")} value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
            <input required minLength={30} type="text" placeholder={t("User.Address.detailed_address")} value={formData.detailedAddress} onChange={(e) => setFormData({ ...formData, detailedAddress: e.target.value })} />
            <input required type="text" placeholder={t("User.Address.city")} value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
            <input required type="text" placeholder={t("User.Address.state")} value={formData.governorate} onChange={(e) => setFormData({ ...formData, governorate: e.target.value })} />
            <input required type="text" placeholder={t("User.Address.postal_code")} value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} />
            <input required type="text" placeholder={t("User.Address.phone_number")} value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
            <button type="submit">{editingId ? t("User.Address.update_address") : t("User.Address.add_address")}</button>
          </form>
        </div>

        {addresses.map((address) => (
          <div key={address.id} className="address-box">
            <h3>{t("User.Address.shipping_address")}</h3>
            <div className="box">
              <ul>
                <p><strong>{t("User.Address.name")}:</strong> {address.fullName}</p>
                <p><strong>{t("User.Address.address")}:</strong> {address.detailedAddress}</p>
                <p><strong>{t("User.Address.city")}:</strong> {address.city}</p>
              </ul>
              <ul>
                <p><strong>{t("User.Address.state")}:</strong> {address.governorate}</p>
                <p><strong>{t("User.Address.postal_code")}:</strong> {address.postalCode}</p>
                <p><strong>{t("User.Address.phone")}:</strong> {address.phoneNumber}</p>
              </ul>
              <ul className='btns'>
                <button onClick={() => handleEdit(address)}>{t("User.Address.edit")}</button>
                <button className='delete' onClick={() => handleDelete(address.id)}><i className="fa-solid fa-trash-can"></i></button>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Address;
