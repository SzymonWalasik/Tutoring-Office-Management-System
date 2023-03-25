import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../Sidebar";
import "./ZarzadzajKontamiAdmin.css";
import TopNavbar from "../../TopNavbar/TopNavbar";
import Cookies from 'js-cookie';

//zmienione hasło do testowego konta admina: Meg@_Trudn€-Hasl0
function ZarzadzajKontami() {
    const [error, setError] = useState('');
    const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [userTable, setUserTable] = useState([]);
    const [id, setId] = useState('');
    const [groupList, setGroupList] = useState([]);
    const [activeGroupList, setActiveGroupList] = useState([])
    const navigate = useNavigate();

    
    // zdarzenia wywoływane bepośredni po załadowaniu komponentu
    // jest tutaj sprawdzany i odświeżany token oraz pobierana lista użytkowników
    useEffect(() => {
        checkTokenToRefresh();
        refreshUserTable();
        refreshGroupList();
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
            .catch(error => setError('Niepoprawne hasło, lub nie posiadasz konta'));
        }
            else {
                navigate("/login")
            }
        }
    }
    
    // stare wartości userTable przeładowywane są na aktualne
    function refreshUserTable() {
        checkTokenToRefresh()
        const resquestOptions2 = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('access_token')}` },
        }
        fetch('http://localhost:8000/api/users/', resquestOptions2)
        // fetch('https://jsonplaceholder.typicode.com/users/', resquestOptions2)
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(users => setUserTable(users))
            .catch(error => console.error(error))
    }

    // na podstawie przekazanego adresu email dodawany jest użytkownik
    // wartości pól tekstowych formularza przyporządkowywane są 
    // do odpowiednich składowych rekordów tablicy użytkowników
    function setActiveUser(_email) {
        const user = userTable.filter(table_user => table_user.email === _email)[0];
        setName(user.first_name)
        setSurname(user.last_name)
        setEmail(user.email)
        setId(user.id)
        setGroupList(groupList.map((group) => {
            const isActive = user.groups.some(element => {
                if(element.id === group.id) {
                    return true
                }
                return false;
            })
            const element = {id: group.id, name: group.name, active: isActive}
            return element
        }))
    }

    // na podstawie adresu email wybierany jest z listy użytkownik do edycji
    // na podstawie pól z formularza dokonywana jest edycja profilu użytkownika
    // na początku sprawdzane jest wypełnienie wszystkich pól oraz poprawność składniowa poszczególnych pól
    // na podstawie wartości z pól formularza, przechowywanych w stanach aplikacji,
    // wartości wysyłane są do endpointu celem edytowania profilu użytkownika
    function handleEditUsersSubmit(event) {
        event.preventDefault();

        if ( !name || !surname || !email) {
            setError('Proszę wypełnić wszystkie pola.');
            return;
        }

        else {
            checkTokenToRefresh()
            const tempGroupList = groupList.filter(item => item !== null && item.active == true).map(group => group.id);
            const resquestOptions = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json',
                            Authorization: `Bearer ${Cookies.get('access_token')}` },
                body: JSON.stringify({
                    first_name: name,
                    last_name: surname,
                    groups: tempGroupList
                })
            }
            fetch('http://localhost:8000/api/users/' + id + '/', resquestOptions)
                .then(response => response.json())
            refreshUserTable();
            
        }
    }

    function refreshGroupList() {
        checkTokenToRefresh()
        const resquestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',
                        Authorization: `Bearer ${Cookies.get('access_token')}` },
        }
        fetch('http://localhost:8000/api/groups/', resquestOptions)
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(groupList => setGroupList(groupList.map((group) => {
                const element = {id: group.id, name: group.name, active: false}
                return element
            })))
            .catch(error => console.error(error))
    }

    function toggleGroup(_id) {
        setGroupList(groupList.map((group) => {
            const isActive = group.id == _id ? !(group.active) : group.active
            const element = {id: group.id, name: group.name, active: isActive}
            return element
        }))
    }

    return (
        <div>
            <TopNavbar />
            <Sidebar>
                <section class="edit-users-container">
                    <h1 className="management-header">Zarządzanie użytkownikami</h1>
                    <form className="edit-users-form" onSubmit={handleEditUsersSubmit}>
                        <select className="user-list" name="Użytkownicy" id="userList" onChange={event => setActiveUser(event.target.value)}>
                            <option>Wybierz użytkownika</option>
                            {userTable.map(user =>(
                                <option value={user.email}>
                                    {user.id}: {user.first_name} {user.last_name}, {user.email}
                                </option>
                            ))}
                        </select>
                        {error && <p>{error}</p>}
                        <label type="text" className='group-label'>Wybrany użytkownik: {name} {surname}, {email}</label>
                        <br />
                        <input type="text" value={name} maxlength="256" name="name" placeholder="Nowe imię" id="name" required="" onChange={event => setName(event.target.value)}></input>
                        <br />
                        <input type="text" value={surname} maxlength="256" name="surname" placeholder="Nowe nazwisko" id="surname" required="" onChange={event => setSurname(event.target.value)}></input>
                        <br />
                        {groupList.map((group) => (
                            <>
                            <div className='checkbox-div'>
                                <input className="checkbox" type="checkbox" id={group.id} value={group.id} onChange={event => toggleGroup(event.target.value)} checked={group.active}></input>
                                <label className='checkbox-label' for={group.id}>{group.name}</label>
                            </div>
                            <br/>
                            </>
                        ))}

                        <button type='submit'>Edytuj wszystkie dane</button>
                    </form>
                </section>
            </Sidebar>
        </div>
    )
}

export default ZarzadzajKontami;