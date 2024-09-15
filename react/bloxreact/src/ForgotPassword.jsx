import React, { useState } from 'react';
import axios from 'axios';
import './Form.css';
import logo from './assets/images/logo.png';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const sendResetLink = async () => {
        try {
            const response = await axios.post('https://bloxflask.bloxmurah.com/forgot-password', { email });
            setMessage(response.data.msg);
            setError('');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.msg) {
                setError(error.response.data.msg);
            } else {
                setError('Failed to send reset link. Please try again.');
            }
            setMessage('');
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
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
            </div>
            <div className="footer-links">
                <a href="/signup">Sign Up</a>
                <span> | </span>
                <a href="/login">Log In</a>
            </div>
        </div>
    );
};

export default ForgotPassword;
