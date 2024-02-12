import "@/styles/globals.css";
import '@/styles/topbar.css';
import '@/styles/sidebar.css';
import { useState } from "react";
import type { AppProps } from "next/app";
import WelcomePage from './welcomePage';
import SignUpPage from './signUpPage';
import { useRouter } from 'next/router';
import MainPage from './mainPage';
import { Main } from "next/document";
import Layout from "./comp/layout";

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    // check the route and render the appropriate component
    if (router.pathname === '/signUpPage') {
        return <SignUpPage />;
    }
    
    if (router.pathname === '/welcomePage') {
        return <WelcomePage />;
    }

    return (
        <Layout>
            <MainPage />
        </Layout>
    );

}