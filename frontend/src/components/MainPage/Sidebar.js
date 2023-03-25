import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import TopNavbar from '../TopNavbar/TopNavbar';
import "./Sidebar.css"
import * as CgIcons from "react-icons/cg";
import * as RiIcons from "react-icons/ri"
import * as FiIcons from "react-icons/fi"


const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [sidebarClosed, setSidebarClosed] = useState(false);
    const toggle = () => {
        setIsOpen(!isOpen);
    }
    const changeSidebarState = () => {
        setSidebarClosed(!sidebarClosed);
    }
    const menuItem = [
        {
            path: "/placowki",
            name: "Placówki",
            icon: <CgIcons.CgHome/>
        },
        {
            path: "/przedmioty",
            name: "Przedmioty",
            icon: <FiIcons.FiBook/>
        },
        {
            path: "/przedmioty-wariancje",
            name: "Przedmioty w placówkach",
            icon: <FiIcons.FiBookOpen/>
        },
        {
            path: "/pracownicy",
            name: "Pracownicy",
            icon: <CgIcons.CgWorkAlt/>
        },
        {
            path: "/uczniowie",
            name: "Uczniowie",
            icon: <CgIcons.CgNotes/>
        },
        {
            path: "/harmonogram",
            name: "Harmonogram",
            icon: <CgIcons.CgCalendarDates/>
        },
        {
            path: "/zarzadzajkontem",
            name: "Twój Profil",
            icon: <CgIcons.CgProfile/>
        },
        {
            path: "/zarzadzajkontami",
            name: "Użytkownicy",
            icon: <RiIcons.RiAdminLine/>
        },
        {
            path: "/login",
            name: "Wyloguj",
            icon: <CgIcons.CgLogOut/>
        },
    ]

    return (
        <div className='sidebar-package'>
            <div style={{ width: isOpen ? "auto" : "50px" }} className="sidebar">
                <div className="top_section">
                    <h1 style={{ display: isOpen ? "block" : "none" }} className="menu">Menu</h1>
                    <div id="hamburgerToggle">
                        <input class="hamburger-input" type="checkbox" onClick={()=>{toggle();changeSidebarState()}}/>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
                        <i src="......\public\favicon.ico" alt="ikona" onClick={toggle}></i>
                    </div>
                </div>
                {
                    menuItem.map((item, index) => (
                        <NavLink to={item.path} key={index} className="link" activeclassName="active">
                            <div className="icon">{item.icon}</div>
                            <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
                        </NavLink>
                    ))
                }
            </div>
            <main>{children}</main>
        </div>
    );
};

export default Sidebar;