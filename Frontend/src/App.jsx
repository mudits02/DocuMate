import { Outlet, useLocation } from 'react-router-dom';
import './App.css'
import Header from './Header';
import Sidebar from './Sidebar';

const App = () => {
  const location = useLocation();
  const isAuthPage = 
  location.pathname === "/login" || 
  location.pathname === "/" || 
  location.pathname === "/auth/callback";

  if(isAuthPage)
  {
    return (
      <div className="App min-h-screen bg-[#0d1321]">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-[#0d1321] text-[#dde2f6]">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex-1 min-w-0 flex flex-col">
          <Header />
          <main className="flex-1 px-6 py-6 md:px-8 xl:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
