import { useRouter } from 'next/router';
import { ReactNode, useState, useEffect } from 'react';
import TopBar from "./topbar";
import SideBar from "./sidebar";
import FullScreenSearch from "./fullscreenSearch";

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    // TODO: Redirect to the welcomePage if the user is not logged in
    const router = useRouter();
    // useEffect(() => {
    //     const isLoggedIn = localStorage.getItem('loggedIn') === 'true'; // Your authentication logic here
    //     if (!isLoggedIn) {
    //         router.push('/welcomePage');
    //     }
    // }, []);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  
    const closeSidebar = () => {
      setIsSidebarOpen(false);
    };

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const closeSearch = () => {
        // TODO: Clear the search prompt textarea upon closing the search overlay
        setIsSearchOpen(false);
    };

    return (
        <body className="App">
            <TopBar onMenuClick={toggleSidebar} onSearchClick={toggleSearch} />
            <SideBar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <FullScreenSearch isOpen={isSearchOpen} onClose={closeSearch} />
            {children}
        </body>
    );
};

export default Layout;