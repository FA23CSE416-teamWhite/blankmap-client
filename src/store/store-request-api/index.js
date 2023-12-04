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
    return api.put(`/map/updateMapPage/${id}`, {
        mappage: mappage
    })
}
export const getMapPagePairs = () => api.get(`/map/mappagepairs/`)
export const getPublicMapPagePairs = () => api.get(`/map/publicMapPagePairs/`)
export const getMapPage = () => api.get(`/map/mappages/`)
export const getMapPageById = (id) => api.get(`/map/mappage/${id}`)
const apis = {
    createMap,
    updateMapPage,
    getMapPagePairs,
    getMapPage,
    getMapPageById,
    getPublicMapPagePairs
}

export default apis