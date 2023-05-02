import Layout from "../components/Layout";
import ShopProvider from "../context/shopContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <ShopProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ShopProvider>
  );
}

export default MyApp;
