import * as CredentialAPI from "./credentials";
import * as UsersAPI from "./users";
import * as SportsAPI from "./sports";
import * as InventoryAPI from "./inventory";
import * as EquipmentAPI from "./equipment";
import * as OrganizationAPI from "./organization";
import * as TransactionAPI from "./transactions";

const domain = process.env.NODE_ENV === "production" ? "https://aims-backend-dot-aims-272900.appspot.com" : "http://localhost";

const port = process.env.NODE_ENV === "production" ? "" : ":5000";

const version = 1;

const apiUrl = `${domain}${port}/api/v${version}`;

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
  return ('indexedDB' in window)
 }

export { apiUrl, CredentialAPI, UsersAPI, SportsAPI, InventoryAPI, EquipmentAPI, TransactionAPI, OrganizationAPI, changeFavicon, indexedDbExists };
