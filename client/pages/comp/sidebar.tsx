'use client'
import React from 'react';
import { searchHistory } from '../_app';
// Defining the props for the SideBar component.
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onQueryClick: (x: number) => void;
  onLogoutClick: () => void;
  onHomeClick: () => void;
}

// Functional component for Sidebar
const SideBar: React.FC<SidebarProps> = ({ isOpen, onClose, onQueryClick, onHomeClick, onLogoutClick }) => {
    // This is so the buttons is sorted from up to down, latest to oldest
    var history = searchHistory.slice().reverse();
    var historyInd: number[] = [];
    history.forEach((query, index) => {
        historyInd.push(index);
    });
    historyInd = historyInd.slice().reverse();

    // Set each button to a number. That number indexes the search history.
    var dom: JSX.Element[] = [];
    history.forEach((query, index) => {
        dom.push(<button className="search-query-btn" key={historyInd[index]} onClick={() => onQueryClick(historyInd[index])}><i className="fi fi-br-search"></i><text>{query.prompt}</text></button>);
    });
    //Render sidebar UI
    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="top-btns">
                    <button className="close-btn" onClick={onClose}>
                        <i className="fi fi-rr-menu-burger"></i><text>LEARNIX</text>
                    </button>
                    {dom}
                </div>
                <div className="bottom-btns">
                    <button onClick={onLogoutClick}><i className="fi fi-rr-exit"></i><text>Logout</text></button>
                    <button onClick={onHomeClick}><i className="fi fi-rr-home"></i><text>Home</text></button>
                </div>
            </div>
        </>
    );
};
// Export the SideBar component.
export default SideBar;