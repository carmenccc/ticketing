import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);

  return <h1>Landing Page</h1>;
};

// Request for currentUser data
// Why not request in the component?
// We are not allowed to process fetch-data from inside the component
// during the server-side rendering process
// Use getInitialProps function to load data before first render
LandingPage.getInitialProps = async ({ req }) => {
  console.log(req.headers);
  if (typeof window === "undefined") {
    // Server-side rendering
    // requests are sent from within the cluster
    // cross-namespace service communication is required
    // need to manually redirect to ingress nginx
    const { data } = await axios.get(
      // http://SERVICENAME.NAMESPACE.svc.cluster.local
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      {
        headers: req.headers,
      }
    );
    return data;
  } else {
    // Browser-side rendering
    // all requests go to nginx for redirection
    // which will prepend the correct domain for our url
    const { data } = await axios.get("/api/users/currentuser");

    return data;
  }
};

export default LandingPage;
