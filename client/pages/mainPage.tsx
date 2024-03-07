// MainPage.tsx
import React, { useState } from 'react';
import { currentSearchQuery, searchHistory } from './_app';
// The MainPage component.
function MainPage() {
    
    // Check if there is any search history
    var hasSearchHistory: boolean = searchHistory.length > 0;
    return (
        <div className="main-page">
            <div className="main-welcome">
                <p id="main-greeting">Welcome!</p>
                {/* {!hasSearchHistory && <p id="main-sub-greeting">Make the first step!</p>}
                {hasSearchHistory && <p id="main-sub-greeting">Keep at it!</p>} */}
            </div>
        </div>
    );
}
// Export the MainPage component.
export default MainPage;
