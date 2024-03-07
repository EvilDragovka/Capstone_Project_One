'use client'
import React, { useState } from 'react';
// Importing necessary libraries and hooks.
// Defining the props for the FullScreenSearch component.
interface FullScreenSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (x: string) => void;
}

//// FullScreenSearch component TODO: Implement search functionality.
const FullScreenSearch: React.FC<FullScreenSearchProps> = ({ isOpen, onClose, onSearch }) => {
    const [textareaValue, setTextareaValue] = useState('');
    // State for the value of the textarea.
    const handleTextareaChange = (event: any) => {
        if (event.target.value.length < 2000) {// Handler for changes in the textarea.
            setTextareaValue(event.target.value);
        }
    };
    // Handler for the search action
    const handleSearch = () => {// If the textarea is empty, return without performing the search.
        if (textareaValue === '') return;   // TODO: Pop an error message.
        onSearch(textareaValue);  // Perform the search and clear the textarea.
        setTextareaValue(''); 
    }
    // Handler for closing the search screen.
    const handleClose = () => {
        setTextareaValue('');
        onClose(); // Clear the textarea and close the search screen.
    }
    // Render the full-screen search component.
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
// Export the FullScreenSearch component.
export default FullScreenSearch;