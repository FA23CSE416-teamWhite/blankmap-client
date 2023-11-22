import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'https://blankmap-server-6de6d45e4291.herokuapp.com/auth'
})
export const getLoggedIn = () => api.get(`/loggedIn/`);
export const getQuestion = () => api.get(`/question/`);
export const loginUser = (email, password) => {
    return api.post(`/login/`, {
        email : email,
        password : password
    })
}
export const logoutUser = () => api.get(`/logout/`)
export const registerUser = (firstName, lastName, email, userName, password, passwordVerify) => {
    return api.post(`/register/`, {
        firstName : firstName,
        lastName : lastName,
        email : email,
        userName : userName,
        password : password,
        passwordVerify : passwordVerify
    })
}

export const resetPassword = (email, password) => {
    return api.post(`/reset/`, {
        email : email,
        password : password
    })
}
const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    getQuestion,
    resetPassword
}

export default apis