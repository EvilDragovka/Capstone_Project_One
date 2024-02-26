import React from 'react';
import FullScreenSearch from './fullscreenSearch';

interface TopBarProps {
  onMenuClick: () => void; // Add onMenuClick prop
  onSearchClick: () => void; // Add onSearchClick prop
}

// TODO: 
//  - Replace placeholder text with actual logo
const TopBar: React.FC<TopBarProps> = ({onMenuClick, onSearchClick}) => {
    return (
      <nav>
        <div>
          <button id="menu-btn" onClick={onMenuClick}>
            <i className="fi fi-rr-menu-burger"></i>
          </button>
          <p id="logo">LEARNIX</p>
          <button id="search-btn" onClick={onSearchClick}>
            <i className="fi fi-br-search"></i>
          </button>
        </div>
      </nav>
    );
  }

  export default TopBar;