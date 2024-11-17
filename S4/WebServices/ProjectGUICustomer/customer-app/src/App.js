
import { useState } from 'react';
import './App.css';
import { MenuPage } from './UI/MenuPage';
import { Orders } from './UI/Orders';

function App() {
  const [showOrderPage, setShowOrderPage] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Welcome to your Online Food Delivery Platform
        </p>
      </header>
      <div>
        <button onClick={() => {setShowOrderPage(state => !state)}}>{showOrderPage ? "Close" : "Show"} Orders</button>
      </div>
      {showOrderPage ? <Orders /> : null}
      <MenuPage />
    </div>
  );
}

export default App;
