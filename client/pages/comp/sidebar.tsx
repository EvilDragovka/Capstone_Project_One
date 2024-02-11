import React from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideBar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={onClose}>
        Close
      </button>
      {/* Sidebar content goes here */}
    </div>
  );
};

export default SideBar;