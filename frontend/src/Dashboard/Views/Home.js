import React from "react";
import { UsersAPI, SportsAPI, CredentialAPI } from '../../api';

export default function Home(props) {
  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => UsersAPI.getUsers(null, null, {sports: [3,{id:2},1]})}>Get Users</button>
      <button onClick={() => UsersAPI.getSingleUser(1)}>Get Single User</button>
      <button onClick={() => UsersAPI.getCurrentUser()}>Get Current</button>
      <button onClick={() => UsersAPI.createUser("test@test.com", null, null, {})}>Create User</button>
      <button onClick={() => UsersAPI.updateCurrentUser({ address: "Admin City" })}>Update Current</button>
      <button onClick={() => UsersAPI.updateUser({ id: 3, address: "Athlete Town" })}>Update User</button>
      <br />
      <br />
      <button onClick={() => SportsAPI.getSports()}>Get Sports</button>
      <button onClick={() => SportsAPI.getSport(1)}>Get Sport</button>
      <button onClick={() => SportsAPI.createSport({ name: "Football", gender: "M" })}>Create Sport</button>
      <button onClick={() => SportsAPI.updateSport({ id: 1, name: "Baseball", gender: "M" })}>Update Sport</button>
      <button onClick={() => SportsAPI.deleteSport(4)}>Delete Sport</button>
      <br />
      <br />
      <button onClick={() => SportsAPI.updateUserSports(1, [1,{id: 2}])}>Update User Sports</button>
      <br />
      <br />
      <button onClick={() => CredentialAPI.changePassword("admin", "test")}>Change Password</button>
    </div>
  );
}
