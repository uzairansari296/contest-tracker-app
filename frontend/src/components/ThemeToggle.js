import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/ThemeToggle.css';

const ThemeToggle = () => {
    const { darkMode, toggleTheme } = useTheme();

    return (
        <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
            {darkMode ? <FaSun /> : <FaMoon />}
        </button>
    );
};

export default ThemeToggle; 