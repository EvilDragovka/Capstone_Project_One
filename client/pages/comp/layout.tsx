import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import TopBar from "./topbar";
import SideBar from "./sidebar";
import FullScreenSearch from "./fullscreenSearch";
import { SearchQuery, getSearchHistory, getSearchQuery, makeLatestSearchQuery, pushSearchHistory, setSearchQuery } from '../_app';
import Cookies from 'js-cookie';

interface LayoutProps {
    navigation: boolean
    children: ReactNode;
}

async function postToLlm(p: string) {
    try {
        let data = {
            question: p
        };
        const response = await fetch('http://localhost:5000/api/llama/conversation', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const json = await response.json();
        console.log(json);
        return json.response;
    } catch (error) {
        return 'There has been a problem with the search operation:' + error;
    }
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
     //useEffect(() => {
     //    const isLoggedIn = localStorage.getItem('loggedIn') === 'true'; // Your authentication logic here
    //     if (!isLoggedIn) {
    //         router.push('/welcomePage');
    //     }
   //  }, []);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

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
        window.location.reload();
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

        const response = await postToLlm(p);
        var query: SearchQuery = { 
            prompt: p, 
            result: response,
            userId: Cookies.get('id') || '',
            queryId: ''
        };
        pushSearchHistory(query);
        // searchStateFunction(SearchStatus.READY);
        router.push('/resultsPage');
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