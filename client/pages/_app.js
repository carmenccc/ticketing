import "bootstrap/dist/css/bootstrap.css";

// A custom component app that wrap around any component
// purpose: as a global css import
// more details: refer to 'Global CSS Must Be in Your Custom <App>
export default ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};
