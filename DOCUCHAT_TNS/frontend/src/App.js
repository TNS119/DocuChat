import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import HomePage from "./components/HomePage"
import Chatpage from "./components/Chatpage"
import LoginPage from "./components/Loginpage"
import RegisterPage from "./components/Registerpage"
import './App.css';
import { buildApiUrl, createAuthFetch } from './api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const authFetch = createAuthFetch(setIsAuthenticated, navigate);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const response = await fetch(buildApiUrl("/auth/me"), {
          credentials: "include"
        });
        setIsAuthenticated(response.ok);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  // Run ONLY on mount (empty deps [])
  // Previously [location.pathname] caused checkAuth to re-run on every navigate()
  // which would race with the Set-Cookie header and reset isAuthenticated to false,
  // bouncing the user back to /login right after a successful login.
  // Session restore from cookie only needs to happen once when the app loads.
  // After that, isAuthenticated state is managed in memory + authFetch handles 401s.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="App" />;
  }

  return (
    <div className="App">
      <Routes>
        {/* LoginPage gets setIsAuthenticated to set auth directly after login (no race) */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />} />
        {/* HomePage and Chatpage get authFetch — any 401 auto-redirects to /login */}
        <Route path="/" element={isAuthenticated ? <HomePage authFetch={authFetch} /> : <Navigate to="/login" replace />} />
        <Route path="/chat" element={isAuthenticated ? <Chatpage authFetch={authFetch} /> : <Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
