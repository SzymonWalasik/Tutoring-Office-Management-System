import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import Sidebar from "../Sidebar";
import "./ZarzadzajKontem.css";
import TopNavbar from "../../TopNavbar/TopNavbar";
import Cookies from 'js-cookie';
import jwt_decode from "jwt-decode" 

//zmienione hasło do testowego konta admina: Meg@_Trudn€-Hasl0
function ZarzadzajKontem() {
    const [error, setError] = useState('');
    const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [previousPassword, setPreviousPassword] = useState('');
    const [previousPasswordLoaded, setPreviousPasswordLoaded] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userGroups, setUserGroups] = useState([]);
    const navigate = useNavigate();

    // zdarzenia wywoływane bepośredni po załadowaniu komponentu
    // jest tutaj sprawdzany i odświeżany token oraz pobierane dane o użytkowniku
    useEffect(() => {
        checkTokenToRefresh();        
        const resquestOptions = {
            method: 'GET',
            headers: { Authorization: `Bearer ${Cookies.get("access_token")}` },
        }
        fetch('http://localhost:8000/api/users/' + jwt_decode(Cookies.get("access_token")).user_id + "/", resquestOptions)
            .then(response => response.json())
            .then(data => {
                setName(data.first_name)
                setSurname(data.last_name)
                setEmail(data.email)
                setPreviousPasswordLoaded(data.password)
                setUserGroups(data.groups)
            })
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

    // na podstawie pól z formularza dokonywana jest edycja profilu użytkownika
    // na początku sprawdzane jest wypełnienie wszystkich pól oraz poprawność składniowa poszczególnych pól
    // spradzana jest zgodność podanego starego hasła z odczytanym z bazy danych
    // na podstawie wartości z pól formularza, przechowywanych w stanach aplikacji,
    // wartości wysyłane są do endpointu celem edytowania profilu użytkownika
    function handleEditUserSubmit(event) {
        event.preventDefault();

        if (!password || !name || !surname || !email || !confirmPassword) {
            setError('Proszę wypełnić wszystkie pola.');
            return;
        }
        if (previousPassword != previousPassword) {
            setError("Poprzednie hasło nie zgadza się z zapisanym hasłem. Spróbuj jeszcze raz")
        }
        else if (!passwordRegex.test(password)) {
            setError('Hasło nie spełnia wymagań\nPowinno mieć 8 znaków długości i zawierać co najmniej: 1 małą literę, 1 wielką literę, 1 cyfrę oraz 1 znak specjalny (!@#$%^&*)');
        }
        else if (password !== confirmPassword) {
            setError('Podane hasła nie są takie same');
        }
        else {
            checkTokenToRefresh();
            const resquestOptions = {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json',
                     Authorization: `Bearer ${Cookies.get("access_token")}` },
                body: JSON.stringify({
                    password: password,
                    first_name: name,
                    last_name: surname
                })
            }
            fetch('http://localhost:8000/api/users/' + jwt_decode(Cookies.get("access_token")).user_id + "/", resquestOptions)
                .then(response => response.json())
        }
    }

    return (
        <div>
            <TopNavbar />
            <Sidebar>
                <section class="edit-user-container">
                    <h1 className="management-header">Twój profil</h1>
                    <form className="edit-user-form" onSubmit={handleEditUserSubmit}>
                        {error && <p>{error}</p>}
                        <label type="text" className='group-label'>Wybrany użytkownik: {name} {surname}, {email}</label>
                        <input type="text" value={name} maxlength="256" name="name" placeholder="Nowe imię" id="name" required="" onChange={event => setName(event.target.value)}></input>
                        <br />
                        <input type="text" value={surname} maxlength="256" name="surname" placeholder="Nowe nazwisko" id="surname" required="" onChange={event => setSurname(event.target.value)}></input>
                        <br />
                        <input type="password" maxlength="256" name="previousPassword" placeholder="Stare hasło" id="previousPassword" required=""
                            onChange={event => setPreviousPassword(event.target.value)}></input>
                        <br />
                        <input type="password" maxlength="256" name="password" placeholder="Nowe hasło" id="password" required=""
                            onChange={event => setPassword(event.target.value)}></input>
                        <br />
                        <input type="password" maxlength="256" name="confirmPassword" placeholder="Potwierdź hasło" id="confirmPassword" required="" onChange={event => setConfirmPassword(event.target.value)}></input>
                        <br/>
                        {userGroups.map(_group => (
                            <>
                            <label className="group-label">Grupa: {_group.name}</label>
                            </>
                        ))}

                        <button type='submit'>Edytuj wszystkie dane</button>
                    </form>
                </section>
            </Sidebar>
        </div>
    )
}

export default ZarzadzajKontem;