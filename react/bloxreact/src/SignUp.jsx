import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Form.css';
import logo from './assets/images/logo.png';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const navigate = useNavigate();

    const emailSchema = Yup.string().email('Invalid email address').required('Email is required');

    const signUp = async () => {
        try {
            const normalizedEmail = email.toLowerCase();
            const normalizedUsername = username.toLowerCase();

            await emailSchema.validate(normalizedEmail);

            if (password !== confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }

            if (!termsAccepted) {
                toast.error("You must agree to the terms and privacy policy");
                return;
            }

            const response = await axios.post('http://127.0.0.1:5000/signup', {
                email: normalizedEmail,
                username: normalizedUsername,
                password
            });

            toast.success(response.data.msg);
            setTimeout(() => {
                navigate('/verify-email'); 
            }, 500);  

        } catch (error) {
            if (error.response && error.response.data && error.response.data.msg) {
                toast.error(error.response.data.msg);
            } else if (error.name === 'ValidationError') {
                toast.error(error.message);
            } else {
                toast.error('Signup failed');
            }
        }
    };
    
    
    return (
        <div className="signup-container">
            <ToastContainer />
            <div>
                <img src={logo} alt="Logo" className="logo" />
                <h1>Hi Bloxer!</h1>
                <h2>Welcome</h2>
                <p>Let's create an account</p>
            </div>
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <div className="terms">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={termsAccepted}
                        onChange={() => setTermsAccepted(!termsAccepted)}
                    />
                    <label htmlFor="terms">
                        <small>I have agreed to the <a href="/terms">Terms </a>and <a href="/privacy">Privacy Policy</a></small>
                    
                        
                    </label>
                </div>
                <button onClick={signUp}>Sign Up</button>
            </div>
            <div className="footer-links">
                <span>Already Have a account? |</span>
                <a href="/login">Log In</a>
            </div>
        </div>
    );
};

export default SignUp;
