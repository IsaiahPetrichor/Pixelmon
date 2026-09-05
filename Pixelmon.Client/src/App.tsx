import './App.css';
import Home from './components/home/Home';
import { Route, Routes } from 'react-router';
import Regions from './components/regions/Regions';

function App() {
  return (
    <>
      <nav>
        <a href="/">Home</a> | <a href="/regions">Regions</a>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/regions" element={<Regions />} />
      </Routes>
    </>
  );
}

export default App;
