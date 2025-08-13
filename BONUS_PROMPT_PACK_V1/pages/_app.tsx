import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import Head from 'next/head';
import '../styles/globals.css';

// Suppress console warnings in production
if (process.env.NODE_ENV === 'production') {
  console.warn = () => {};
}

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Remove SES warnings
    if (typeof window !== 'undefined') {
      const originalWarn = console.warn;
      console.warn = (...args) => {
        if (
          !args[0]?.includes('SES') &&
          !args[0]?.includes('Components object is deprecated')
        ) {
          originalWarn.apply(console, args);
        }
      };
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <Component {...pageProps} />
    </>
  );
} 