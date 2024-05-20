import Home from '~/pages/Home/Home';
import CreateQuestions from '~/pages/CreateQuestions/CreateQuestions';
import ManageQuestions from '~/pages/ManageQuestions/ManageQuestions';
import CreateRoom from '~/pages/CreateRoom/CreateRoom';
import SignIn from '~/pages/Authentication/SignIn/SignIn';
import SignUp from '~/pages/Authentication/SignUp/SignUp';

// Public routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/create-quiz', component: CreateQuestions },
    { path: '/edit-quiz/:id', component: CreateQuestions },
    { path: '/manage-quizzes', component: ManageQuestions },
    { path: '/create-room', component: CreateRoom },
    { path: '/sign-in', component: SignIn },
    { path: '/sign-up', component: SignUp },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
