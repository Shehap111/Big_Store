import React from 'react';
import { useTranslation } from 'react-i18next';
import S3_about_1 from '../../img/S3_about_1.jpg';
import S3_about_2 from '../../img/S3_about_2.jpg';
import S3_about_3 from '../../img/S3_about_3.jpg';
import S3_about_4 from '../../img/S3_about_4.jpg';
import S3_about_5 from '../../img/S3_about_5.jpg';

export const S3_about = () => {
  const { t } = useTranslation();

  return (
    <div className='S3_about'>
      <div className='container'>
        <div className='row'>
          <div className='col-lg-6 col-md-6 box'>
            <h3>{t('about.quote')}</h3>
          </div>

          <div className='col-lg-6 col-md-6 box'>
            <div className='imege'>
              <img src={S3_about_1} alt='' />
            </div>
          </div>

          <div className='col-lg-6 col-md-6 box'>
            <div className='row'>
              <div className='col-lg-6 col-md-6 col-sm-3'>
                <div className='imege'>
                  <img src={S3_about_2} alt='' />
                </div>
              </div>

              <div className='col-lg-6 col-md-6 col-sm-3'>
                <div className='imege'>
                  <img src={S3_about_3} alt='' />
                </div>
              </div>

              <div className='col-lg-6 col-md-6 col-sm-3'>
                <div className='imege'>
                  <img src={S3_about_4} alt='' />
                </div>
              </div>

              <div className='col-lg-6 col-md-6 col-sm-3'>
                <div className='imege'>
                  <img src={S3_about_5} alt='' />
                </div>
              </div>
            </div>
          </div>

          <div className='col-lg-6 col-md-6 box'>
            <h3>{t('about.teamTitle')}</h3>
            <p>{t('about.paragraph1')}</p>
            <p>{t('about.paragraph2')}</p>

            <h5>{t('about.socialLinks')}</h5>
            <ul>
              <li><i className='fa-brands fa-twitter'></i></li>
              <li><i className='fa-brands fa-instagram'></i></li>
              <li><i className='fa-brands fa-facebook'></i></li>
              <li><i className='fa-brands fa-behance'></i></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
