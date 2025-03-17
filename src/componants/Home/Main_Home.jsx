import React from 'react'
import Home_S1 from './Home_S1'
import Home_S2 from './Home_S2'
import Home_S3 from './Home_S3'
import './home.css'
import Home_S4 from './Home_S4'
import Home_S5 from './Home_S5'
import Home_S6 from './Home_S6'

const Main_Home = () => {



  return (
    <div className='main_home'>
        <Home_S1/>
        <Home_S2/>
        <Home_S3/>
        <Home_S4 />
      <Home_S5 />
      <Home_S6/>
    </div>
  )
}

export default Main_Home