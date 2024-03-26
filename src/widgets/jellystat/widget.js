import credentialedProxyHandler from "utils/proxy/handlers/credentialed";

const widget = {
  api: "{url}/{endpoint}",
  proxyHandler: credentialedProxyHandler,

  mappings: {
    getLibraries: {
      endpoint: "api/getLibraries",
    },
    getViewsByDays: {
      method: "POST",
      endpoint: "stats/getViewsByDays",
    },
  },
};

export default widget;
