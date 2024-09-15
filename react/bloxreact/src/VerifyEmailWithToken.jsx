import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './VerifyEmail.css';

const VerifyEmailWithToken = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('Verifying your email...');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/verify_email/${token}`);
                toast.success(response.data.msg);
                setMessage(response.data.msg);
                setLoading(false);
                setTimeout(() => navigate('/login'), 2000);
            } catch (error) {
                if (error.response && error.response.data) {
                    toast.error(error.response.data.msg);
                    setMessage(error.response.data.msg);
                } else {
                    toast.error('An error occurred.');
                    setMessage('An error occurred.');
                }
                setLoading(false);
            }
        };

        verifyEmail();
    }, [token, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="verify-email">
            <h1>{message}</h1>
            <ToastContainer />
        </div>
    );
};

export default VerifyEmailWithToken;
