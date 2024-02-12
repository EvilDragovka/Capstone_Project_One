import { useRouter } from 'next/router';
import { ReactNode, useState, useEffect } from 'react';
import TopBar from "./topbar";
import SideBar from "./sidebar";

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

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  
    const closeSidebar = () => {
      setIsSidebarOpen(false);
    };
    return (
        <div className="App">
            <TopBar onMenuClick={toggleSidebar} />
            <SideBar isOpen={isSidebarOpen} onClose={closeSidebar} />
            {children}
        </div>
    );
};

export default Layout;