import { api, indexedDbExists } from "./index";

import { openDB } from "idb/with-async-ittr.js";

async function getInventory(page, limit, inventoryDetails) {
  try {
    return await getInventoryFromIndexedDB(page, limit, inventoryDetails);
  } catch (err) {
    console.error(err);
    return await getInventoryFromBackend(page, limit, inventoryDetails);
  }
}

async function getInventoryFromIndexedDB(page, limit, { id, surplus, sportSize, sports, gender, taxable, expendable }) {
  try {
    if (indexedDbExists()) {
      const db = await openDB("AIMS", 1, {});
      let dbInventory = [];
      if (db.objectStoreNames.contains("inventory")) {
        dbInventory = await db.getAll("inventory");
      }
      db.close();
      if (dbInventory.length) {
        return dbInventory;
      }
    }
    throw new Error("No entries found in local storage.");
  } catch (err) {
    throw err;
  }
}

//Gets all inventory items in the based on pagination and filters provided
async function getInventoryFromBackend(page, limit, { id, surplus, sportSize, sports, gender, taxable, expendable }) {
  let sportSizeId = sportSize?.id ?? sportSize;
  sports = sports?.map((sport) => {
    return sport?.id ?? sport;
  });
  return await api
    .get(`/inventory`, {
      params: { page, limit, id, surplus, sportSizeId, gender, sports, taxable, expendable }
    })
    .then((res) => {
      if (indexedDbExists()) {
        saveInventoryToIndexedDB(res.data);
      }
      return res.data;
    });
}

async function saveInventoryToIndexedDB(inventory) {
  try {
    const db = await openDB("AIMS", 1, {});

    {
      const tx = await db.transaction("inventory", "readwrite");
      await tx.objectStore("inventory").clear();
      for (let item of inventory) {
        tx.store.add(item);
      }
      await tx.done;
    }
    db.close();
  } catch (err) {
    console.log(err);
  }
}

async function getSingleInventory(id) {
  try {
    return await getSingleInventoryIndexedDB(id);
  } catch (err) {
    return await getSingleInventoryBackend(id);
  }
}

async function getSingleInventoryIndexedDB(id) {
  try {
    if (indexedDbExists()) {
      const db = await openDB("AIMS", 1, {});
      let dbInventory;
      if (db.objectStoreNames.contains("inventory")) {
        dbInventory = await db.getAllFromIndex("inventory", "id", parseInt(id));
      }
      db.close();
      if (dbInventory.length) {
        return dbInventory[0];
      }
    }
    throw new Error("No entries in local storage.");
  } catch (err) {
    throw err;
  }
}

async function getSingleInventoryBackend(id) {
  return await api
    .get(`/inventory`, {
      params: { id }
    })
    .then((res) => {
      return res.data;
    });
}

//Creates inventory item
async function createInventory({ name, description, surplus, sportSize, taxable, expendable, inventorySizes }) {
  /* inventorySizes: [
        {
            size: "string",
            barcode: "string",
            price: double,
            quantity: integer
        }
    ] */
  let sportSizeId = sportSize?.id ?? sportSize;
  return await api
    .post(`/inventory`, {
      name,
      description,
      surplus,
      taxable,
      expendable,
      sportSizeId,
      inventorySizes
    })
    .then((res) => {
      if (indexedDbExists()) {
        insertInventoryIndexedDB(res.data);
      }
      return res.data;
    });
}

//Updates an inventory item
//Any inventorySize objects removed from the array will be deleted
//Any inventroySize objects with NO ID will be created
//Any inventorySize objects with an ID will be updated
async function updateInventory({ id, name, description, surplus, sportSize, taxable, expendable, inventorySizes }) {
  /* inventorySizes: [
          {
              id: integer
              size: "string",
              barcode: "string",
              price: double,
              quantity: integer
          }
      ] */
  let sportSizeId = sportSize?.id ?? sportSize;
  return await api
    .put(
      `/inventory`,
      {
        name,
        description,
        surplus,
        taxable,
        expendable,
        sportSizeId,
        inventorySizes
      },
      { params: { id } }
    )
    .then((res) => {
      if (indexedDbExists()) {
        updateInventoryIndexedDB(res.data);
      }
      return res.data;
    });
}

async function insertInventoryIndexedDB(inventory) {
  const db = await openDB("AIMS", 1, {});
  const tx = await db.transaction("inventory", "readwrite");
  tx.store.add(inventory);
  await tx.done;
  db.close();
}

async function updateInventoryIndexedDB(inventory) {
  const db = await openDB("AIMS", 1, {});
  const tx = await db.transaction("inventory", "readwrite");
  const index = tx.store.index("id");
  for await (const cursor of index.iterate()) {
    let item = { ...cursor.value };
    if (item.id === inventory.id) {
      cursor.update(inventory);
    }
  }
  await tx.done;
  db.close();
}

export { getInventory, createInventory, updateInventory, getInventoryFromBackend, getSingleInventory };
