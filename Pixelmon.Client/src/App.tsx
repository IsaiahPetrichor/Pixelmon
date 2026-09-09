import './App.css';
import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Regions from './pages/Regions/Regions';
import Admin from './pages/Admin/Admin';
import Login from './pages/Login/Login';
import { useEffect, useState } from 'react';
import { IconContext } from 'react-icons';

const apiBaseUrl = 'http://localhost:5172';
const adminTokenStorageKey = 'adminToken';

export type AuthUser = {
  userId: number;
  username: string;
  permissionLevel: number;
};

function App() {
  return (
    <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
      <AuthenticatedApp />
    </IconContext.Provider>
  );
}

function AuthenticatedApp() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(() => Boolean(sessionStorage.getItem(adminTokenStorageKey)));

  useEffect(() => {
    const token = sessionStorage.getItem(adminTokenStorageKey);
    if (!token) return;

    fetch(`${apiBaseUrl}/AdminAuth/validate`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        if (!response.ok) throw new Error('Invalid session');

        const result: { user: AuthUser } = await response.json();
        setAuthUser(result.user);
      })
      .catch(() => {
        sessionStorage.removeItem(adminTokenStorageKey);
        setAuthUser(null);
      })
      .finally(() => setIsCheckingAuth(false));
  }, []);

  function handleSignOut() {
    sessionStorage.removeItem(adminTokenStorageKey);
    setAuthUser(null);
    navigate('/');
  }

  const canAccessAdmin = authUser !== null && authUser.permissionLevel <= 3;

  return (
    <>
      <header>
        <h1>Pixelmon</h1>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/regions">Region Progress</Link>
            </li>
            <li>
              {isCheckingAuth ? null : canAccessAdmin ? (
                <Link to="/admin">Admin</Link>
              ) : authUser ? (
                <button className="nav-button" type="button" onClick={handleSignOut}>
                  Sign Out
                </button>
              ) : (
                <Link to="/login">Login</Link>
              )}
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/regions" element={<Regions />} />
          <Route path="/login" element={<Login onAuthenticated={setAuthUser} />} />
          <Route
            path="/admin"
            element={isCheckingAuth ? <p>Checking access...</p> : canAccessAdmin ? <Admin /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </main>
      <footer>
        <p>Contact us on Discord: uhhh, add link to a discord here</p>
      </footer>
    </>
  );
}

export default App;
