import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import "./RegisterForm.css";
import TopNavbar from "../TopNavbar/TopNavbar";
import Cookies from 'js-cookie';
import jwt_decode from "jwt-decode" 

function RegisterForm() {
    // const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [postId, setPostId] = useState('');
    const navigate = useNavigate();

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

    function handleRegisterSubmit(event) {
        event.preventDefault();

        if (!password || !name || !surname || !email || !confirmPassword) {
            setError('Proszę wypełnić wszystkie pola.');
            return;
        }
        else if (!passwordRegex.test(password)) {
            setError('Hasło nie spełnia wymagań\nPowinno mieć 8 znaków długości i zawierać co najmniej: 1 małą literę, 1 wielką literę, 1 cyfrę oraz 1 znak specjalny (!@#$%^&*)');
        }
        else if (password !== confirmPassword) {
            setError('Podane hasła nie są takie same');
        }
        else {
            //fetching data to backend
            const resquestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: password,
                    first_name: name,
                    last_name: surname,
                    email: email
                })
            }
            fetch('http://localhost:8000/api/users/', resquestOptions)
                .then(response => response.json())
        }
    }

    return (
        <body>
            <TopNavbar />
            <section class="register-container">
                <form className="register-form" onSubmit={handleRegisterSubmit}>
                    {error && <p>{error}</p>}
                    <input type="text" value={name} maxlength="256" name="name" placeholder="Imię" id="name" required="" onChange={event => setName(event.target.value)}></input>
                    <br />
                    <input type="text" value={surname} maxlength="256" name="surname" placeholder="Nazwisko" id="surname" required="" onChange={event => setSurname(event.target.value)}></input>
                    <br />
                    <input type="text" value={email} maxlength="256" name="email" placeholder="E-mail" id="email" required="" onChange={event => setEmail(event.target.value)}></input>
                    <br />
                    <input type="password" maxlength="256" name="password" placeholder="Hasło" id="password" required=""
                        onChange={event => setPassword(event.target.value)}></input>
                    <br />
                    <input type="password" maxlength="256" name="confirmPassword" placeholder="Potwierdź hasło" id="confirmPassword" required="" onChange={event => setConfirmPassword(event.target.value)}></input>
                    <button type='submit'>Zarejestruj się</button>
                    <div class="div-block">
                        <a id="existing-account" href="/login">Posiadam konto</a>
                    </div>
                </form>
                <p>{postId}</p>
            </section>
        </body>
    )
}
export default RegisterForm