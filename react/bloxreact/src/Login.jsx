import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ saveTokens }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const login = async () => {
        try {
            console.log('Logging in with:', username, password);  
            const response = await axios.post('https://miaw.bloxmurah/login', { username, password });
            console.log('Response:', response.data);  
            saveTokens(response.data.access_token, response.data.refresh_token);
            navigate('/profile');
        } catch (error) {
            console.error('Error:', error); 
            setMessage('Login failed');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            login();
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button onClick={login} >Login</button>
            <p>{message}</p>
        </div>
    );
};

export default Login;
