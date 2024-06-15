import axios from 'axios';

const appApi = axios.create({
    baseURL: 'https://quiz-lab-server.onrender.com/api',
});

export default appApi;
