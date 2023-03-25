import React from "react";
import Sidebar from "./Sidebar";
import "./MainPageAdmin.css";
import logo from '../../static/images/jednologo2.png';
import TopNavbar from "../TopNavbar/TopNavbar";


function MainPageAdmin() {

    return (
        <div>
            <TopNavbar />
            <Sidebar>
            </Sidebar>
        </div>
    )
}

export default MainPageAdmin;