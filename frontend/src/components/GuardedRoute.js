import React from 'react';
import { Route } from "react-router-dom";
import { useHistory } from "react-router-dom";
import MainPage from './MainPage/MainPage';


const GuardedRoute = ({ component: MainPage, auth, ...rest }) => (

    <Route {...rest} render={(props) => (
        auth === true
            ? <MainPage {...props} />
            : props.history.push('/login') 
    )} />
)

export default GuardedRoute;