import './App.css';
import { Route, Routes } from 'react-router';
import Home from './pages/Home/Home';
import Regions from './pages/Regions/Regions';
import Admin from './pages/Admin/Admin';
import { IconContext } from 'react-icons';

function App() {
  return (
    <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
      <header>
        <h1>Pixelmon</h1>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/regions">Region Progress</a>
            </li>
            <li>
              <a href="/admin">Admin</a>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/regions" element={<Regions />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <footer>
        <p>Contact us on Discord: uhhh, add link to a discord here</p>
      </footer>
    </IconContext.Provider>
  );
}

export default App;
