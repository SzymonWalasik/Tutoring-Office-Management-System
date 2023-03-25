import React, { useState, useEffect } from 'react';
import logo from '../../../static/images/jednologo2.png';
import Sidebar from "../Sidebar";
import "./ZarzadzajFinansami.css";
import TopNavbar from "../../TopNavbar/TopNavbar";
import Cookies from 'js-cookie';
import jwt_decode from "jwt-decode" 
import { useNavigate } from 'react-router-dom'
import * as CgIcons from "react-icons/cg";


//zmienione hasło do testowego konta admina: Meg@_Trudn€-Hasl0
function ZarzadzajFinansami() {
    const [financeTable, setFinanceTable] = useState({});
    const [costsSum, setCostsSum] = useState(0.00);
    const navigate = useNavigate();
   
    useEffect(() => {
        checkTokenToRefresh();
        refreshFinance();
        sumValues();
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
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json();
            })
            .then(data => {
                Cookies.set('access_token', data.access, { expires: 5 / 24 / 60 })
            })
            .catch(error => console.error(error));
        }
            else {
                navigate("/login")
            }
        }
    }

    //to jest jeszcze do zrobienia, zaczęte ale nie skończone
    function refreshFinance() {
        checkTokenToRefresh()
        const resquestOptions2 = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('access_token')}` },
        }
        //adres fetcha do zmiany, nie wiem jaki jest
        fetch('http://localhost:8000/api/tutoring_office_financial_balances/', resquestOptions2)
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(finance => {setFinanceTable(finance)})
            .catch(error => console.error(error))
    }

    function sumValues() {
        const tempCostSum = (financeTable.electricity_bill +
            financeTable.rent_bill +
            financeTable.gas_bill +
            financeTable.water_bill +
            financeTable.internet_bill +
            financeTable.total_employee_cost +
            financeTable.total_maintenance_cost)
        setCostsSum(tempCostSum);
    }

    return (
        <div>
            <TopNavbar />
            <Sidebar>
                <section class="finance-container">
                    <h1 className="finance-header">Raport finansowy</h1>
                    <table className="finance-box">
                        <thead>
                            <tr>
                                <td>TYTUŁ TRANSAKCJI</td>
                                <td>TYP</td>
                                <td>KWOTA</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Rachunek za elektryczność</td>
                                <td>Koszt</td>
                                <td>{financeTable.electricity_bill} zł</td>
                            </tr>
                            <tr>
                                <td>Rachunek za lokal</td>
                                <td>Koszt</td>
                                <td>{financeTable.rent_bill} zł</td>
                            </tr>
                            <tr>
                                <td>Rachunek za wodę</td>
                                <td>Koszt</td>
                                <td>{financeTable.water_bill} zł</td>
                            </tr>
                            <tr>
                                <td>Rachunek za gaz</td>
                                <td>Koszt</td>
                                <td>{financeTable.gas_bill} zł</td>
                            </tr>
                            <tr>
                                <td>Rachunek za internet</td>
                                <td>Koszt</td>
                                <td>{financeTable.internet_bill} zł</td>
                            </tr>
                            <tr>
                                <td>Rachnek za koszta bieżące</td>
                                <td>Koszt</td>
                                <td>{financeTable.total_maintenance_cost} zł</td>
                            </tr>
                            <tr>
                                <td>Rachunek za wynagrodzenia</td>
                                <td>Koszt</td>
                                <td>{financeTable.total_employee_cost} zł</td>
                            </tr>
                            <tr>
                                <td>Suma przychodów</td>
                                <td>Przychód</td>
                                <td>{financeTable.total_income} zł</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>Suma przychodów: {financeTable.total_income}</td>
                            </tr>
                            <tr>
                                <td>Suma kosztów: {costsSum}</td>
                            </tr>
                        </tfoot>
                    </table>
                </section>
            </Sidebar>
        </div>
    )
}

export default ZarzadzajFinansami;