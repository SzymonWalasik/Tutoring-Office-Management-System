import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from "../Sidebar";
import "./FinanseNauczyciela.css";
import TopNavbar from "../../TopNavbar/TopNavbar";
import Cookies from 'js-cookie';

//zmienione hasło do testowego konta admina: Meg@_Trudn€-Hasl0
function FinanseNauczyciela() {
    const [financialReport, setFinancialReport] = useState([])
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate();

    
    // zdarzenia wywoływane bepośredni po załadowaniu komponentu
    // jest tutaj sprawdzany i odświeżany token oraz pobierana lista użytkowników
    useEffect(() => {
        checkTokenToRefresh();
        refreshFinancialReport();
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

    function refreshFinancialReport() {
        checkTokenToRefresh()
        const resquestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('access_token')}` },
        }
        fetch('http://localhost:8000/api/employee_financial_reports/', resquestOptions)
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(report => {
                const tempReport = report.filter(salary => salary.employee.id == searchParams.get("id") ? true : false)
                setFinancialReport(tempReport)
            })
            .catch(error => console.error(error))
    }

    function handleCheckboxChange(_id, _is_paid) {
        checkTokenToRefresh()
        const resquestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('access_token')}` },
            body: JSON.stringify({
                is_paid: !_is_paid,
            })
        }
        fetch('http://localhost:8000/api/employee_financial_reports/' + _id + '/', resquestOptions)
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .catch(error => console.error(error))
            .then(setTimeout(() => {refreshFinancialReport()}, 100))
    }

    const addSalary = () => {
        const newSalary = parseFloat(prompt("Podaj wartość wypłaty"));
        if (newSalary) {

            checkTokenToRefresh()
            const resquestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                            Authorization: `Bearer ${Cookies.get('access_token')}` },
                body: JSON.stringify({
                    salary: newSalary,
                    employee: searchParams.get("id"), // tutaj będzie trzeba dodać aktywnego użytkownika
                })
            }
            fetch('http://localhost:8000/api/employee_financial_reports/', resquestOptions)
                .then(response => {
                    if(!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`)
                    }
                    return response.json()
                })
                .then(tempSalary => {setTimeout(() => {setFinancialReport([...financialReport], [tempSalary])}, 100); })
                .then(setTimeout(() => {refreshFinancialReport()}, 100))
                .catch(error => console.error(error))

        } else {
            alert("Wartość wypłaty nie może być pusta");
        }
    }

return (
    <div>
        <TopNavbar />
        <Sidebar>
            <section class="teacher-finance-container">
                <h1 className="teacher-finance-header">Raport finansowy</h1>
                <table className='teacher-finance-table'>
                    <thead>
                        <tr>
                            <td>Wypłata</td>
                            <td>Data</td>
                            <td>Zapłacona</td>
                        </tr>
                    </thead>
                    <tbody>
                        {financialReport.map((item) => (
                            <tr>
                                <td>{item.salary}</td>
                                <td>{item.generate_date}</td>
                                <td><input type="checkbox" key={item.id} checked={item.is_paid} value={item.is_paid} onChange={event => handleCheckboxChange(item.id, item.is_paid)}></input></td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <button className='teacher-finance-buttons' onClick={addSalary}>Dodaj nową pensję</button>
                    </tfoot>
                </table>
            </section>
        </Sidebar>
    </div>
)
}

export default FinanseNauczyciela;