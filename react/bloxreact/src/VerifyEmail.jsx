import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './VerifyEmail.css';

const VerifyEmail = () => {
    return (
        <div className="verify-email-container">
            <div className="verify-box">
                <ToastContainer />
                <h1>Email Verification Required</h1>
                <p>Please check your email to verify your account. Once verified, you can log in.</p>
        </div>
        </div>
    );
};

export default VerifyEmail;
