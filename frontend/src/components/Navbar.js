import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const isLoggedIn = !!localStorage.getItem('token');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.brand}>
                <Link to="/" style={styles.link}>NohPT</Link>
            </div>
            <div style={styles.links}>
                {isLoggedIn && (
                    <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
                )}
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(to right, #0A1128, #001F54, #033563)',
        color: 'white',
        padding: '10px 20px',
    },
    brand: {
        fontSize: '30px',
    },
    links: {
        display: 'flex',
    },
    link: {
        color: 'white',
        textDecoration: 'none',
        marginLeft: '20px',
    },
    logoutButton: {
        background: 'none',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        marginLeft: '20px',
        fontSize: 'inherit',
    }
};

export default Navbar;
