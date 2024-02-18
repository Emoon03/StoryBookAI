import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/nohpt/users/register', {
                username,
                password,
                email,
            });

            const token = response.data.token;
            localStorage.setItem('token', token);

            navigate('/');
        } catch (error) {
            console.error(error);
            // Handle registration error 
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.heading}>Register</h2>

                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Username"
                    style={styles.input}
                />
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    style={styles.input}
                />
                <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                    style={styles.input}
                />
                <button type="submit" style={styles.button}>Continue</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to right, #0A1128, #001F54, #033563)',
        minHeight: 'calc(100vh - 30px)'
    },
    form: {
        padding: '20px',
        borderRadius: '5px',
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    heading: {
        marginBottom: '20px',
        color: '#001F54',
    },
    input: {
        margin: '10px 0',
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        width: '200px',
    },
    button: {
        background: 'white',
        color: '#033563',
        padding: '10px 15px',
        border: '1px solid #033563',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px',
    }
};

export default Registration;
