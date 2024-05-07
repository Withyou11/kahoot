import Home from '~/pages/Home/Home';
import CreateQuestions from '~/pages/CreateQuestions/CreateQuestions';
import SignIn from '~/pages/Authentication/SignIn/SignIn';
import SignUp from '~/pages/Authentication/SignUp/SignUp';

// Public routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/sign-in', component: SignIn },
    { path: '/sign-up', component: SignUp },
    { path: '/create-questions', component: CreateQuestions },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
