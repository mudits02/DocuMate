import { Outlet, useLocation } from 'react-router-dom';
import './App.css'
import Header from './Header';

const App = () => {
  const location = useLocation();
  const hideHeader = location.pathname === "/login" || location.pathname === "/" || location.pathname === "/auth/callback";

  return(
    <div className='App min-h-screen bg-[#0d1321]'>
      {!hideHeader && <Header />}
      <Outlet />
    </div>
  )
}

export default App;
