import React from 'react';
import { useTranslation } from 'react-i18next';

const S2_about = () => {
  const { t } = useTranslation();

  return (
    <div className="S2_about">
      <div className="contabiner">
        <div className="contant">
          <h3>{t('about.whirlpoolExperience')}</h3>
        </div>
      </div>
    </div>
  );
};

export default S2_about;
