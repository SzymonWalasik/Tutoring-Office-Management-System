import React from 'react'
import { useState } from 'react'
import './App.css';
import LoginForm from './components/Login/LoginForm';
import RegisterForm from './components/Register/RegisterForm';
import ForgotPasswordForm from './components/ForgotPassword/ForgotPasswordForm';
import MainPage from './components/MainPage/MainPage';
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import MainPageAdmin from './components/MainPage/MainPageAdmin';
import Placowki from './components/MainPage/SidebarOptions/Placowki';
import Pracownicy from './components/MainPage/SidebarOptions/Pracownicy';
import Uczniowie from './components/MainPage/SidebarOptions/Uczniowie';
import ZarzadzajKontem from './components/MainPage/SidebarOptions/ZarzadzajKontem';
import ZarzadzajKontami from './components/MainPage/SidebarOptions/ZarzadzajKontamiAdmin';
import ZarzadzajFinansami from './components/MainPage/SidebarOptions/ZarzadzajFinansami';
import Harmonogram from './components/MainPage/SidebarOptions/Harmonogram';
import Subject from './components/Subject/Subject';
import SubjectVariantTutoringOffice from './components/Subject/SubjectVariantTutoringOffice';
import FinanseNauczyciela from './components/MainPage/SidebarOptions/FinanseNauczyciela';


// The main component that renders the different routes
// in the application.
function App(props) {

  const [isAuthenticated, setIsAuthenticated] = useState(LoginForm.isAuthenticated);
// <GuardedRoute path="/mainPage" component={<MainPage />} auth {...isAuthenticated}/>
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/changePassword" element={<ForgotPasswordForm />} />
        <Route path="/mainPage" element={<MainPage />} />
        <Route path="/mainPageAdmin" element={<MainPageAdmin />} />
        <Route path="/placowki" element={<Placowki />}/>
        <Route path="/pracownicy" element={<Pracownicy />}/>
        <Route path="/uczniowie" element={<Uczniowie />}/>
        <Route path="/harmonogram" element={<Harmonogram />}/>
        <Route path="/zarzadzajkontem" element={<ZarzadzajKontem />}/>
        <Route path="/zarzadzajkontami" element={<ZarzadzajKontami />}/>
        <Route path="/zarzadzajfinansami" element={<ZarzadzajFinansami />}/>
        <Route path="/finansenauczyciela" element={<FinanseNauczyciela />}/>
        <Route path="/przedmioty" element={<Subject />}/>
        <Route path="/przedmioty-wariancje" element={<SubjectVariantTutoringOffice />}/>
      </Routes>
    </BrowserRouter>
   

  );
}


export default App;
