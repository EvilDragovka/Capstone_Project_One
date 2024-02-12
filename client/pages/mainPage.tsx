// MainPage.tsx
import React, { useState } from 'react';
import SearchQuery from './class/searchQuery';

function MainPage() {
    // Your component logic goes here
    // LOGIC:
    //   - If no search query was made, just display the welcome page
    //   - Else, 
    //      - If the app is currently waiting for the search results, display the prompt and the loading spinner below it
    //      - If the search results are ready, display the search results
    //      - If the app is loading an old search query, display a loading screen

    var testQuery = new SearchQuery("What is love?", "Baby don't hurt me\n\
    Don't hurt me\n\
    No more");
    // The results page
    return (
        <div>
            <div className="search-prompt">
                <p className="search-heading">You said:</p>
                <p>{testQuery.getPrompt()}</p>
            </div>
            <div className="search-results">
                <p className="search-heading">Learnix says:</p>
                <p>{testQuery.getResult()}</p>
            </div>
        </div>
    );
}

export default MainPage;
