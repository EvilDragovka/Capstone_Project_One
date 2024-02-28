'use client'
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import TopBar from "./topbar";
import SideBar from "./sidebar";
import FullScreenSearch from "./fullscreenSearch";
import { SearchQuery, initializeSearching, makeLatestSearchQuery, pushSearchHistory } from '../_app';
import Cookies from 'js-cookie';

interface LayoutProps {
    navigation: boolean
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ navigation, children }) => {
    // LOGIC:
    //   - If no search query was made, just display the welcome page
    //   - Else, 
    //      - If the app is currently waiting for the search results, display the prompt and the loading spinner below it
    //      - If the search results are ready, display the search results
    //      - If the app is loading an old search query, display a loading screen

    // TODO: Redirect to the welcomePage if the user is not logged in
    const router = useRouter();
    // useEffect(() => {
    //     const isLoggedIn = currentUser.email === undefined ||
    //     currentUser.username === undefined ||
    //     currentUser.id === undefined;; // Your authentication logic here
    //     if (!isLoggedIn) {
    //         // router.push('/welcomePage');
    //         // window.location.reload();
    //     }
    // }, []);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchPrompt, setSearchPrompt] = useState('');
    const [searchResult, setSearchResult] = useState('Let me think about that...');

    // Sidebar overlay behavior
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  
    const sidebarClose = () => {
      setIsSidebarOpen(false);
    };

    const sidebarSearchQuery = (x: number) => {
        makeLatestSearchQuery(x);
        sidebarClose();
        router.push('/resultsPage');
    }

    const sidebarHome = () => {
        sidebarClose();
        router.push('/');
    }

    const sidebarLogout = () => {
        // TODO: Remove the router.push. The page should be reloaded with the layout
        //  redirecting to the welcomePage if the user is not logged in
        // router.push('/welcomePage');
        // localStorage.setItem('loggedIn', 'false');
        // Cookies.remove('id');
        // Cookies.remove('username');
        Cookies.remove('email');
        Cookies.remove('username');
        Cookies.remove('id');
        Cookies.remove('timestamp');
        window.location.reload();
        // router.push('/welcomePage');
    }

    // Search overlay behavior
    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const closeSearch = () => {
        // TODO: Clear the search prompt textarea upon closing the search overlay
        setIsSearchOpen(false);
    };

    const doSearch = async (p: string) => {
        closeSearch();
        router.push('/resultsPage');
        setSearchPrompt(p);
        var response = await initializeSearching(p);

        var query: SearchQuery = {
            prompt: p,
            result: response,
            userId: Cookies.get('id') || '',
            queryId: Date.now().toString()
        };
        pushSearchHistory(query);
        setSearchResult(response);
    }

    return (
        <div className="App">
            <TopBar showButtons={navigation} onMenuClick={toggleSidebar} onSearchClick={toggleSearch} />
            {navigation && <SideBar isOpen={isSidebarOpen} 
                onClose={sidebarClose} 
                onQueryClick={(x: number) => sidebarSearchQuery(x)}
                onHomeClick={sidebarHome} 
                onLogoutClick={sidebarLogout}/>}
            {navigation && <FullScreenSearch isOpen={isSearchOpen} onClose={closeSearch} onSearch={doSearch} />}
            {children}
        </div>
    );
};

export default Layout;