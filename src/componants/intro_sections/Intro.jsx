import React from 'react'
import {Link} from 'react-router-dom'
import './intro.css'
import { useTranslation } from 'react-i18next'; // استيراد الترجمة

const Intro = (props) => {
    const { t } = useTranslation();
  
  return (
    <div className='Intro-Sections'>
          <div className="ind">
                <h1>{props.name}</h1>
          <ul>
              <li> <Link to='/'>{t('Intro.title')}</Link> </li>
              <span>/</span>
              <li>{ props.link }</li>
          </ul>
        </div>
    </div>
  )
}

export default Intro