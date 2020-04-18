import { api } from "./index";

/**
 * Pings the backend to get organizations
 * @return credential object from backend to be used as authorization in the app state
 */
async function getOrganizations() {
  return await api.get(`/organizations`).then((res) => {
    return res.data;
  });
}

export { getOrganizations };