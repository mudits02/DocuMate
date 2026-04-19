import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Auth from './Components/Auth/Auth.jsx'
import Dashboard from "./Components/Dashboard/Dashboard.jsx";
import Body from "./Body.jsx";
import AuthCallback from "./Components/Auth/AuthCallback.jsx";


export const routes = createBrowserRouter([{
    path: '/',
    element: <App />,
    children: [
        {
            index:true,
            element: <Auth />
        },
        {
            path: '/login',
            element: <Auth />
        },
        {
            path: '/dashboard',
            element: <Dashboard />
        },
        {
            path: '/auth/callback',
            element: <AuthCallback />
        }
    ]
}])