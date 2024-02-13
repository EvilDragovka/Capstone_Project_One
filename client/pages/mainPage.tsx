// MainPage.tsx
import React, { useState } from 'react';
import { getSearchHistory, getSearchPrompt, getSearchQuery, getSearchResult } from './_app';

function MainPage() {
    // Your component logic goes here
    // LOGIC:
    //   - If no search query was made, just display the welcome page
    //   - Else, 
    //      - If the app is currently waiting for the search results, display the prompt and the loading spinner below it
    //      - If the search results are ready, display the search results
    //      - If the app is loading an old search query, display a loading screen

    var hasSearchHistory: boolean = getSearchHistory().length > 0;
    return (
        <div className="main-page">
            <div className="main-welcome">
                <p id="main-greeting">Welcome!</p>
                {!hasSearchHistory && <p id="main-sub-greeting">Make the first step!</p>}
                {hasSearchHistory && <p id="main-sub-greeting">Keep at it!</p>}
            </div>
            {hasSearchHistory && <div className="search-results">
                <p id="main-results-heading">Your recent search results:</p>
            </div>}
        </div>
    );
}

export default MainPage;
