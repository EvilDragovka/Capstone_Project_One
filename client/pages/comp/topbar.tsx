'use client'
import React from 'react';
import FullScreenSearch from './fullscreenSearch';

interface TopBarProps {
  showButtons: boolean;
  onMenuClick: () => void; // Add onMenuClick prop
  onSearchClick: () => void; // Add onSearchClick prop
}

// TODO: 
//  - Replace placeholder text with actual logo
const TopBar: React.FC<TopBarProps> = ({showButtons, onMenuClick, onSearchClick}) => {
    return (
      <nav>
        <div>
          {showButtons && <button id="menu-btn" onClick={onMenuClick}>
            <i className="fi fi-rr-menu-burger"></i>
          </button>}
          {!showButtons && <div></div>}
          <p id="logo">LEARNIX</p>
          {showButtons && <button id="search-btn" onClick={onSearchClick}>
            <i className="fi fi-br-search"></i>
          </button>}
          {!showButtons && <div></div>}
        </div>
      </nav>
    );
  }

  export default TopBar;