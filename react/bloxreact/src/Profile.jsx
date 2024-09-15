import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css'; 
import 'remixicon/fonts/remixicon.css'; 
import './profile.css';

const Profile = ({ token, refreshToken, saveTokens, clearTokens }) => {
    const [profile, setProfile] = useState({});
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); 

    const fetchProfile = async () => {
        try {
            const profileResponse = await axios.get('http://127.0.0.1:5000/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Cache-Control': 'no-cache'
                }
            });
            setProfile(profileResponse.data.user_profile);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                try {
                    const refreshResponse = await axios.post('http://127.0.0.1:5000/refresh', {}, {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`
                        }
                    });
                    saveTokens(refreshResponse.data.access_token, refreshResponse.data.refresh_token);
                    fetchProfile(); 
                } catch (refreshError) {
                    clearTokens();
                    setMessage('Session expired, please login again');
                    navigate('/login');
                }
            } else {
                setMessage('Failed to fetch profile');
            }
        }
    };
    
    useEffect(() => {
        if (token) {
            setProfile({});
            fetchProfile();
        }
    }, [token]);

    const handleLogout = () => {
        navigate('/logout'); 
    };

    const handleCS = () => {
        navigate(`/customer-service`);
    };

    const handleOrderHistoryRedirect = (category) => {
        navigate(`/orders/${category}`);
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-info">
                    <div className="avatar">
                        <i className="ri-user-fill"></i>
                    </div>
                    <div className="profile-details">
                        <p>{profile.username}</p>
                        <p>{profile.email}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="logout-button">
                    <i className="ri-logout-box-r-line"></i>
                </button>
            </div>
            {message && <p className="error-message">{message}</p>}

            <div className="order-history">
                <div className="order-categories">
                    <div onClick={() => handleOrderHistoryRedirect('menunggu_pembayaran')}>
                        <i className="ri-wallet-line"></i>
                        Menunggu Pembayaran
                    </div>
                    <div onClick={() => handleOrderHistoryRedirect('menunggu_dikirim')}>
                        <i className="ri-truck-line"></i>
                        Menunggu Dikirim
                    </div>
                    <div onClick={() => handleOrderHistoryRedirect('selesai')}>
                        <i className="ri-check-line"></i>
                        Selesai
                    </div>
                </div>
            </div>

            {/* Customer Service Section */}
            <div onClick={handleCS} className="help-section">
                <i className="ri-customer-service-fill"></i>
                <span>Kendala Pesanan</span>
            </div>
        </div>
    );
};

export default Profile;
