import { api, indexedDbExists } from "./index";

import { openDB } from "idb/with-async-ittr.js";

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
    userSizes
  }
) {
  return await api
    .post(
      `/users`,
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
      }
    )
    .then(async (res) => {
      if(indexedDbExists()) {
        insertIndexedDB(res.data);
      }
      return res.data;
    });
}

// Retreives a a single user profile with full details (more for Admins)
async function getSingleUser(id) {
  try {
    return await getSingleUserFromIndexedDB(id);
  } catch(err) {
    return await getSingleUserFromBackend(id);
  }
}

async function getSingleUserFromIndexedDB(id) {
  try {
    if (indexedDbExists()) {
      const db = await openDB("AIMS", 1, {});
      let dbUser;
      if (db.objectStoreNames.contains("users")) {
        dbUser = await db.getAllFromIndex("users", "id", parseInt(id));
      }
      db.close();
      if(dbUser.length) {
        return dbUser[0];
      }
    }
    throw new Error("No entries in local storage.");
  } catch (err) {
    throw err;
  }
}

async function getSingleUserFromBackend(id) {
  return await api
    .get(`/users`, {
      params: { id }
    })
    .then((res) => {
      return res.data;
    });
}

async function getUsers(page, limit, userDetails) {
  try {
    return await getUsersFromIndexedDB(page, limit, userDetails);
  } catch (err) {
    console.log(err)
    return await getUsersFromBackend(page, limit, userDetails);
  }
}

async function getUsersFromIndexedDB(page, limit, { gender, sports, isAdmin, isEmployee, isCoach, isAthlete }) {
  try {
    if (indexedDbExists()) {
      const db = await openDB("AIMS", 1, {});
      let dbUsers = [];
      if (db.objectStoreNames.contains("users")) {
        dbUsers = await db.getAll("users");
      }
      db.close();
      if (dbUsers.length) {
        let users = [];
        for(let user of dbUsers) {
          if(gender && !(user.gender === gender)) continue;
          if(isAdmin && user.credential.isAdmin === isAdmin) {users.push(user); continue;}
          if(isEmployee && user.credential.isEmployee === isEmployee) {users.push(user); continue;}
          if(isCoach && user.credential.isCoach === isCoach) {users.push(user); continue;}
          if(isAthlete && user.credential.isAthlete === isAthlete) {users.push(user); continue;}
        }
        return users;
      }
    }
    throw new Error("No entries in local storage.");
  } catch (err) {
    throw err;
  }
}

// Retreives a list of users that the current user has access to (based on role or sport if coach)
// The page and limit parameters are used for pagination (supply null to default to 200 user response)
async function getUsersFromBackend(
  page,
  limit,
  { gender, sports, isAdmin, isEmployee, isCoach, isAthlete, withDetails = [] }
) {
  sports = sports?.map((sport) => {
    return sport?.id ?? sport;
  });
  return await api
    .get(`/users`, {
      params: { page, limit, gender, sports, isAdmin, isEmployee, isCoach, isAthlete, withDetails }
    })
    .then(async (res) => {
      if (indexedDbExists()) {
        saveUsersToLocalDB(res.data);
      }
      return res.data;
    });
}

async function saveUsersToLocalDB(users) {
  try {
    const db = await openDB("AIMS", 1, {
      upgrade(db) {
        // Create a store of objects
        if (!db.objectStoreNames.contains("users")) {
          const store = db.createObjectStore("users", {
            // The 'id' property of the object will be the key.
            keyPath: "id",
            // If it isn't explicitly set, create a value by auto incrementing.
            autoIncrement: true
          });
          store.createIndex("id", "id");
          store.createIndex("firstName", "firstName");
          store.createIndex("lastName", "lastName");
        }
      }
    });

    {
      const tx = await db.transaction("users", "readwrite");
      await tx.objectStore("users").clear();
      for (let user of users) {
        tx.store.add(user);
      }
      await tx.done;
    }
    db.close();
  } catch (err) {
    console.log(err);
  }
}

async function getCurrentUser() {
  return await api.get(`/users/current`).then((res) => {
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
  return await api
    .put(
      `/users/current`,
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
      }
    )
    .then(async (res) => {
      if (indexedDbExists()) {
        await updateIndexedDB(res.data);
      }
      return res.data;
    });
}

// Allows the admin or employee to update a user's profile settings
// The user portion can all be {} to update to a null user
async function updateUser(
  //below is in curly braces so you can send a user object that contains all inner variables
  {
    id, //Required param to be able to update a user
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
  return await api
    .put(
      `/users`,
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
      { params: { id } }
    )
    .then(async (res) => {
      if (indexedDbExists()) {
        await updateIndexedDB(res.data);
      }
      return res.data;
    });
}

async function updateIndexedDB(user) {
  const db = await openDB("AIMS", 1, {});
    const tx = await db.transaction("users", "readwrite");
    const index = tx.store.index('id');
    for await (const cursor of index.iterate()) {
      let dbUser = { ...cursor.value };
      if(dbUser.id === user.id) {
        cursor.update(user);
      }
    }
    await tx.done;
  db.close();
}

async function insertIndexedDB(user) {
  const db = await openDB("AIMS", 1, {});
    const tx = await db.transaction("users", "readwrite");
    tx.store.add(user);
    await tx.done;
  db.close();
}

export { createUser, getUsers, getUsersFromBackend, getSingleUser, getCurrentUser, updateCurrentUser, updateUser };
