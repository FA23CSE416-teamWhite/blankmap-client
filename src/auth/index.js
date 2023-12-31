import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import api from './auth-request-api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    GET_QUESTION: "GET_QUESTION"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorMessage: null,
        extra: "",
        loading: true
    });
    const history = useNavigate();

    useEffect(() => {
        auth.getLoggedIn();
        console.log(auth.user)
    }, []);
    
    const authReducer = (action) => {
        console.log(action)
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: null,
                    loading:payload.loading
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: payload.errorMessage
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorMessage: null
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: payload.errorMessage
                })
            }

            case AuthActionType.GET_QUESTION: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorMessage: "",
                    extra: payload.extra
                })
            }

            default:
                return auth;
        }
    }
    auth.guestLogin = async function() {
        try{
            console.log("trying guest login...");
            const response = await api.loginUser("Guest", "GuestPassword");
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user,
                        loggedIn: true,
                        errorMessage: null
                    }
                })
                history("/home");
            }
        } catch(error){
            try{
                console.log("trying guest register...");
                const response = await api.registerUser("Guest", "User", "guest@gmail.com", "Guest", "GuestPassword", "GuestPassword", "GuestRecovery", "GuestRecovery");
                if (response.status === 200) {
                    console.log("Registered Sucessfully");
                    authReducer({
                        type: AuthActionType.REGISTER_USER,
                        payload: {
                            user: response.data.user,
                            loggedIn: true,
                            errorMessage: null
                        }
                    })
                    auth.loginUser("Guest", "GuestPassword");
                    console.log("GUEST LOGGED IN");
                }
            } catch(error){
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: auth.user,
                        loggedIn: false,
                        errorMessage: error.response.data.errorMessage
                    }
                })
            }
        }
    }
    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        console.log("response status")
        console.log(response.status)
        console.log(response.data)
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user,
                    loading: false
                }
            });
        }
    }

    auth.getQuestion = async function (email) {
        const response = await api.getQuestion(email);
        console.log("response status")
        console.log(response.status)
        console.log(response.data)
        return response
    }


    auth.registerUser = async function(firstName, lastName, email, userName, password, passwordVerify,recoveryQuestion,recoveryAnswer) {
        console.log("REGISTERING USER");
        console.log(firstName);
        console.log(lastName);
        try{   
            const response = await api.registerUser(firstName, lastName, email, userName, password, passwordVerify,recoveryQuestion,recoveryAnswer);   
            if (response.status === 200) {
                console.log("Registered Sucessfully");
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user,
                        loggedIn: true,
                        errorMessage: null
                    }
                })
                history("/login");
                console.log("NOW WE LOGIN");
                auth.loginUser(email, password);
                console.log("LOGGED IN");
                return response
            }
        } catch(error){
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: auth.user,
                    loggedIn: false,
                    errorMessage: error.response.data.errorMessage
                }
            })
            throw error.response
        }
    }

    auth.loginUser = async function(userName, password) {
        try{
            const response = await api.loginUser(userName, password);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user,
                        loggedIn: true,
                        errorMessage: null
                    }
                })
                history("/home");
            }
            return response
        } catch(error){
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: auth.user,
                    loggedIn: false,
                    errorMessage: error.response.data.errorMessage
                }
            })
            throw error.response.data
        }
    }

    auth.logoutUser = async function() {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history("/");
        }
    }

    // auth.getUserInitials = function() {
    //     let initials = "";
    //     if (auth.user) {
    //         initials += auth.user.firstName.charAt(0);
    //         initials += auth.user.lastName.charAt(0);
    //     }
    //     console.log("user initials: " + initials);
    //     return initials;
    // }

    auth.resetPassword = async function(email, answer, password, passwordVerify) {
        console.log(email, password)
        const response = await api.resetPassword(email, password);
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history("/");
        }
        return response
    }

    auth.updateProfile = async function(username, email, firstName, lastName, phone, bio) {
        const response = await api.updateUser(username, email, firstName, lastName, phone, bio);
        return response
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {!auth.loading ? ( // Render children only when loading is false
                props.children
            ) : (
                <div>Loading...</div> // Render a loading indicator while fetching user data
            )}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };