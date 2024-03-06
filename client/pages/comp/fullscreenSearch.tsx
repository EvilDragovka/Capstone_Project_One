'use client'
import React, { useState } from 'react';

interface FullScreenSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (x: string) => void;
}

// TODO: Implement search functionality
const FullScreenSearch: React.FC<FullScreenSearchProps> = ({ isOpen, onClose, onSearch }) => {
    const [textareaValue, setTextareaValue] = useState('');

    const handleTextareaChange = (event: any) => {
        if (event.target.value.length < 2000) {
            setTextareaValue(event.target.value);
        }
    };

    const handleSearch = () => {
        if (textareaValue === '') return;   // TODO: Pop an error message
        onSearch(textareaValue);
        setTextareaValue('');
    }

    const handleClose = () => {
        setTextareaValue('');
        onClose();
    }

    return (
        <div className={`full-screen-search ${isOpen ? 'open' : ''}`}>
            <div className="search-topbar">
                <button id="close-btn" onClick={handleClose}>
                    <i className="fi fi-br-cross"></i>
                </button>
                <button id="search-btn" onClick={handleSearch}>
                    <i className="fi fi-br-search"></i>
                </button>
            </div>
            <textarea 
            value={textareaValue}
            onChange={handleTextareaChange}
            placeholder="Search..." />
        </div>
    );
};

export default FullScreenSearch;