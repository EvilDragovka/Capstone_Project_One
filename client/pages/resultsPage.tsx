// ResultsPage.tsx
import { currentSearchQuery } from './_app';

export default function ResultsPage() {
    // The results page
    return (
        <div className="results-page">
            <div className="search-prompt">
                <p className="search-heading">You asked:</p>
                <p>{currentSearchQuery?.prompt}</p>
            </div>
            <div className="search-results">
                <p className="search-heading">Learnix says:</p>
                <p>{currentSearchQuery?.result}</p>
            </div>
        </div>
    );
}