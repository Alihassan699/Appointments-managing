// src/components/Header.js
import React from 'react';
import '../styles/Header.css';

const Header = ({ onSearch }) => {
    return (
        <div className="header">
            <h1>Categories</h1>
            <div className="header-actions">
                <button className="add-button">+ Add Categories</button>
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Search" 
                        className="search-input" 
                        onChange={(e) => onSearch(e.target.value)}
                    />
                    <span className="search-icon">&#128269;</span>
                </div>
            </div>
        </div>
    );
};

export default Header;
