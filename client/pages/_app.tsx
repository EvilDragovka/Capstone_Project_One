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

export const backendUrl = 'http://localhost:5000/';
export var searchHistory: SearchQuery[] = [];
export var currentSearchQuery: SearchQuery | null = null;
export var currentPrompt: string | null = null;
export const currentUser: User = { 
    email: Cookies.get('email'),
    username: Cookies.get('username'),
    id: Cookies.get('id')
};
export var searching = false;
var loadedHistory = false;

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    // Load the most recent search query
    if (!loadedHistory) {
        var history = Cookies.get('searchHistory');
        searchHistory = JSON.parse(history || '[]');
        loadedHistory = true;
    }

    var goToWelcomeUpPage = currentUser.email === undefined ||
        currentUser.username === undefined ||
        currentUser.id === undefined;

    // console.log(currentUser);

    // check the route and render the appropriate component
    if (router.pathname === '/signUpPage') {
        return (
            <Layout navigation={false}>
                <SignUpPage />
            </Layout>
        );
    }

    if (goToWelcomeUpPage) {
    //     return (
    //         <Layout navigation={false}>
    //             <WelcomePage />
    //         </Layout>
    //     );
    }

    // TODO: Implement a way to load the last search query the user made
    //  - In the database, maybe each search query could use a unique ID
    //  - Then, the query ID could be loaded from the URL?
    //  - e.g. /resultsPage?queryID=123
    //  - Of course, each query should be associated with a user ID
    //  - So no one can access other people's queries
    if (router.pathname.indexOf('/resultsPage') != -1 && (currentPrompt || currentSearchQuery)) {

        return (
            <Layout navigation={true}>
                <ResultsPage />
            </Layout>
        );
    }

    return (
        <Layout navigation={true}>
            <MainPage />
        </Layout>
    );
}

export async function postToLlm(p: string) {
    searching = true;
    let data = {
        question: p
    };
    console.log(data);
    const response = await fetch(backendUrl + 'api/llama/conversation', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        searching = false;
        throw new Error('Network response was not ok');
    }
    const json = await response.json();
    console.log(json);
    
    searching = false;
    return json.response;
}

export async function initializeSearching(prompt: string) {
    currentPrompt = prompt;

    currentSearchQuery = null;
    const response = await postToLlm(currentPrompt as string).catch((error) => {
        console.error('Error:', error);
        return "I'm sorry, something went wrong. Please try again.";
    })
    return response;
}

export function pushSearchHistory(query: SearchQuery) {
    if (searchHistory.length >= 5) {
        searchHistory.shift();
    }
    searchHistory.push(query);
    currentSearchQuery = query;
    currentPrompt = null;
    console.log(query);

    Cookies.set('searchHistory', JSON.stringify(searchHistory));
}

export function setSearchQuery(i: number) {
    if (i >= 0 && i < searchHistory.length) {
        currentSearchQuery = searchHistory[i];
        currentPrompt = currentSearchQuery.result;
    }
}

export function makeLatestSearchQuery(i: number) {
    if (i >= 0 && i < searchHistory.length) {
        currentSearchQuery = searchHistory[i];
        currentPrompt = null;
        var historyStart = searchHistory.slice(0, i);
        var historyEnd = searchHistory.slice(i + 1, searchHistory.length);
        searchHistory = historyStart.concat(historyEnd);
        searchHistory.push(currentSearchQuery);
        console.log(currentSearchQuery);
        Cookies.set('searchHistory', JSON.stringify(searchHistory));
    }
}