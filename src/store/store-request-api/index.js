import axios from 'axios'
import apiUrl from '../../baseURL'
axios.defaults.withCredentials = true;

const api = axios.create({
    // baseURL: 'https://blankmap-server-6de6d45e4291.herokuapp.com/api'
    baseURL: apiUrl+'/api'
})

// export const createMap = () => api.post(`/map/`);
export const createMap = (title,description,publicStatus,selectedCategory,tags,file,imageURL) => {
    console.log(file)
    return api.post(`/map/createMap`, {
        title: title,
        description: description,
        publicStatus:publicStatus,
        selectedCategory:selectedCategory,
        tags: tags,
        file: file,
        imageURL:imageURL
    })
}
const updateMapPage = (id, mappage) => {
    return api.put(`/map/updateMapPage/${id}/`, {
        mappage: mappage
    })
}
const updateMapPageGeneral = (id, mappage) => {
    return api.put(`/map/updateMapPageGeneral/${id}/`, {
        mappage: mappage
    })
}
export const getMapPagePairs = () => api.get(`/map/mappagepairs/`)
export const getPublicMapPagePairs = () => api.get(`/map/publicMapPagePairs/`)
export const getMapPage = () => api.get(`/map/mappages/`)
export const getMapPageById = (id) => api.get(`/map/mappage/${id}/`)
const apis = {
    createMap,
    updateMapPage,
    updateMapPageGeneral,
    getMapPagePairs,
    getMapPage,
    getMapPageById,
    getPublicMapPagePairs
}

export default apis