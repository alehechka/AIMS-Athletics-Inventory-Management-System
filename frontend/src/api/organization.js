import axios from "axios";

import { apiUrl } from "./index";

/**
 * Pings the backend to get organizations
 * @return credential object from backend to be used as authorization in the app state
 */
async function getOrganizations() {
  return await axios.get(`${apiUrl}/organizations`, { withCredentials: true }).then((res) => {
    return res.data;
  });
}

export { getOrganizations };