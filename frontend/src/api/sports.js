import { api, indexedDbExists } from "./index";

import { openDB } from "idb/with-async-ittr.js";

//Gets all sports in the user's organization
async function getSports() {
  try {
    return await getSportsFromIndexedDB();
  } catch (err) {
    console.error(err);
    return await getSportsFromBackend();
  }
}

async function getSportsFromIndexedDB() {
  try {
    if (indexedDbExists()) {
      const db = await openDB("AIMS", 1, {});
      let dbSports = [];
      if (db.objectStoreNames.contains("sports")) {
        dbSports = await db.getAll("sports");
      }
      db.close();
      if (dbSports.length) {
        return dbSports;
      }
    }
    throw new Error("No entries found in local storage.");
  } catch (err) {
    throw err;
  }
}

async function getSportsFromBackend() {
  return await api.get(`/sports`).then((res) => {
    if (indexedDbExists()) {
      saveSportsToIndexedDB(res.data);
    }
    return res.data;
  });
}

async function saveSportsToIndexedDB(sports) {
  try {
    const db = await openDB("AIMS", 1, {});
    {
      const tx = await db.transaction("sports", "readwrite");
      await tx.objectStore("sports").clear();
      for (let sport of sports) {
        tx.store.add(sport);
      }
      await tx.done;
    }
    db.close();
  } catch (err) {
    console.error(err);
  }
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
    if(indexedDbExists()) {
      insertSportIndexedDB(res.data);
    }
    return res.data;
  });
}

//Allows an admin to update a sport
async function updateSport({ id, name, gender, icon }) {
  return await api.put(`/sports`, { name, gender, icon }, { params: { id } }).then((res) => {
    if(indexedDbExists()) {
      updateSportIndexedDB(res.data);
    }
    return res.data;
  });
}

async function insertSportIndexedDB(sport) {
  const db = await openDB("AIMS", 1, {});
  const tx = await db.transaction("sports", "readwrite");
  tx.store.add(sport);
  await tx.done;
  db.close();
}

async function updateSportIndexedDB(sport) {
  const db = await openDB("AIMS", 1, {});
  const tx = await db.transaction("sports", "readwrite");
  const index = tx.store.index("id");
  for await (const cursor of index.iterate()) {
    let item = { ...cursor.value };
    if (item.id === sport.id) {
      cursor.update(sport);
    }
  }
  await tx.done;
  db.close();
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

export { getSports, getSport, createSport, updateSport, updateUserSports, getSportsFromBackend };
