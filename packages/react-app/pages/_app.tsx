import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CeloProvider, Alfajores } from '@celo/react-celo';
import '@celo/react-celo/lib/styles.css';



import Layout from "../components/Layout";
import { ShoppingCartProvider } from "@/context/ShoppingCartContext";
import MarketPlaceProvider from "@/context/MarketPlaceContext";

function App({ Component, pageProps }: AppProps) {
  return (
    <CeloProvider
      dapp={{
        name: "celo-composer dapp",
        description: "My awesome celo-composer description",
        url: "https://example.com",
        icon: "https://example.com/favicon.ico",
      }}
      defaultNetwork={Alfajores.name}
      connectModal={{
        providersOptions: { searchable: true },
      }}
    >
      <ShoppingCartProvider>
        <MarketPlaceProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MarketPlaceProvider>
      </ShoppingCartProvider>
    </CeloProvider>
  );
}

export default App;