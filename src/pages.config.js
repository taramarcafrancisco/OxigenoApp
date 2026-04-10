import AdminDashboard from './pages/AdminDashboard';
import ClientDetail from './pages/ClientDetail';
import Clients from './pages/Clients';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Landing from './pages/Landing';
import ManagePlans from './pages/ManagePlans';
import MyPlan from './pages/MyPlan';

import Planes from './pages/Planes.jsx';

import Reports from './pages/Reports';
import Usage from './pages/Usage';
 
import __Layout from './Layout.jsx';


export const PAGES = {
    "AdminDashboard": AdminDashboard,
    "ClientDetail": ClientDetail,
    "Clients": Clients,
    "Dashboard": Dashboard,
    "History": History,
    "Landing": Landing,
    "ManagePlans": ManagePlans,
    "MyPlan": MyPlan,
    "Planes": Planes,
    "Reports": Reports,
    "Usage": Usage,
 
}

export const pagesConfig = {
    mainPage: "Landing",
    Pages: PAGES,
    Layout: __Layout,
};