import './App.css';
import Home from './pages/Home/Home';
import { Route, Routes } from 'react-router';
import Regions from './pages/Regions/Regions';

function App() {
  return (
    <>
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
          </ul>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/regions" element={<Regions />} />
        </Routes>
      </main>
      <footer>
        <p>Contact us on Discord: uhhh, add link to a discord here</p>
      </footer>
    </>
  );
}

export default App;
