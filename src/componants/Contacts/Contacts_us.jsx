import React, { useState } from 'react';
import './contact_us.css';
import Intro from '../intro_sections/Intro';
import { db } from '../../firebase'; // استيراد Firestore
import { collection, addDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next'; // استيراد الترجمة

const Contacts_us = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        timestamp: new Date()
      });
      setSuccess(true);
      setFormData({ fullName: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
    setLoading(false);
  };

  return (
    <>
      <Intro name={t('contact.title')} link="Contact" />

      <div className="Contacts">
        <div className="location">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.611850633!2d31.176062335026955!3d30.059611343172765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb296e8423bba!2sCairo%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1696944013940!5m2!1sen!2seg"
            width={"100%"}
            height={300}
          ></iframe>

          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <form className="box_all" onSubmit={handleSubmit}>
                  <h6>{t('contact.title')}</h6>
                  <h3>{t('contact.subtitle')}</h3>
                  {success && (
                    <div className="alert alert-success">
                      {t('contact.successMessage')}
                    </div>
                  )}
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="fullName"
                      placeholder={t('contact.form.fullName')}
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder={t('contact.form.email')}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      placeholder={t('contact.form.phone')}
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <textarea
                      name="message"
                      placeholder={t('contact.form.message')}
                      rows={7}
                      className="form-control"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button
                    className="SUBMIT form-control"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? t('contact.form.submitting') : t('contact.form.submit')}
                  </button>
                </form>
              </div>

              <div className="col-lg-6">
                <div className="righr_box">
                  <h3>{t('contact.getInTouch.title')}</h3>
                  <p>{t('contact.getInTouch.description')}</p>
                  <ul>
                    <li>
                      <i className="fa-solid fa-location-dot"></i>
                    </li>
                    <li>
                      <h5>{t('contact.getInTouch.addressTitle')}</h5>
                      <p>{t('contact.getInTouch.addressDetails')}</p>
                    </li>
                  </ul>
                  <ul>
                    <li>
                      <i className="fa-regular fa-envelope"></i>
                    </li>
                    <li>
                      <h5>{t('contact.getInTouch.emailTitle')}</h5>
                      <p>{t('contact.getInTouch.emailDetails')}</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contacts_us;
