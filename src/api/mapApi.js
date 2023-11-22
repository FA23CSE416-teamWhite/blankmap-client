import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: 'https://blankmap-server-6de6d45e4291.herokuapp.com/api'
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