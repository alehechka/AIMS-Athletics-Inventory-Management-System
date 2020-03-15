import React from "react";

import { getUsers, createUser, getCurrentUser, updateCurrentUser, updateUser } from "../../api/users";

export default function Athletes(props) {
  return (
    <div>
      <h1>Athletes</h1>
      <button onClick={() => getUsers(null, null, null)}>Get Users</button>
      <button onClick={() => getCurrentUser()}>Get Current</button>
      <button onClick={() => createUser("test@test.com", null, null, {})}>Create User</button>
      <button onClick={() => updateCurrentUser({address: "Admin City"})}>Update Current</button>
      <button onClick={() => updateUser({id: 3, address: "Athlete Town"})}>Update User</button>
    </div>
  );
}
