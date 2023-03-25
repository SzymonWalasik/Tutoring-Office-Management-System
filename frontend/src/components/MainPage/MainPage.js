import React from "react";
import Sidebar from "./Sidebar";
import "./MainPage.css";
import TopNavbar from "../TopNavbar/TopNavbar";
import MainPageContent from "./MainPageContent";


function MainPage() {

    return (
        <body>
            <TopNavbar />
            <Sidebar>
                <MainPageContent />
            </Sidebar>
            
        </body>
    )
}

export default MainPage;