import axios from "axios";

import { apiUrl } from "./index";

// Allows an admin to create a user profile with temporary credentials
// Only required field is the email, username can be generated from email
// If password is null will be auto set to "password123"
// The user portion can all be {} to create null user
async function createUser(
  email,
  username,
  password,
  isAdmin,
  isEmployee,
  isCoach,
  isAthlete,
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
    lockerCode,
    isActive,
    status,
    sports,
    userSizes,
  }
) {
  return await axios
    .post(
      `${apiUrl}/users`,
      {
        email,
        username,
        password,
        isAdmin,
        isEmployee,
        isCoach,
        isAthlete,
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
        lockerCode,
        isActive,
        statusId: status?.id,
        sports,
        userSizes
      },
      { withCredentials: true }
    )
    .then(res => {
      return res.data;
    });
}

// Retreives a a single user profile with full details (more for Admins)
async function getSingleUser(id) {
  return await axios
    .get(`${apiUrl}/users`, {
      params: { id },
      withCredentials: true
    })
    .then(res => {
      return res.data;
    });
}

// Retreives a list of users that the current user has access to (based on role or sport if coach)
// The page and limit parameters are used for pagination (supply null to default to 200 user response)
async function getUsers(page, limit, {gender, sports, isAdmin, isEmployee, isCoach, isAthlete, withDetails=[]}) {
  sports = sports?.map((sport) => {
    return sport?.id ?? sport;
  });
  return await axios
    .get(`${apiUrl}/users`, {
      params: { page, limit, gender, sports, isAdmin, isEmployee, isCoach, isAthlete, withDetails },
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
    lockerCode, //Can only be changed with admin or employee access
    isActive,
    status,
    sports,
    userSizes
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
        lockerCode,
        isActive,
        statusId: status?.id,
        sports,
        userSizes
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
    lockerCode,      //Can only be changed with admin or employee access
    isActive,
    status,
    sports,
    userSizes,
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
        lockerCode,
        isActive,
        statusId: status?.id,
        sports,
        userSizes
      },
      { params: { id }, withCredentials: true }
    )
    .then(res => {
      return res.data;
    });
}

export { createUser, getUsers, getSingleUser, getCurrentUser, updateCurrentUser, updateUser };
