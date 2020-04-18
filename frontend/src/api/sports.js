import { api } from "./index";

//Gets all sports in the user's organization
async function getSports() {
  return await api.get(`/sports`).then((res) => {
    return res.data;
  });
}

//Gets a single sport by ID
async function getSport(id) {
  return await api.get(`/sports`, { params: { id } }).then((res) => {
    return res.data;
  });
}

//Allows an admin to create a sport
async function createSport({ name, gender, icon }) {
  return await api.post(`/sports`, { name, gender, icon }).then((res) => {
    return res.data;
  });
}

//Allows an admin to update a sport
async function updateSport({ id, name, gender, icon }) {
  return await api.put(`/sports`, { name, gender, icon }, { params: { id } }).then((res) => {
    return res.data;
  });
}

//Allows an admin to delete a sport
// async function deleteSport(id) {
//   return await api.delete(`/sports`, { params: { id } }).then((res) => {
//     return res.data;
//   });
// }

//Allows an admin, employee, or coach to update the sports of a user
//Sports can either be an array of sport objects or an array of sportID's
//Array needs to contain the updated list of sports that the user will be part of
//Anything new will be added and anything missing will be deleted.
async function updateUserSports(userId, sports) {
  return await api.put(`/sports/user`, { sports }, { params: { userId } }).then((res) => {
    return res.data;
  });
}

export { getSports, getSport, createSport, updateSport, updateUserSports };
