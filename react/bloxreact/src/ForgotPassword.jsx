import React, { useState } from 'react';
import axios from 'axios';
import './Form.css';
import logo from './assets/images/logo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const sendResetLink = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/forgot-password', { email });
            toast.success(response.data.msg);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.msg) {
                toast.error(error.response.data.msg);
            } else {
                toast.error('Failed to send reset link. Please try again.');
            }
        }
    };

    return (
        <div className="form-container">
            <div>
                <img src={logo} alt="Logo" className="logo" />
                <h1>Upss!</h1>
                <h2>I forgot</h2>
                <p>Enter your email so that we could send you a link to alternate your password</p>
            </div>
            <div>
                <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button onClick={sendResetLink}>Send</button>
            </div>
            <div className="footer-links">
                <a href="/signup">Sign Up</a>
                <span> | </span>
                <a href="/login">Log In</a>
            </div>
            <ToastContainer />
        </div>
    );
};

export default ForgotPassword;
