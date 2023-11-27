import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'https://blankmap-server-6de6d45e4291.herokuapp.com/api/map'
    // baseURL: 'http://localhost:8000/api/map'
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

const createMap = async (mapName, isPublic, description, tags, selectedCategory, selectedFile) => {
    try {
        const formData = new FormData();
        formData.append('mapName', mapName);
        formData.append('isPublic', isPublic);
        formData.append('description', description);
        formData.append('tags', JSON.stringify(tags));
        formData.append('selectedCategory', selectedCategory);
        formData.append('selectedFile', selectedFile); // Assuming selectedFile is a File object
  
        const response = await axios.post('/api/createMap', formData);

        console.log('Map created:', response.data);
      } catch (error) {
        console.error('Error creating map:', error);
      }
}

const mapApi = {
    fetchMaps,
    createMap,
  };

export default mapApi;