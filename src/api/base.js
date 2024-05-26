import axios from 'axios';

const appApi = axios.create({
    baseURL: 'https://quiz-lab-server.onrender.com/api/quizzes',
});

export default appApi;
