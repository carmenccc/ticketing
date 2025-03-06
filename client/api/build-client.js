import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // Server-side rendering
    // requests are sent from within the cluster
    // cross-namespace service communication is required
    // need to manually redirect to ingress nginx
    // Create a pre-configured version of axios
    return axios.create({
      baseURL:
        // http://SERVICENAME.NAMESPACE.svc.cluster.local
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // Browser-side rendering
    // all requests go to nginx for redirection
    // which will prepend the correct domain for our url
    return axios.create({
      baseUrl: "/",
    });
  }
};
