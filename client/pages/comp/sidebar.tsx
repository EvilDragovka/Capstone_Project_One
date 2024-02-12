import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// TODO: Make the search query buttons into components
const SideBar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
        <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="top-btns">
                <button className="close-btn" onClick={onClose}>
                    Close
                </button>
                <button>Search Query #1</button>
                <button>Search Query #2</button>
                <button>Search Query #3</button>
                <button>Search Query #4</button>
                <button>Search Query #5</button>
                {/* Search queries go here */}
            </div>
            <div className="bottom-btns">
                <button>Logout</button>
                <button>Home</button>
            </div>
        </div>
    </>
  );
};

export default SideBar;