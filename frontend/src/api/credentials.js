import axios from "axios";

import { apiUrl } from "./index";

/**
 *
 * All authorization is handled by the HttpOnly cookie: Authorization.
 *
 * Cookies will be sent with all API requests
 *
 */

//If successful, returns the current user's credential data
async function getCredentials() {
  return await axios
    .get(`${apiUrl}/credentials/current`, { withCredentials: true })
    .then(res => {
      // {email, username, isAdmin, isEmployee, isCoach, isAthlete}
      return res.data;
    });
}

//If successful, returns a JWT that is stored in httpOnly authorization cookie.
//Remember boolean
//  false -> session only
//  true  -> 30d expire
async function signup(email, username, password, remember) {
  return await axios
    .post(
      `${apiUrl}/credentials/signup`,
      { email, username, password, remember },
      { withCredentials: true }
    )
    .then(res => {
      return res.data;
    });
}

//If successful, returns a JWT that is stored in httpOnly authorization cookie.
//Remember boolean
//  false -> session only
//  true  -> 30d expire
async function login(email, password, remember) {
  return await axios
    .post(
      `${apiUrl}/credentials/login`,
      { email, password, remember },
      { withCredentials: true }
    )
    .then(res => {
      return res.data;
    });
}

//Pings the backend to delete the authorization cookie and sets URL to root
async function logout() {
  await axios
    .get(`${apiUrl}/credentials/logout`, { withCredentials: true })
    .then(res => {
      window.location.href = "/";
    });
}

//Updates current user credentials
//If user is an admin they can update roles
//Params in {} so you can send credentials object instead of individual params
async function updateCurrentCredentials({
  email,
  username,
  isAdmin,
  isEmployee,
  isCoach,
  isAthlete
}) {
  return await axios
    .put(
      `${apiUrl}/credentials/current`,
      {
        email,
        username,
        isAdmin,
        isEmployee,
        isCoach,
        isAthlete
      },
      { withCredentials: true }
    )
    .then(res => {
      return res.data;
    });
}

//Allows an admin to update a user's credentials
//If user is an admin they can update roles
//Params in {} so you can send credentials object instead of individual params
async function updateCredentials({
  id,
  email,
  username,
  isAdmin,
  isEmployee,
  isCoach,
  isAthlete
}) {
  return await axios
    .put(
      `${apiUrl}/credentials`,
      {
        email,
        username,
        isAdmin,
        isEmployee,
        isCoach,
        isAthlete
      },
      { params: id, withCredentials: true }
    )
    .then(res => {
      return res.data;
    });
}

export {
  login,
  logout,
  signup,
  getCredentials,
  updateCurrentCredentials,
  updateCredentials
};
