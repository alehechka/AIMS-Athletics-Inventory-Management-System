import axios from "axios";

import { apiUrl } from "./index";

/**
 *
 * All authorization is handled by the HttpOnly cookie: Authorization.
 *
 * Cookies will be sent with all API requests
 *
 */

//Gets all sports in the user's organization
async function getSports() {
  return await axios.get(`${apiUrl}/sports`, { withCredentials: true }).then((res) => {
    return res.data;
  });
}

//Gets a single sport by ID
async function getSport(id) {
  return await axios.get(`${apiUrl}/sports/${id}`, { withCredentials: true }).then((res) => {
    return res.data;
  });
}

//Allows an admin to create a sport
async function createSport({ name, gender }) {
  return await axios.post(`${apiUrl}/sports`, { name, gender }, { withCredentials: true }).then((res) => {
    return res.data;
  });
}

//Allows an admin to update a sport
async function updateSport({ id, name, gender }) {
  return await axios.put(`${apiUrl}/sports/${id}`, { name, gender }, { withCredentials: true }).then((res) => {
    return res.data;
  });
}

//Allows an admin to delete a sport
async function deleteSport(id) {
  return await axios.delete(`${apiUrl}/sports/${id}`, { withCredentials: true }).then((res) => {
    return res.data;
  });
}

//Allows an admin, employee, or coach to update the sports of a user
//Sports can either be an array of sport objects or an array of sportID's
async function updateUserSports(userId, sports) {
  if(sports.length > 0 && typeof sports[0] === "object") {
    sports = sports.map(sport => sport.id);
  }
  return await axios.put(`${apiUrl}/sports/user/${userId}`, { sports }, { withCredentials: true }).then((res) => {
    return res.data;
  });
}

export { getSports, getSport, createSport, updateSport, deleteSport, updateUserSports };
