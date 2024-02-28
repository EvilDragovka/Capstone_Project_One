// MainPage.tsx
import React, { useState } from 'react';
import { currentSearchQuery, searchHistory } from './_app';

function MainPage() {
    // Your component logic goes here

    var hasSearchHistory: boolean = searchHistory.length > 0;
    return (
        <div className="main-page">
            <div className="main-welcome">
                <p id="main-greeting">Welcome!</p>
                {!hasSearchHistory && <p id="main-sub-greeting">Make the first step!</p>}
                {hasSearchHistory && <p id="main-sub-greeting">Keep at it!</p>}
            </div>
        </div>
    );
}

export default MainPage;
