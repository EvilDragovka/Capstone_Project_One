// ResultsPage.tsx
import { useState } from 'react';
import { searching } from './_app';

interface ResultsPageProps {
    prompt: string | null;
    result: string | null;
}

export default function ResultsPage({ prompt, result}: ResultsPageProps) {
    // The results page
    return (
        <div className="results-page">
            <div className="search-prompt">
                <p className="search-heading">You asked:</p>
                <p>{prompt}</p>
            </div>
            <div className="search-results">
                {!searching && <p className="search-heading">Learnix says:</p>}
                {searching && <p className="search-heading">Learnix is thinking...</p>}
                <p>{result}</p>
            </div>
        </div>
    );
}