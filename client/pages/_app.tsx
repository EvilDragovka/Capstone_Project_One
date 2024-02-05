import "@/styles/globals.css";
import type { AppProps } from "next/app";
import WelcomePage from './welcomePage';
import SignUpPage from './signUpPage';
import { useRouter } from 'next/router';
import MainPage from './mainPage';


export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    // check the route and render the appropriate component
    if (router.pathname === '/signUpPage') {
        return <SignUpPage />;
    }
    if (router.pathname === '/mainPage') {
        return <MainPage />;
    }

    return <WelcomePage />;
}