import axios from "axios";

import { apiUrl } from "./index";

//Gets all sports in the user's organization
async function getSports() {
  return await axios.get(`${apiUrl}/sports`, { withCredentials: true }).then((res) => {
    return res.data;
  });
}

//Gets a single sport by ID
async function getSport(id) {
  return await axios.get(`${apiUrl}/sports/`, { params: { id }, withCredentials: true }).then((res) => {
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
  return await axios
    .put(`${apiUrl}/sports`, { name, gender }, { params: { id }, withCredentials: true })
    .then((res) => {
      return res.data;
    });
}

//Allows an admin to delete a sport
// async function deleteSport(id) {
//   return await axios.delete(`${apiUrl}/sports`, { params: { id }, withCredentials: true }).then((res) => {
//     return res.data;
//   });
// }

//Allows an admin, employee, or coach to update the sports of a user
//Sports can either be an array of sport objects or an array of sportID's
//Array needs to contain the updated list of sports that the user will be part of
  //Anything new will be added and anything missing will be deleted.
async function updateUserSports(userId, sports) {
  return await axios
    .put(`${apiUrl}/sports/user`, { sports }, { params: { userId }, withCredentials: true })
    .then((res) => {
      return res.data;
    });
}

export { getSports, getSport, createSport, updateSport, updateUserSports };
