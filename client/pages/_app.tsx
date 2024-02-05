import "@/styles/globals.css";
import type { AppProps } from "next/app";
import WelcomePage from './welcomePage';

export default function App({ Component, pageProps }: AppProps) {
  return (
      <>
        <WelcomePage />
        <Component {...pageProps} />
      </>
  );
}