import { api, clearIndexedDB } from "./index";

/**
 * Pings the backend to get current credentials of user logged in
 * @return credential object from backend to be used as authorization in the app state
 */
async function getCredentials() {
  return await api.get(`/credentials/current`).then((res) => {
    sessionStorage.setItem(
      "creds",
      JSON.stringify({
        authorized: true,
        email: res.data.email,
        username: res.data.username,
        isAdmin: res.data.isAdmin,
        isEmployee: res.data.isEmployee,
        isAthlete: res.data.isAthlete,
        isCoach: res.data.isCoach
      })
    );
    sessionStorage.setItem("org", JSON.stringify(res.data.organization));
    return res.data;
  });
}

/**
 * Allows user to signup through the backend
 * @param {string} email user entered email address
 * @param {string} usernamer user entered username
 * @param {string} password user entered password
 * @param {boolean} remember determines whether authorization cookie will be session or 30 day expiration
 * @param {object} organization the selected organization to be apart of
 *
 * @return credential object from backend to be used as authorization in the app state
 */
async function signup(email, username, password, organization, remember) {
  return await api
    .post(
      `/credentials/signup`,
      { email, username, password, remember, organizationId: organization?.id || organization }
    )
    .then((res) => {
      if (remember) {
        localStorage.setItem(
          "creds",
          JSON.stringify({
            authorized: true,
            email: res.data.email,
            username: res.data.username,
            isAdmin: res.data.isAdmin,
            isEmployee: res.data.isEmployee,
            isAthlete: res.data.isAthlete,
            isCoach: res.data.isCoach
          })
        );
        localStorage.setItem("org", JSON.stringify(res.data.organization));
      } else {
        sessionStorage.setItem(
          "creds",
          JSON.stringify({
            authorized: true,
            email: res.data.email,
            username: res.data.username,
            isAdmin: res.data.isAdmin,
            isEmployee: res.data.isEmployee,
            isAthlete: res.data.isAthlete,
            isCoach: res.data.isCoach
          })
        );
        sessionStorage.setItem("org", JSON.stringify(res.data.organization));
      }
      return res.data;
    });
}

/**
 * Allows user to login through the backend
 * @param {string} email user entered email address or username (backend checks against both)
 * @param {string} password user entered password
 * @param {boolean} remember determines whether authorization cookie will be session or 30 day expiration
 *
 * @return credential object from backend to be used as authorization in the app state
 */
async function login(email, password, remember) {
  return await api
    .post(`/credentials/login`, { email, password, remember })
    .then((res) => {
      if (remember) {
        localStorage.setItem(
          "creds",
          JSON.stringify({
            authorized: true,
            email: res.data.email,
            username: res.data.username,
            isAdmin: res.data.isAdmin,
            isEmployee: res.data.isEmployee,
            isAthlete: res.data.isAthlete,
            isCoach: res.data.isCoach
          })
        );
        localStorage.setItem("org", JSON.stringify(res.data.organization));
      } else {
        sessionStorage.setItem(
          "creds",
          JSON.stringify({
            authorized: true,
            email: res.data.email,
            username: res.data.username,
            isAdmin: res.data.isAdmin,
            isEmployee: res.data.isEmployee,
            isAthlete: res.data.isAthlete,
            isCoach: res.data.isCoach
          })
        );
        sessionStorage.setItem("org", JSON.stringify(res.data.organization));
      }
      return res.data;
    });
}

/**
 * Will clear sessionStorage and have backend clear cookies.
 * @return {null} null credential object
 */
async function logout() {
  sessionStorage.removeItem("creds");
  sessionStorage.removeItem("org");
  localStorage.removeItem("creds");
  localStorage.removeItem("org");
  await clearIndexedDB(["users", "inventory", "sports"]);

  return await api.get(`/credentials/logout`).then(() => {
    return null;
  });
}

/**
 * Allows user to to update their credentials
 * @param {string} email user entered email address
 * @param {string} user user entered username
 * @param {boolean} isEmployee employee role
 * @param {boolean} isCoach coach role
 * @param {boolean} isAthlete athlete role
 *
 * @return message describing if the operation was successful
 */
async function updateCurrentCredentials({ email, username, isEmployee, isCoach, isAthlete }) {
  return await api
    .put(
      `/credentials/current`,
      {
        email,
        username,
        isEmployee,
        isCoach,
        isAthlete
      }
    )
    .then((res) => {
      return res.data;
    });
}

/**
 * Allows an admin to to update the credentials of another user
 * @param {string} email user entered email address
 * @param {string} user user entered username
 * @param {boolean} isAdmin admin role (if trying to update current user the isAdmin role will not be updated)
 * @param {boolean} isEmployee employee role
 * @param {boolean} isCoach coach role
 * @param {boolean} isAthlete athlete role
 *
 * @return message describing if the operation was successful
 */
async function updateCredentials({
  id, //Required to make successful request
  email,
  username,
  password,
  isAdmin,
  isEmployee,
  isCoach,
  isAthlete
}) {
  return await api
    .put(
      `/credentials`,
      {
        email,
        username,
        password,
        isAdmin,
        isEmployee,
        isCoach,
        isAthlete
      },
      { params: { id } }
    )
    .then((res) => {
      return res.data;
    });
}

/**
 * Allows an admin to to update the credentials of another user
 * @param {string} password user entered current password
 * @param {string} newPassword user entered new password
 *
 * @return message describing if the operation was successful
 */
async function changePassword(password, newPassword) {
  return await api
    .put(`/credentials/changePassword`, { password, newPassword })
    .then((res) => {
      return res.data;
    });
}

export { login, logout, signup, getCredentials, updateCurrentCredentials, updateCredentials, changePassword };
