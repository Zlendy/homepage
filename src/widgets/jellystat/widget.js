import genericProxyHandler from "utils/proxy/handlers/generic";

const widget = {
  api: "{url}/{endpoint}?apiKey={key}",
  proxyHandler: genericProxyHandler,

  mappings: {
    getViewsByDays: {
      method: "POST",
      endpoint: "stats/getViewsByDays",
    },
  },
};

export default widget;
