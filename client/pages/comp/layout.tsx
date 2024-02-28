'use client'
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import TopBar from "./topbar";
import SideBar from "./sidebar";
import FullScreenSearch from "./fullscreenSearch";
import Cookies from 'js-cookie';

interface LayoutProps {
    navigation: boolean
    children: ReactNode;
    showResults: (i: number) => void;
    fetchResults: (p: string) => void;
}

// The layout of the page
//   navigation: whether to show the topbar and sidebar
//   children: the content of the page
//   showResults: function called when clicking on a sidebar search query
//   fetchResults: function to call when the user makes a search
const Layout: React.FC<LayoutProps> = ({ navigation, children, showResults, fetchResults }) => {
    // LOGIC:
    //   - If no search query was made, just display the welcome page
    //   - Else, 
    //      - If the app is currently waiting for the search results, display the prompt and the loading spinner below it
    //      - If the search results are ready, display the search results

    const router = useRouter();

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
        showResults(x);
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
        setIsSearchOpen(false);
    };

    const doSearch = (p: string) => {
        closeSearch();
        fetchResults(p);
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