import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'https://blankmap-server-6de6d45e4291.herokuapp.com/api'
})

// export const createMap = () => api.post(`/map/`);
export const createMap = (title,description,publicStatus,selectedCategory,tags,file) => {
    return api.post(`/map/createMap`, {
        title: title,
        description: description,
        publicStatus:publicStatus,
        selectedCategory:selectedCategory,
        tags: tags,
        file: file
    })
}
const updateMapPage = (id, mappage) => {
    return api.put(`/updateMapPage/${id}`, {
        mappage: mappage
    })
}
const apis = {
    createMap,
    updateMapPage
}

export default apis