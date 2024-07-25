import React, { useEffect } from 'react'
import './Navbar.css'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../Features/authReducer';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const dispatch = useDispatch()
    const location = useLocation()

    const name = JSON.parse(localStorage.getItem('profile')).fullname

    
    const handleLogout = () => {
        localStorage.removeItem('ACCESS_TOKEN')
        localStorage.removeItem('REFRESH_TOKEN')
        dispatch(logout())
    }

    let welcomeMessage = 'Welcome to Home!';
    if (location.pathname === '/profile') {
        welcomeMessage = 'Profile';
    } else if (location.pathname === '/adminpanel') {
        welcomeMessage = 'Admin panel'
    }

  return (
    <div>
        <nav className="navbar">
        {location.pathname === '/adminpanel' && (
            <span className="navbar-brand">
                {name}
            </span>
        )}
        {location.pathname !== '/profile' && location.pathname !== '/adminpanel' && (
            <Link to="/profile" className="navbar-brand">
                {name}
            </Link>
        )}
        {location.pathname !== '/' && location.pathname !== '/adminpanel' && (
            <Link to="/" className="navbar-brand">
                Home
            </Link>
        )}
        <h2>{welcomeMessage}</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </nav>
    </div>
  )
}

export default Navbar
