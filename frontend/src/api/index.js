import * as CredentialAPI from "./credentials";
import * as UsersAPI from "./users";
import * as SportsAPI from "./sports";
import * as InventoryAPI from "./inventory";

const domain = process.env.NODE_ENV === "production" ? "" : "http://localhost";

const port = process.env.NODE_ENV === "production" ? 5001 :  5000;

const version = 1;

const apiUrl = `${domain}:${port}/api/v${version}`

export { apiUrl, CredentialAPI, UsersAPI, SportsAPI, InventoryAPI };