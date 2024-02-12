import React from 'react';

interface FullScreenSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

// TODO: Implement search functionality
const FullScreenSearch: React.FC<FullScreenSearchProps> = ({ isOpen, onClose }) => {
    return (
        <div className={`full-screen-search ${isOpen ? 'open' : ''}`}>
            <div className="search-topbar">
                <button id="close-btn" onClick={onClose}>
                    <i className="fi fi-br-cross"></i>
                </button>
                <button id="search-btn">
                    <i className="fi fi-br-search"></i>
                </button>
            </div>
            <textarea placeholder="Search..." />
        </div>
    );
};

export default FullScreenSearch;