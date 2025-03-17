import React from "react";
import {Link, Outlet} from "react-router-dom";
import Intro from '../intro_sections/Intro'
import AddressForm from './AddressForm'
import PaymentForm from './PaymentForm'
import { useTranslation } from "react-i18next";

const Checkout = () => {
      const { t } = useTranslation();
    

    return (
    <>
      <Intro link={t("Cart.Checkout")}/>
      <div className='Checkout'> 
        <div className="">
          <div className="row">
            <div className="col-lg-4">
                <AddressForm/>                
            </div>
            
            <div className="col-lg-8">
                <PaymentForm/>
            </div>
          </div>
        </div>
      </div>    
    </>
    )
}

export default Checkout;