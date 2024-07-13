import "@/styles/globals.css";
import Head from "next/head";
import { useState, useEffect, createContext } from "react";
import type { AppProps } from "next/app";
import { AnonAadhaarProvider } from "@anon-aadhaar/react";
import { Header } from "../components/Header";
import { WagmiProvider } from "wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { Footer } from "@/components/Footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "../config";

const queryClient = new QueryClient();
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "";

createWeb3Modal({
  wagmiConfig: wagmiConfig,
  projectId,
});

export const AppContext = createContext({
  useTestAadhaar: false,
  setIsTestMode: (isTest: boolean) => { },
  setVoted: (voted: boolean) => { },
});

export default function App({ Component, pageProps }: AppProps) {
  const [isDisplayed, setIsDisplayed] = useState<boolean>(false);
  const [ready, setReady] = useState(false);
  const [isTestMode, setIsTestMode] = useState<boolean>(true);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (voted) setIsDisplayed(true);
  }, [voted]);

  return (
    <>
      <Head>
        <title>Lok Sabha Election</title>
        <meta property="og:title" content="Lok Sabha Election" key="title" />
        <meta
          property="og:image"
          content="https://anon-aadhaar-example.vercel.app/AnonAadhaarBanner.png"
          key="image"
        />
        <meta
          property="og:description"
          name="description"
          content="A Next.js example app that integrate the Anon Aadhaar SDK."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {ready ? (
        <AppContext.Provider
          value={{
            useTestAadhaar: isTestMode,
            setIsTestMode: setIsTestMode,
            setVoted: setVoted,
          }}
        >
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              <AnonAadhaarProvider>
                <div className="relative min-h-screen flex flex-col justify-between">
                  <div className="flex-grow">
                    <Header />
                    <Component {...pageProps} />
                  </div>
                  <Footer
                    isDisplayed={isDisplayed}
                    setIsDisplayed={setIsDisplayed}
                  />
                </div>
              </AnonAadhaarProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </AppContext.Provider>
      ) : null}
    </>
  );
}
