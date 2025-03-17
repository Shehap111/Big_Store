import React, { useState } from 'react';
import './Footer.css';
import heart from '../../img/heart.png';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // استيراد useTranslation

const Footer = () => {
    const { t } = useTranslation(); // استخدام الترجمة
    const [heartState, setHeartState] = useState(false);

    const activeHeart = () => {
        setHeartState((prevState) => !prevState);
    };

    const addClassToggel = heartState ? 'onclick-heart' : '';

    return (
        <div className='Footer'>
            {/* الجزء الأول من الفوتر */}
            <div className='intro_Footer'>
                <div className='row'>
                    <div className='col-lg-3 col-md-6'>
                        <h4>{t('footer.subscribeTitle')}</h4> {/* الترجمة */}
                    </div>

                    <div className='col-lg-3 col-md-6'>
                        <p>{t('footer.subscribeDescription')}</p> {/* الترجمة */}
                    </div>

                    <div className='col-lg-3 col-md-6'>
                        <input type='text' placeholder={t('footer.placeholder')} /> {/* الترجمة */}
                    </div>

                    <div className='col-lg-3 col-md-6'>
                        <button className='button_class'>{t('footer.subscribeButton')}</button> {/* الترجمة */}
                    </div>
                </div>
            </div>

            {/* الجزء الثاني من الفوتر */}
            <div className='container'>
                <div className='row foot_contant'>


                    <div className='col-lg-3 col-md-6'>
                        <h3>{t('footer.information')}</h3> {/* الترجمة */}
                        <ul>
                            <li>
                                <Link to='/'>{t('footer.aboutUs')}</Link> {/* الترجمة */}
                            </li>
                            <li>
                                <Link to='/'>{t('footer.services')}</Link> {/* الترجمة */}
                            </li>
                            <li>
                                <Link to='/'>{t('footer.shop')}</Link> {/* الترجمة */}
                            </li>
                            <li>
                                <Link to='/'>{t('footer.contactUs')}</Link> {/* الترجمة */}
                            </li>
                            <li>
                                <Link to='/'>{t('footer.privacyPolicy')}</Link> {/* الترجمة */}
                            </li>
                            <li>
                                <Link to='/'>{t('footer.login')}</Link> {/* الترجمة */}
                            </li>
                        </ul>
                    </div>

                    <div className='col-lg-3 col-md-6'>
                        <h3>{t('footer.usefulLinks')}</h3> {/* الترجمة */}
                        <ul>
                            <li>
                                <Link to='/'>{t('footer.smartphones')}</Link> {/* الترجمة */}
                            </li>
                            <li>
                                <Link to='/'>{t('footer.laptop')}</Link> {/* الترجمة */}
                            </li>
                            <li>
                                <Link to='/'>{t('footer.clothes')}</Link> {/* الترجمة */}
                            </li>
                            <li>
                                <Link to='/'>{t('footer.fitnessEquipment')}</Link> {/* الترجمة */}
                            </li>
                            <li>
                                <Link to='/'>{t('footer.campingGear')}</Link> {/* الترجمة */}
                            </li>
                            <li>
                                <Link to='/'>{t('footer.myAccount')}</Link> {/* الترجمة */}
                            </li>
                            <li>
                                <Link to='/'>{t('footer.orders')}</Link> {/* الترجمة */}
                            </li>
                        </ul>
                    </div>

                    <div className='col-lg-6'>
                        <h3>{t('footer.getInTouch')}</h3> {/* الترجمة */}
                        <p>{t('footer.callUs')}</p> {/* الترجمة */}
                        <h4>1800 6565 222</h4>
                        <p>{t('footer.address')}</p> {/* الترجمة */}
                    </div>

                </div>
            </div>

            {/* الجزء الثالث من الفوتر */}
            <div className='last_foot'>
                <ul className='container'>
                    <li>{t('footer.copyRight')}</li> {/* الترجمة */}

                    <li>
                        {t('footer.madeWith')} 
                        <span onClick={activeHeart} className={`heart ${addClassToggel}`}>
                            <img src={heart} alt="Heart Icon" />
                        </span>{' '}
                        {t('footer.by')} 
                        <a target='_blank' href='https://www.linkedin.com/in/shehap-samer/'>
                            Shehap
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Footer;
