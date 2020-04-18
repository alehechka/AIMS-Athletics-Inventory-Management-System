import * as CredentialAPI from "./credentials";
import * as UsersAPI from "./users";
import * as SportsAPI from "./sports";
import * as InventoryAPI from "./inventory";
import * as EquipmentAPI from "./equipment";
import * as OrganizationAPI from "./organization";
import * as TransactionAPI from "./transactions";
import { openDB } from "idb/with-async-ittr.js";
import axios from "axios";
import AxiosOffline from "axios-offline";

const domain =
  process.env.NODE_ENV === "production" ? "https://aims-backend-dot-aims-272900.appspot.com" : "http://localhost";

const port = process.env.NODE_ENV === "production" ? "" : ":5000";

const version = 1;

const apiUrl = `${domain}${port}/api/v${version}`;

const AxiosOfflineAdapter = AxiosOffline({
  defaultAdapter: axios.defaults.adapter, //require, basic adapter
  storageName: "axios-offline" //optional, default: "axios-stack"
});

let api = axios.create({
  adapter: AxiosOfflineAdapter,
  baseURL: apiUrl,
  withCredentials: true
});

function changeFavicon(src) {
  var link = document.createElement("link");
  var oldLink = document.getElementById("dynamic-favicon");
  link.id = "dynamic-favicon";
  link.rel = "shortcut icon";
  link.href = src;
  if (oldLink) {
    document.head.removeChild(oldLink);
  }
  document.head.appendChild(link);
}

function indexedDbExists() {
  return "indexedDB" in window;
}

async function createIndexedDB() {
  if (indexedDbExists()) {
    try {
      await openDB("AIMS", 1, {
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
          if (!db.objectStoreNames.contains("inventory")) {
            const store = db.createObjectStore("inventory", {
              // The 'id' property of the object will be the key.
              keyPath: "id",
              // If it isn't explicitly set, create a value by auto incrementing.
              autoIncrement: true
            });
            store.createIndex("id", "id");
            store.createIndex("name", "name");
          }
          if (!db.objectStoreNames.contains("sports")) {
            const store = db.createObjectStore("sports", {
              // The 'id' property of the object will be the key.
              keyPath: "id",
              // If it isn't explicitly set, create a value by auto incrementing.
              autoIncrement: true
            });
            store.createIndex("id", "id");
            store.createIndex("name", "name");
          }
        }
      });
    } catch (err) {
      console.error(err);
    }
  }
}

async function clearIndexedDB(tables) {
  if (indexedDbExists()) {
    const db = await openDB("AIMS", 1, {});
    for (let table of tables) {
      if (db.objectStoreNames.contains(table)) {
        let tx = await db.transaction(table, "readwrite");
        await tx.objectStore(table).clear();
        await tx.done;
      }
    }
    db.close();
  }
}

export {
  api,
  CredentialAPI,
  UsersAPI,
  SportsAPI,
  InventoryAPI,
  EquipmentAPI,
  TransactionAPI,
  OrganizationAPI,
  createIndexedDB,
  changeFavicon,
  indexedDbExists,
  clearIndexedDB
};
