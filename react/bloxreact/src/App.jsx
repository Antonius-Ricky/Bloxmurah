import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Profile from './Profile';
import LandingPage from './Pages/LandingPage/landingpage'

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || '');

    const saveTokens = (accessToken, refreshToken) => {
        setToken(accessToken);
        setRefreshToken(refreshToken);
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    };

    const clearTokens = () => {
        setToken('');
        setRefreshToken('');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    };

    return (
        <Router>
            <Routes>
                <Route path='/' element={<LandingPage />}>
                </Route>
                <Route path="/login" element={token ? 
                    (<Navigate to="/profile"/>) : 
                    (<Login saveTokens={saveTokens} />)} 
                />
                <Route path="/profile" element={token ? (
                        <Profile token={token} 
                                    refreshToken={refreshToken} 
                                    saveTokens={saveTokens} 
                                    clearTokens={clearTokens} />
                    ) : (
                        <Navigate to="/login" />
                    )} />
            </Routes>
        </Router>
    );
};

export default App;
