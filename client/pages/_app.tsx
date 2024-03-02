import "@/styles/globals.css";
import '@/styles/topbar.css';
import '@/styles/sidebar.css';
import '@/styles/fullscreenSearch.css';
import '@/styles/welcomePage.css';
import '@/styles/signUpPage.css';
import { useState } from "react";
import type { AppProps } from "next/app";
import Cookies from 'js-cookie';
import WelcomePage from './welcomePage';
import SignUpPage from './signUpPage';
import { useRouter } from 'next/router';
import MainPage from './mainPage';
import Layout from "./comp/layout";
import ResultsPage from "./resultsPage";

export interface User {
    email: string | undefined;
    username: string | undefined;
    id: string | undefined;
}

export interface SearchQuery {
    prompt: string;
    result: string | null;
    userId: string;
    queryId: string;
}

export const backendUrl = 'http://52.13.109.29/';
export var searchHistory: SearchQuery[] = [];
export var currentSearchQuery: SearchQuery | null = null;
export const currentUser: User = { 
    email: Cookies.get('email'),
    username: Cookies.get('username'),
    id: Cookies.get('id')
};
export var searching = false;

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    // These are for the results page
    const [prompt, setDisplayedPrompt] = useState('');
    const [result, setDisplayedResult] = useState('');

    // Load the most recent search query
    if (!searchHistory.length) {
        var history = Cookies.get('searchHistory');
        searchHistory = JSON.parse(history || '[]');
    }

    // Check if the user is logged in
    var goToWelcomeUpPage = currentUser.email === undefined ||
        currentUser.username === undefined ||
        currentUser.id === undefined;

    // These two functions are for the results page
    //   Well, they're passed to the layout, but they're to display the results
    //   It was the best code design I could think of

    // Call this if there's a prompt but no current search query made
    const fetchResults = async (p: string) => {
        searching = true;
        // Set the prompt and the loading message
        setDisplayedPrompt(p);
        setDisplayedResult('');

        // Fetch the results from the backend
        console.log('Searching...');
        const response = await postToLlm(p).catch((error) => {
            console.error('Error:', error);
            searching = false;
            setDisplayedResult("I'm sorry, something went wrong. Please try again.");
        })
        console.log('Finished search.');
            
        // Push the search query to the search history
        var query: SearchQuery = {
            prompt: p,
            result: response,
            userId: Cookies.get('id') || '',
            queryId: Date.now().toString()
        };
        pushSearchHistory(query);
        setDisplayedResult(response);
        searching = false;
    }

    // Call this to show the results of a previous search query
    const showResults = (i: number) => {
        var query: SearchQuery | null = makeLatestSearchQuery(i);
        if (query) {
            setDisplayedPrompt(query.prompt);
            setDisplayedResult(query.result || '');
        }
    }

    /* =================== ROUTERS =================== */
    // Sign up page
    if (router.pathname === '/signUpPage') {
        return (
            <Layout navigation={true} showResults={(i: number) => showResults(i)} fetchResults={(p: string) => fetchResults(p)}>
                <SignUpPage />
            </Layout>
        );
    }

    // Welcome page
    if (goToWelcomeUpPage) {
        return (
            <Layout navigation={true} showResults={(i: number) => showResults(i)} fetchResults={(p: string) => fetchResults(p)}>
                <WelcomePage />
            </Layout>
        );
    }

    // TODO: Implement a way to load the last search query the user made
    //  - In the database, maybe each search query could use a unique ID
    //  - Then, the query ID could be loaded from the URL?
    //  - e.g. /resultsPage?queryID=123
    //  - Of course, each query should be associated with a user ID
    //  - So no one can access other people's queries
    if (router.pathname.indexOf('/resultsPage') != -1 && (searching || currentSearchQuery)) {
        // const prompt = router.pathname.split('?prompt=')[1];        
        return (
            <Layout navigation={true} showResults={(i: number) => showResults(i)} fetchResults={(p: string) => fetchResults(p)}>
                <ResultsPage prompt={prompt} result={result}/>
            </Layout>
        );
    }

    return (
        <Layout navigation={true} showResults={(i: number) => showResults(i)} fetchResults={(p: string) => fetchResults(p)}>
            <MainPage />
        </Layout>
    );
}

// Sends a prompt to the LLM and returns the response
async function postToLlm(p: string) {
    let data = {
        question: p
    };
    const response = await fetch(backendUrl + 'api/llama/conversation', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const json = await response.json();
    return json.response;
}

// Pushes a search query to the search history
//   Oldest search query gets removed if the history is full
function pushSearchHistory(query: SearchQuery) {
    if (searchHistory.length >= 5) {
        searchHistory.shift();
    }
    searchHistory.push(query);
    currentSearchQuery = query;
    console.log(query);

    Cookies.set('searchHistory', JSON.stringify(searchHistory));
}

// Brings the indexed query to the top of the search history
function makeLatestSearchQuery(i: number) {
    if (i >= 0 && i < searchHistory.length) {
        currentSearchQuery = searchHistory[i];
        var historyStart = searchHistory.slice(0, i);
        var historyEnd = searchHistory.slice(i + 1, searchHistory.length);
        searchHistory = historyStart.concat(historyEnd);
        searchHistory.push(currentSearchQuery);
        console.log(currentSearchQuery);
        Cookies.set('searchHistory', JSON.stringify(searchHistory));
        return currentSearchQuery;
    } else {
        return null;
    }
}