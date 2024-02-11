import React from 'react';

interface TopBarProps {
  onMenuClick: () => void; // Add onMenuClick prop
}

const TopBar: React.FC<TopBarProps> = ({onMenuClick}) => {
    return (
      <nav>
        <div>
          <button className="menu-btn" onClick={onMenuClick}>Menu</button>
          <input type="text" placeholder="Search..." />
        </div>
      </nav>
    );
  }

  export default TopBar;