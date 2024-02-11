import "@/styles/globals.css";
import '@/styles/sidebar.css';
import { useState } from "react";
import type { AppProps } from "next/app";
import WelcomePage from './welcomePage';
import SignUpPage from './signUpPage';
import { useRouter } from 'next/router';
import MainPage from './mainPage';
import TopBar from "./comp/topbar";
import SideBar from "./comp/sidebar";

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    // check the route and render the appropriate component
    if (router.pathname === '/signUpPage') {
        return <SignUpPage />;
    }
    if (router.pathname === '/mainPage') {
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
                {/* Other components/content goes here */}
          </div>
        );
    }

    return <WelcomePage />;
}