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

const mapApi = {
    fetchMaps,
  };

export default mapApi;