import type { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";
import { ThemeProvider } from "styled-components";
import Layout from "../components/Layout";
import { AccountProvider } from "../contexts/AccountContext";
import store from "../store";
import GlobalStyle from "../styles/global-style";
import { theme } from "../styles/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import "../styles/fonts.css";

const getLibrary = (provider: any) => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 8000; // frequency provider is polling
  return library;
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider store={store}>
      <AccountProvider>
        <ThemeProvider theme={theme}>
          <Web3ReactProvider getLibrary={getLibrary}>
            <GlobalStyle />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Web3ReactProvider>
        </ThemeProvider>
      </AccountProvider>
    </ReduxProvider>
  );
}

export default MyApp;
