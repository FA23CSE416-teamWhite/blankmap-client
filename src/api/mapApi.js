import axios from 'axios'
import apiUrl from '../baseURL'
axios.defaults.withCredentials = true;
const api = axios.create({
    // baseURL: 'https://blankmap-server-6de6d45e4291.herokuapp.com/api/map'
    baseURL: apiUrl+'/api/map'
})

const fetchMaps = async (query) => {
    try {
        const response = await api.get(`/maps?q=${query}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching maps:', error);
        throw error;
    }
}

// const createMap = async (mapName, isPublic, description, tags, selectedCategory, selectedFile) => {
//     try {
//         const formData = new FormData();
//         formData.append('mapName', mapName);
//         formData.append('isPublic', isPublic);
//         formData.append('description', description);
//         formData.append('tags', JSON.stringify(tags));
//         formData.append('selectedCategory', selectedCategory);
//         formData.append('selectedFile', selectedFile); // Assuming selectedFile is a File object
  
//         const response = await axios.post('/api/createMap', formData);

//         console.log('Map created:', response.data);
//       } catch (error) {
//         console.error('Error creating map:', error);
//       }
// }

const fetchMap = async (mapId) => {
    try {
        const response = await api.get(`/map/${mapId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching map:', error);
        throw error;
    }
}

const updateMap = async (mapId, stringGeo, addedFeatures,savedImage) => {
    try {
        console.log('savedImage:', savedImage);
        const response = await api.put(`/mapData/${mapId}`, {
            stringGeo: stringGeo,
            addedFeatures: addedFeatures,
            savedImage:savedImage
        });
        return response.data;
    } catch (error) {
        console.error('Error updating map:', error);
        throw error;
    }
}; 



const mapApi = {
    fetchMaps,
    // createMap,
    fetchMap,
    updateMap
  };

export default mapApi;