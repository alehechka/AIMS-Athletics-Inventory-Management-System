import * as CredentialAPI from "./credentials";
import * as UsersAPI from "./users";
import * as SportsAPI from "./sports";
import * as InventoryAPI from "./inventory";

const domain = process.env.NODE_ENV === "production" ? "" : "http://localhost";

const port = process.env.NODE_ENV === "production" ? 5001 : 5000;

const version = 1;

const apiUrl = `${domain}:${port}/api/v${version}`;

function changeFavicon(src) {
  var link = document.createElement("link"),
    oldLink = document.getElementById("dynamic-favicon");
  link.id = "dynamic-favicon";
  link.rel = "shortcut icon";
  link.href = src;
  if (oldLink) {
    document.head.removeChild(oldLink);
  }
  document.head.appendChild(link);
}

export { apiUrl, CredentialAPI, UsersAPI, SportsAPI, InventoryAPI, changeFavicon };
