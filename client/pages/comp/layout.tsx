'use client'
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import TopBar from "./topbar";
import SideBar from "./sidebar";
import FullScreenSearch from "./fullscreenSearch";
import Cookies from 'js-cookie';
import { currentSearchQueryAvailable, searchHistory } from '../_app';
import { App } from '@capacitor/app';

// Defining the props for the Layout component.
interface LayoutProps {
    navigation: boolean
    children: ReactNode;
    showBottomBar: boolean;
    showResults: (i: number) => void;
    fetchResults: (p: string) => void;
}

// The layout of the page.
//   navigation: whether to show the topbar buttons and sidebar.
//   children: the content of the page.
//   showResults: function called when clicking on a sidebar search query.
//   fetchResults: function to call when the user makes a search.
const Layout: React.FC<LayoutProps> = ({ navigation, showBottomBar, children, showResults, fetchResults }) => {
    // LOGIC:
    //   - If no search query was made, just display the welcome page.
    //   - Else, 
    //      - If the app is currently waiting for the search results, display the prompt and the loading spinner below it.
    //      - If the search results are ready, display the search results.
    // Using the Next.js router.
    const router = useRouter();

    // State variables for controlling the visibility of the SideBar and FullScreenSearch overlays.
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Support for the Android back button.
    // Weird feature where when the search is open, the back button closes the search, but also opens the sidebar.
    App.addListener('backButton', () => {
        if (isSearchOpen) {
            closeSearch();
        } else {
            toggleSidebar();
        }
    });
   
    // ================== SIDEBAR ==================
    // Function to toggle the visibility of the SideBar.
    const toggleSidebar = () => { // Sidebar overlay behavior.
      setIsSidebarOpen(!isSidebarOpen);
    };

    // Function to close the SideBar.
    const sidebarClose = () => {
      setIsSidebarOpen(false);
    };

    // Function to handle a click on a search query in the SideBar.
    const sidebarSearchQuery = (x: number) => {
        showResults(x);
        sidebarClose();
        router.push('/resultsPage');
    }

    // Function to navigate to the home page.
    const sidebarHome = () => {
        sidebarClose();
        router.push('/');
    }

    const sidebarAbout = () => {
        sidebarClose();
        router.push('/aboutPage');
    }

    // Function to handle logout.
    const sidebarLogout = () => {
        Cookies.remove('email');
        Cookies.remove('username');
        Cookies.remove('id');
        Cookies.remove('timestamp');
        // Cookies.remove('searchHistory');
        window.location.reload();
    }   // Reload the page.

    // ================== SEARCH OVERLAY ==================
    // Function to toggle the visibility of the FullScreenSearch component.
    const toggleSearch = () => {// Search overlay behavior
        setIsSearchOpen(!isSearchOpen);
    };

    // Function to close the FullScreenSearch component.
    const closeSearch = () => {
        setIsSearchOpen(false);
    };

    // Function to handle a search action in the FullScreenSearch component.
    const doSearch = (p: string) => {
        closeSearch();
        fetchResults(p);
        router.push('/resultsPage');
    }

    // Render the Layout component.
    return (
        <div className="App">
            <TopBar showButtons={navigation} onMenuClick={toggleSidebar} onSearchClick={toggleSearch} />
            {navigation && <SideBar isOpen={isSidebarOpen} 
                onClose={sidebarClose} 
                onQueryClick={(x: number) => sidebarSearchQuery(x)}
                onHomeClick={sidebarHome} 
                onLogoutClick={sidebarLogout}
                onAboutClick={sidebarAbout}/>}
            {navigation && <FullScreenSearch isOpen={isSearchOpen} onClose={closeSearch} onSearch={doSearch} />}
            {children}
            {showBottomBar && !(currentSearchQueryAvailable() && router.pathname.indexOf('/resultsPage') != -1) && <button id="intro-search-button" onClick={toggleSearch}> 
                {searchHistory.length > 0 ? <text>Keep at it!</text> : <text>Make the first step!</text>}
                <i className="fi fi-br-search"></i>
            </button>}
        </div>
    );
};
// Export the Layout component.
export default Layout;