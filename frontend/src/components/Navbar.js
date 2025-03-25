import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import "../styles/Navbar.css";

const Navbar = () => {
    const { darkMode } = useTheme();

    return (
        <nav className={`navbar ${darkMode ? 'dark' : ''}`}>
            <div className="nav-brand">
                <Link to="/">Contest Tracker</Link>
            </div>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/bookmarks">Bookmarks</Link>
                <a href="https://codeforces.com" target="_blank" rel="noopener noreferrer">Codeforces</a>
                <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer">LeetCode</a>
                <a href="https://codechef.com" target="_blank" rel="noopener noreferrer">CodeChef</a>
            </div>
            <ThemeToggle />
        </nav>
    );
};

export default Navbar; 