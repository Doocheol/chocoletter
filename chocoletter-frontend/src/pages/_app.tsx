import "../styles/globals.css";
import { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import Head from "next/head";
import { useEffect } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const updateVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    updateVH();
    window.addEventListener("resize", updateVH);
    return () => window.removeEventListener("resize", updateVH);
  }, []);

  return (
    <RecoilRoot>
      <Head>
        <title>Chocoletter</title>
        <meta name="description" content="Send sweet letters to your loved ones" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="App mx-auto w-full md:max-w-sm lg:min-h-[calc(var(--vh)_*_100)] bg-pink-100 text-gray-800">
        <Component {...pageProps} />
      </div>
    </RecoilRoot>
  );
}

export default MyApp;
