import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = ({ clearTokens }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const logoutUser = async () => {
            try {
                await axios.post('http://127.0.0.1:5000/logout', null, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                clearTokens(); 
                navigate('/login');
            } catch (error) {
                console.error('Logout failed:', error);
            }
        };

        logoutUser();
    }, [navigate, clearTokens]);

    return (
        <div>Logging out...</div>
    );
};

export default Logout;
