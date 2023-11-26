import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'https://blankmap-server-6de6d45e4291.herokuapp.com/auth'
})

// export const createMap = () => api.post(`/map/`);
export const createMap = (title,description,publicStatus,tags,file) => {
    return api.post(`/map/`, {
        title: title,
        description: description,
        publicStatus:publicStatus,
        tags: tags,
        file: file
    })
}

const apis = {
    createMap
}

export default apis