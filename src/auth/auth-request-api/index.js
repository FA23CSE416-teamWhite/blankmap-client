import axios from 'axios'
import apiUrl from '../../baseURL'
axios.defaults.withCredentials = true;

const api = axios.create({
    // baseURL: 'https://blankmap-server-6de6d45e4291.herokuapp.com/auth'
    baseURL: apiUrl+'/auth'
})
export const getLoggedIn = () => api.get(`/loggedIn/`, { headers: { 'Cache-Control': 'no-cache' } });
export const getQuestion = (email) => api.get(`/question/${email}`);
export const loginUser = (userName, password) => {
    return api.post(`/login/`, {
        userName : userName,
        password : password
    })
}
export const logoutUser = () => api.get(`/logout/`)
export const registerUser = (firstName, lastName, email, userName, password, passwordVerify,recoveryQuestion,recoveryAnswer) => {
    return api.post(`/register/`, {
        firstName : firstName,
        lastName : lastName,
        email : email,
        userName : userName,
        password : password,
        passwordVerify : passwordVerify,
        recoveryQuestion : recoveryQuestion,
        recoveryAnswer : recoveryAnswer
    })
}

export const resetPassword = (email, password) => {
    return api.post(`/update`, {
        params:{
            email:email
        },
        password: password
    })
}

export const updateUser = (username, email, firstName, lastName, phone, bio) => {
    return api.post(`/update`, {
        params:{
            userName:username
        },
        email:email,
        firstName:firstName,
        lastName:lastName,
        phone:phone,
        bio:bio
    })
}
const apis = {
    getLoggedIn,
    getQuestion,
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    resetPassword
}

export default apis