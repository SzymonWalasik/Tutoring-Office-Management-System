import React, { useState, useEffect } from 'react';
import logo from '../../../static/images/jednologo2.png';
import Sidebar from "../Sidebar";
import "./Placowki.css";
import TopNavbar from "../../TopNavbar/TopNavbar";
import Cookies from 'js-cookie';
import jwt_decode from "jwt-decode" 
import { useNavigate } from 'react-router-dom'

//zmienione hasło do testowego konta admina: Meg@_Trudn€-Hasl0
function Placowki() {
    const navigate = useNavigate();
    const [facilitiesTable, setFacilitiesTable] = useState([])
   
    function manage() {
        navigate("/zarzadzajfinansami")
    }

       // zdarzenia wywoływane bepośredni po załadowaniu komponentu
    // jest tutaj sprawdzany i odświeżany token oraz pobierana lista użytkowników
    useEffect(() => {
        checkTokenToRefresh();
        refreshFacilitiesTable();
    }, []);


    // funkcja sprawdzająca, czy access token nie przedawnił się
    // jeśli tak, to próbuje odświeżyć na podstawie refresh tokena
    // jeśli refresh token się przedawnił, użytkownik odsyłany jest na stronę logowania
    function checkTokenToRefresh() {
        if(Cookies.get("access_token") == null) {
            if(Cookies.get("refresh_token") != null) {
                //tutaj odświeżanie tokena refreshem
                fetch('http://localhost:8000/api/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refresh: Cookies.get("refresh_token")
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error, status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                Cookies.set('access_token', data.access, { expires: 5 / 24 / 60 })
            })
            }
            
            else {
                navigate("/login")
            }
        }
    }

    function refreshFacilitiesTable() {
        checkTokenToRefresh()
        const resquestOptions2 = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('access_token')}` },
        }
        fetch('http://localhost:8000/api/tutoring_offices/', resquestOptions2)
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            // .then(facilities => setFacilitiesTable(facilities))
            .catch(error => console.error(error))

        //PAMIĘTAĆ, ŻEBY TO WYCIEPAĆ-------------------------------------------------------------------------------------------
        //PAMIĘTAĆ, ŻEBY TO WYCIEPAĆ-------------------------------------------------------------------------------------------
        //PAMIĘTAĆ, ŻEBY TO WYCIEPAĆ-------------------------------------------------------------------------------------------
        const tempFacilities = [{name: "test1", city: "test1", manager: "test1"},
            {name: "test2", city: "test2", manager: "test2"},
            {name: "test3", city: "test3", manager: "test3"},]
        setFacilitiesTable(tempFacilities)
    }

    return (
        <div>
            <TopNavbar />
            <Sidebar>
               
                <section class="facilities-container">
                    <h1 className="management-header">Lista Placówek</h1>
                    <div className="facilities-div">
                        {facilitiesTable.map(facility => (
                            <>
                            <div className="facilities-box">
                            <img src={logo} loading="lazy" alt="logo" class="facilities-logo"></img>
                                <div className='form-labels-div'>
                                    <label className='form-labels'>Nazwa: {facility.name}</label>
                                    <label className='form-labels'>Miejscowość: {facility.city}</label>
                                    <label className='form-labels'>Menadżer: {facility.manager}</label>
                                    <button className='manage-facilities-button' onClick={()=>{manage()}}>Zarządzaj finansami</button>
                                </div>
                            </div>
                            <br/>
                            </>
                        ))}
                    </div>
                </section>
            </Sidebar>
        </div>
    )
}

export default Placowki;