import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Form.css';
import logo from './assets/images/logo.png';

const Login = ({ saveTokens }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const login = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/login', { username, password });
            saveTokens(response.data.access_token, response.data.refresh_token);
            toast.success("Login successful");
            const profileResponse = await axios.get('http://127.0.0.1:5000/profile', {
                headers: {
                    Authorization: `Bearer ${response.data.access_token}`
                }
            });

            const isAdmin = profileResponse.data.user_profile.is_admin;
            setTimeout(() => {
                if (isAdmin) {
                    navigate('/admin'); 
                } else {
                    navigate('/');  
                }
            }, 1000);
        } catch (error) {
            setMessage('Login failed');
            toast.error('Login failed');
        }
    };
    

    return (
        <div className="form-container">
            <ToastContainer />
            <div>
                <img src={logo} alt="Logo" className="logo" />
                <h1>Hi Bloxer!</h1>
                <h2>Welcome</h2>
                <p>Please enter your authentication before looking for gorgeous items!</p>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button onClick={login}>Log In</button>
                <p>{message}</p>
            </div>
            <div className="footer-links">
                <a href="/forgot-password">Forgot Password?</a>
                <span> | </span>
                <a href="/signup">Sign Up</a>
            </div>
        </div>
    );
};

export default Login;
