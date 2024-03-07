import { Html, Head, Main, NextScript } from "next/document";
/**The Document component, a top-level component for a page in Next.js, 
 * where you can set the Head, Body tags, and it wraps your entire 
 * Next.js application.
 **/ 
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
