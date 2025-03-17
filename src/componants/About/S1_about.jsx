import React from 'react';
import Intro from '../intro_sections/Intro';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';

export const S1_about = () => {
  const { t } = useTranslation();

  return (
    <>
      <Intro name={t('about.introTitle')} link={t('about.introLink')} />

      <div className='S1_about'>
        <div className='container'>
          <div className='content'>
            <h3>{t('about.luxuryProductsTitle')}</h3>
            <p>{t('about.description')}</p>
          </div>
          <div className='row'>
            <div className='col-lg-3 col-md-6 box'>
              <span><CountUp duration={2.75} start={0} end={12580} /></span>
              <h4>{t('about.technologyProduct')}</h4>
            </div>

            <div className='col-lg-3 col-md-6 box'>
              <span><CountUp duration={2.75} start={0} end={5180} /></span>
              <h4>{t('about.employees')}</h4>
            </div>

            <div className='col-lg-3 col-md-6 box'>
              <span><CountUp duration={2.75} start={0} end={20350} /></span>
              <h4>{t('about.happyUsers')}</h4>
            </div>

            <div className='col-lg-3 col-md-6 box'>
              <span><CountUp duration={2.75} start={0} end={1625} /></span>
              <h4>{t('about.ourStores')}</h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

