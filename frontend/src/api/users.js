import axios from "axios";

import { apiUrl } from "./index";

/**
 *
 * All authorization is handled by the HttpOnly cookie: Authorization.
 *
 * Cookies will be sent with all API requests
 *
 */

// Allows an admin to create a user profile with temporary credentials
// Only required field is the email, username can be generated from email
// If password is null will be auto set to "password123"
// The user portion can all be {} to create null user
async function createUser(
  email,
  username,
  password,
  //below is in curly braces so you can send a user object that contains all inner variables
  {
    schoolId,
    firstName,
    lastName,
    address,
    city,
    state,
    zip,
    phone,
    gender,
    height,
    weight,
    lockerNumber,
    lockerCode
  }
) {
  return await axios
    .post(
      `${apiUrl}/users`,
      {
        email,
        username,
        password,
        schoolId,
        firstName,
        lastName,
        address,
        city,
        state,
        zip,
        phone,
        gender,
        height,
        weight,
        lockerNumber,
        lockerCode
      },
      { withCredentials: true }
    )
    .then(res => {
      return res.data;
    });
}

// Retreives a list of users that the current user has access to (based on role or sport if coach)
// The page and limit parameters are used for pagination (supply null to default to 200 user resposne)
// When ID is supplied will return the single user object connected to that ID
async function getUsers(page, limit, id) {
  return await axios
    .get(`${apiUrl}/users`, {
      params: { page, limit, id },
      withCredentials: true
    })
    .then(res => {
      return res.data;
    });
}

async function getCurrentUser() {
  return await axios
    .get(`${apiUrl}/users/current`, { withCredentials: true })
    .then(res => {
      return res.data;
    });
}

// Allows the currently logged in user to update their profile settings
// The user portion can all be {} to update to a null user
async function updateCurrentUser(
  //below is in curly braces so you can send a user object that contains all inner variables
  {
    schoolId, //Can only be changed with admin access
    firstName,
    lastName,
    address,
    city,
    state,
    zip,
    phone,
    gender,
    height,
    weight,
    lockerNumber, //Can only be changed with admin or employee access
    lockerCode //Can only be changed with admin or employee access
  }
) {
  return await axios
    .put(
      `${apiUrl}/users/current`,
      {
        schoolId,
        firstName,
        lastName,
        address,
        city,
        state,
        zip,
        phone,
        gender,
        height,
        weight,
        lockerNumber,
        lockerCode
      },
      { withCredentials: true }
    )
    .then(res => {
      return res.data;
    });
}

// Allows the admin or employee to update a user's profile settings
// The user portion can all be {} to update to a null user
async function updateUser(
  //below is in curly braces so you can send a user object that contains all inner variables
  {
    id,             //Required param to be able to update a user
    schoolId,       //Can only be changed with admin access
    firstName,
    lastName,
    address,
    city,
    state,
    zip,
    phone,
    gender,
    height,
    weight,
    lockerNumber,   //Can only be changed with admin or employee access
    lockerCode      //Can only be changed with admin or employee access
  }
) {
  return await axios
    .put(
      `${apiUrl}/users`,
      {
        schoolId,
        firstName,
        lastName,
        address,
        city,
        state,
        zip,
        phone,
        gender,
        height,
        weight,
        lockerNumber,
        lockerCode
      },
      { params: { id }, withCredentials: true }
    )
    .then(res => {
      return res.data;
    });
}

export { createUser, getUsers, getCurrentUser, updateCurrentUser, updateUser };
