import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Auth from './Components/Auth/Auth.jsx'
import Dashboard from "./Components/Dashboard/Dashboard.jsx";
import AuthCallback from "./Components/Auth/AuthCallback.jsx";
import GuestRoute from "./Components/routes/GuestRoute.jsx";
import ProtectedRoute from "./Components/routes/ProtectedRoute.jsx";


export const routes = createBrowserRouter([{
    path: '/',
    element: <App />,
    children: [
        {
            index:true,
            element: <GuestRoute><Auth /></GuestRoute>
        },
        {
            path: '/login',
            element: <GuestRoute><Auth /></GuestRoute>
        },
        {
            path: '/dashboard',
            element: <ProtectedRoute><Dashboard /></ProtectedRoute>
        },
        {
            path: '/auth/callback',
            element: <AuthCallback />
        }
    ]
}])
