// ResultsPage.tsx
import { searching } from './_app';
import Markdown from 'react-markdown'
// Defining the props for the ResultsPage component.
interface ResultsPageProps {
    prompt: string | null;
    result: string | null;
}
// Functional component and UI for displaying results of a search. 
export default function ResultsPage({ prompt, result}: ResultsPageProps) {
    // Render the results page component.
    return (
        <div className="results-page">
            <div className="search-prompt">
                <p className="search-heading">You asked:</p>
                <p>{prompt}</p>
            </div>
            <div className="search-results">
                {!searching && <p className="search-heading">Learnix says:</p>}
                {searching && <p className="search-heading">Learnix is thinking...</p>}
                <Markdown>{result}</Markdown>
            </div>
        </div>
    );
}