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
                <button onClick={onClose}>Close</button>
                <button id="search-btn">Search</button>
            </div>
            <textarea placeholder="Search..." />
        </div>
    );
};

export default FullScreenSearch;