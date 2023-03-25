import React from "react";
import "./MainPageContent.css";
import logo from '../../static/images/jednologo2.png';

function MainPageContent (){
    return(
        <section className="main-container">
            <img src={logo} loading="lazy" alt="logo" className="main-content-logo"></img>
        </section>
      
    )
}

export default MainPageContent