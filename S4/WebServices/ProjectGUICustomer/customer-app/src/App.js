

import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router';
import { MenuPage } from './UI/MenuPage';
import { ManageMenus } from './UI/ManageMenus';
import { AuthPage } from './UI/AuthPage';
import { AuthContext } from './Context/AuthContext';
import { Orders } from './UI/Orders';

function App() {

  const header = (
    <div className="App">
      <header className="App-header">
        <p>
          Welcome to your Online Food Delivery Platform
        </p>
      </header>
    </div>
  )

  return (
      <AuthContext>
        <BrowserRouter>
          {header}
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/ViewMenus" element={<MenuPage />} />
            <Route path="/ManageMenus" element={<ManageMenus />} />
            <Route path="/ViewOrders" element={<Orders />} />
          </Routes>
        </BrowserRouter>
      </AuthContext>
  );
}

export default App;
