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
                    <i className="fi fi-rr-menu-burger"></i>Close
                </button>
                <button><i className="fi fi-br-search"></i><text>Search Query #1</text></button>
                <button><i className="fi fi-br-search"></i><text>Search Query #2</text></button>
                <button><i className="fi fi-br-search"></i><text>Search Query #3</text></button>
                <button><i className="fi fi-br-search"></i><text>Search Query #4</text></button>
                <button><i className="fi fi-br-search"></i><text>Search Query #5</text></button>
                {/* Search queries go here */}
            </div>
            <div className="bottom-btns">
                <button><i className="fi fi-rr-exit"></i><text>Logout</text></button>
                <button><i className="fi fi-rr-home"></i><text>Home</text></button>
            </div>
        </div>
    </>
  );
};

export default SideBar;