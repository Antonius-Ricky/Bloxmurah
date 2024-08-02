import { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = ({ token, refreshToken, saveTokens, clearTokens }) => {
    const [profile, setProfile] = useState({});
    const [message, setMessage] = useState('');

    const fetchProfile = async () => {
        try {
            const response = await axios.get('https://miaw.bloxmurah.com/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProfile(response.data.user_profile);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                try {
                    const refreshResponse = await axios.post('https://miaw.bloxmurah.com/refresh', {}, {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`
                        }
                    });
                    saveTokens(refreshResponse.data.access_token, refreshToken);
                    fetchProfile();
                } catch (refreshError) {
                    clearTokens();
                    setMessage('Session expired, please login again');
                }
            } else {
                setMessage('Failed to fetch profile');
            }
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleLogout = () =>{
        clearTokens();
        Navigate('/login');
    }; 
    
    return (
        <div>
            <h1>Profile</h1>
            {profile.name ? (
                <div>
                    <p>Name: {profile.name}</p>
                    <p>Email: {profile.email}</p>
                </div>
            ) : (
                <p>{message}</p>
            )}
            <button onClick={handleLogout}>Log Out</button>
            <p>{message}</p>
        </div>
    );
};

export default Profile;
