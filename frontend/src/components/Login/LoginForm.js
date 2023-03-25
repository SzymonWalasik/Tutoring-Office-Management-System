import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie';
import TopNavbar from '../TopNavbar/TopNavbar';
import './LoginForm.css';
import Cookies from 'js-cookie';



function LoginForm(props) {
    // const [showLogin, setShowLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    function handleLoginSubmit(event) {
        event.preventDefault();

        if (!email || !password) {
            setError('Proszę podać login oraz hasło.');
            return;
        }
        //Redirection to the main page when login and password are correct

        else {

            fetch('http://localhost:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email":email,
                    "password":password
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
                    Cookies.set('refresh_token', data.refresh, { expires: 1 })
                    navigate("/mainPage")
                })
                .catch(error => setError('Niepoprawne hasło, lub nie posiadasz konta'));

        }

    }


    return (
        <div class="page">
            <TopNavbar />
            <section class="login-container">
                <form className="login-form" onSubmit={handleLoginSubmit}>
                    {error && <p>{error}</p>}
                    <label className='label'>Dobrze cię widzieć!</label>
                    <input type="email" value={email} maxlength="256" name="email" placeholder="E-mail" id="email" required="" class="emailInput" onChange={event => setEmail(event.target.value)}></input>
                    <br />
                    <input type="password" maxlength="256" name="password" placeholder="Hasło" id="password" required="" class="loginInput"
                        onChange={event => setPassword(event.target.value)}></input>
                    <button type='submit' class="submitButton">Zaloguj</button>
                    <div class="div-block">
                        <a id="forget-password" href="/changePassword">Zapomniałem hasła</a>
                        <a id="create-account" href="/register">Zarejestruj się</a>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default LoginForm