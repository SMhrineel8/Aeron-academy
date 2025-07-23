// src/components/HamburgerMenu.jsx
import React, { useState } from 'react';

function HamburgerMenu({ onNavLinkClick }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleClick = (page) => {
        onNavLinkClick(page);
        setIsOpen(false); // Close menu after clicking
    };

    return (
        <nav className="navbar">
            <div className="logo">Learnly <span className="pro">Pro</span></div>
            <div className="hamburger-menu" onClick={handleToggle}>
                <i className="fas fa-bars"></i>
            </div>
            <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
                <li><a href="#" onClick={() => handleClick('courses')}>Courses</a></li>
                <li><a href="#" onClick={() => handleClick('book-to-game')}>Book to Game</a></li>
                <li><a href="#" onClick={() => handleClick('fun-quiz')}>Fun Quiz</a></li>
            </ul>
            <div className="search-bar">
                <input type="text" placeholder="Enter any skill (e.g., React, Python, Digital Marketing, Data Science)..." />
                <button>Ready to help!</button>
            </div>
            <div className="user-icons">
                <i className="fas fa-bell"></i>
                <i className="fas fa-user-circle"></i>
            </div>
        </nav>
    );
}

export default HamburgerMenu;
