import React, { useState } from 'react';
import './TopNavbar.css';
import logo from '../../static/images/jednologo2.png';

function TopNavbar() {

    return (
        <div class="top-navbar">
            <img src={logo} loading="lazy" alt="logo" class="app-logo"></img>
            <h1 class="title">EDUKUŃ</h1>
        </div>
    )
}

export default TopNavbar