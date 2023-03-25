import React, { useState, useEffect } from 'react';
import Sidebar from "../Sidebar";
import "./Pracownicy.css";
import TopNavbar from "../../TopNavbar/TopNavbar";
import InitialsAvatar from 'react-initials-avatar';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import 'react-initials-avatar/lib/ReactInitialsAvatar.css';


function Pracownicy() {
    const [workers, setWorkers] = useState([])
    const navigate = useNavigate();


    useEffect(() => {
        checkTokenToRefresh();
        refreshWorkersTable();
    }, []);

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

    function refreshWorkersTable() {
        checkTokenToRefresh()
        const resquestOptions2 = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('access_token')}` },
        }
        fetch('http://localhost:8000/api/users/', resquestOptions2)
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(users => {
                const tempWorkers = users.filter(worker => worker.groups.some(group => group.id == 2 ? true : false))
                setWorkers(tempWorkers)})
            .catch(error => console.error(error))
    }

    return (
        <div>
            <TopNavbar />
            <Sidebar>
                <section className="workers-container">
                    <h1 className="workers-header">Nasi Pracownicy</h1>

                    {console.log(workers, "workers")}
                    {workers.map(worker => (
                        <div className="workers-box">
                            <InitialsAvatar className="initial-avatar" name={worker.first_name + " " + worker.last_name}/>
                            <div>
                                <label className="workers-label">{worker.first_name} {worker.last_name}</label>
                                <label className="workers-label">Email: {worker.email}</label>
                                <button className='workers-button' onClick={event => (navigate({
                                    pathname: "/finansenauczyciela",
                                    search: "?id=" + worker.id
                                }))}>Finanse</button>
                            </div>
                        </div>
                    ))}
                </section>
            </Sidebar>
        </div>
    )
}

export default Pracownicy;