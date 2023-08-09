import { CartContextProvider } from "@/components/CartContext";
import { Helmet } from "react-helmet";
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  body {
    background-color: #F0f0f0;
    padding: 0;
    margin: 0;
    font-family: 'Roboto', sans-serif;
  }
`;

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />
      <CartContextProvider>
        <Helmet>
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
            rel="stylesheet"
          />
        </Helmet>
        <Component {...pageProps} />
      </CartContextProvider>
    </>
  );
}
