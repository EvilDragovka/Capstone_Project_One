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
import SearchQuery from "./class/searchQuery";
import ResultsPage from "./resultsPage";

interface User {
    email: string | undefined;
    username: string | undefined;
    id: string | undefined;
}

var searchHistory: SearchQuery[] = [];
var searchQuery: SearchQuery | null = null;
export const currentUser: User = { 
    email: Cookies.get('email'),
    username: Cookies.get('username'),
    id: Cookies.get('id')
};

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    // Load the most recent search query
    // Maybe we could use cookies for this? So that the client won't have to
    //  make requests every time the user enters the page, making things faster?

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
        return (
            <Layout navigation={false}>
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
    if (router.pathname.indexOf('/resultsPage') != -1 && searchQuery) {

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

export function getSearchResult(): string | null {
    return searchQuery ? searchQuery.getResult() : null;
}

export function getSearchPrompt(): string | null {
    return searchQuery ? searchQuery.getPrompt() : null;
}

export function getSearchQuery(): SearchQuery | null {
    return searchQuery;
}

export function getSearchHistory(): SearchQuery[] {
    return searchHistory;
}

export function pushSearchHistory(query: SearchQuery) {
    if (searchHistory.length >= 5) {
        searchHistory.shift();
    }
    searchHistory.push(query);
    searchQuery = query;
}

export function setSearchQuery(i: number) {
    if (i >= 0 && i < searchHistory.length) {
        searchQuery = searchHistory[i];
    }
}

export function makeLatestSearchQuery(i: number) {
    if (i >= 0 && i < searchHistory.length) {
        searchQuery = searchHistory[i];
        var historyStart = searchHistory.slice(0, i);
        var historyEnd = searchHistory.slice(i + 1, searchHistory.length);
        searchHistory = historyStart.concat(historyEnd);
        searchHistory.push(searchQuery);
    }
}