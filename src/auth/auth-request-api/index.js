import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'https://blankmap-server-6de6d45e4291.herokuapp.com/auth'
})
export const getLoggedIn = () => api.get(`/loggedIn/`);
export const loginUser = (userName, password) => {
    return api.post(`/login/`, {
        userName : userName,
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
const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser
}

export default apis