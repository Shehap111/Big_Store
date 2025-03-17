import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';

const AddressForm = () => {
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState([]);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (user?.uid) {
        const q = query(
          collection(db, 'Address'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const addressesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAddresses(addressesData);
      }
    };
    fetchAddresses();
  }, [user?.uid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user?.uid) {
        const newAddress = {
          fullName,
          phoneNumber,
          city,
          governorate,
          detailedAddress,
          postalCode,
          userId: user.uid,
        };
        await addDoc(collection(db, 'Address'), newAddress);
        alert(t('Checkout.AddressForm.alerts.success'));
        setFullName('');
        setPhoneNumber('');
        setCity('');
        setGovernorate('');
        setDetailedAddress('');
        setPostalCode('');
      }
      window.location.reload();
    } catch (error) {
      console.error(t('Checkout.AddressForm.alerts.error'), error);
    }
  };

  return (
    <div className="address-form">
      <h3>{t('Checkout.AddressForm.title')}</h3>
      <form onSubmit={handleSubmit} className="new-address-form">
        <div>
          <label>{t('Checkout.AddressForm.formLabels.fullName')}</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>{t('Checkout.AddressForm.formLabels.phoneNumber')}</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>{t('Checkout.AddressForm.formLabels.city')}</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>{t('Checkout.AddressForm.formLabels.governorate')}</label>
          <select
            value={governorate}
            onChange={(e) => setGovernorate(e.target.value)}
            required
          >
            <option value="">{t('Checkout.AddressForm.formLabels.selectGovernorate')}</option>
            <option value="Cairo">Cairo</option>
            <option value="Giza">Giza</option>
            <option value="Alexandria">Alexandria</option>
          </select>
        </div>
        <div>
          <label>{t('Checkout.AddressForm.formLabels.detailedAddress')}</label>
          <textarea
            value={detailedAddress}
            onChange={(e) => setDetailedAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label>{t('Checkout.AddressForm.formLabels.postalCode')}</label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
        </div>
        <button type="submit">{t('Checkout.AddressForm.buttons.saveAddress')}</button>
      </form>
    </div>
  );
};

export default AddressForm;