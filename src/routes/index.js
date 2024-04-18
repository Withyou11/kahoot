import Home from '~/pages/Home/Home';
import CreateQuestions from '~/pages/CreateQuestions/CreateQuestions';

// Public routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/create-questions', component: CreateQuestions },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
