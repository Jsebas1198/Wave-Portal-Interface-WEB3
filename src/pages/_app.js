import "@styles/globals.css";
import { ProviderFunction } from "@hooks/useFunctions";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ProviderFunction>
        <Component {...pageProps} />
      </ProviderFunction>
    </>
  );
}

export default MyApp;
