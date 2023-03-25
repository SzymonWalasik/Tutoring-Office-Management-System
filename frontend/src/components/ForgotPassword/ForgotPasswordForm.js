import React, { useState } from 'react';
import TopNavbar from '../TopNavbar/TopNavbar';
import './ForgotPasswordForm.css';

function ForgotPasswordForm() {
    // const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
   
    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    function handleChangePasswordSubmit(event) {
        event.preventDefault();

        if (!login || !email) {
            setError('Proszę wypełnić wszystkie pola.');
            return;
        }
    }
    return (
        <body>
            <TopNavbar />
            <section class="register-container">
                <form className="register-form" onSubmit={handleChangePasswordSubmit}>
                    {error && <p>{error}</p>}
                    <input type="text" class="loginInput" value={login} maxlength="256" name="login" placeholder="Login użytkownika" id="login" required="" onChange={event => setLogin(event.target.value)}></input>
                    <br />
                    <input type="text" class="loginInput" value={email} maxlength="256" name="email" placeholder="Adres e-mail" id="email" required="" onChange={event => setEmail(event.target.value)}></input>
                    <br />
                    <button type='submit'>Wygeneruj email</button>
                    <div class="div-block">
                        <a id="back-to-login" href="/login">Posiadam konto</a>
                        <a id="create-account" href="/register">Nie posiadam jeszcze konta</a>
                    </div>
                </form>
            </section>
        </body>
        
    )
}

export default ForgotPasswordForm