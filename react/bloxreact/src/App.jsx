import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Profile from './Profile';
import LandingPage from './Pages/LandingPage/landingpage';
import GamePage from './Pages/GamePage/gamepage';
import PaymentPage from './Pages/PaymentPage/payment'; 
import Signup from './SignUp';
import VerifyEmail from './VerifyEmail';
import NotFound from './Pages/404Page/404';
import ForgotPassword from './ForgotPassword';
import Logout from './Logout';
import ResetPassword from './ResetPassword';
import GameList from './Pages/GameListPage/gamelist';
import Layout from './components/layout';
import AdminPage from './Pages/AdminPage/adminpage';  
import CustomerService from './Pages/CustomerService/customerservice';
import TermsConditions from './Pages/PoliciesPage/TermsConditions';
import PrivacyPolicy from './Pages/PoliciesPage/PrivacyPolicy';
import OrderHistory from './Pages/OrderHistory/orderhistory';
import PromoPage from './Pages/PromoPage/promo';
import PromoList from './Pages/PromoPage/promolist';
import axios from 'axios';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || '');
    const [username, setUsername] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);  
    const [loading, setLoading] = useState(true); 

    const saveTokens = (accessToken, refreshToken) => {
        setToken(accessToken);
        setRefreshToken(refreshToken);
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    };

    const clearTokens = () => {
        setToken('');
        setRefreshToken('');
        setUsername('');
        setIsAdmin(false);
        setLoading(false);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    };

    const fetchProfile = async () => {
        if (token) {
            try {
                const response = await axios.get('http://127.0.0.1:5000/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                        'Cache-Control': 'no-cache' 
                    }
                });
                setUsername(response.data.user_profile.username);
                setIsAdmin(response.data.user_profile.is_admin); 
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                clearTokens(); 
            } finally {
                setLoading(false); 
            }
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [token]);

    if (loading) {
        return <div>Loading...</div>; 
    }

    return (
        <Router>
            <Layout username={username} token={token}>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login saveTokens={saveTokens} />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
                    <Route 
                        path="/profile" 
                        element={token ? 
                            <Profile 
                                token={token} 
                                refreshToken={refreshToken} 
                                saveTokens={saveTokens} 
                                clearTokens={clearTokens} 
                            /> 
                            : <Navigate to="/login" />} 
                    />
                    <Route path="/game/:gameName" element={token ? <GamePage token={token} username={username} /> : <Navigate to="/login" />} />
                    <Route path="/payment/:orderId" element={token ? <PaymentPage token={token} /> : <Navigate to="/login" />} />
                    <Route path="/orders/menunggu_pembayaran" element={<OrderHistory category="menunggu_pembayaran" />} />
                    <Route path="/orders/menunggu_dikirim" element={<OrderHistory category="menunggu_dikirim" />} />
                    <Route path="/orders/selesai" element={<OrderHistory category="selesai" />} />
                    <Route path="/admin" element={token && isAdmin ? <AdminPage /> : <Navigate to="/profile" />} />
                    <Route path="/gamelist" element={<GameList />} />
                    <Route path="/terms" element={<TermsConditions />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/customer-service" element={<CustomerService />} />
                    <Route path="/promo" element={<PromoList />} />
                    <Route path="/promo/:id" element={<PromoPage />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/logout" element={token ? <Logout clearTokens={clearTokens} /> : <Navigate to="/login" />} />
                    <Route path="*" element={<NotFound />} /> 
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;

