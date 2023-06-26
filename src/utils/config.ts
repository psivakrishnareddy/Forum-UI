import { IAuth0Config } from "../constants/models";

export function getAuth0Config(): IAuth0Config {
    // const audience ="https://dsbsd-dashboard-service-dev.net/api/v2";
  return {
    domain: "SED_AUTH0_DOMAIN_VALUE",
    clientId: "SED_AUTH0_CLIENT_ID_VALUE",
    redirectUri: window.location.origin,
    audience: "SED_AUTH0_AUDIENCE_VALUE"
  };
}