import React from "react";
import { UsersAPI, SportsAPI, CredentialAPI, InventoryAPI } from "../../api";

export default function Home(props) {
  return (
    <div>
      <h1>Home</h1>
      <button
        onClick={() =>
          UsersAPI.getUsers(null, null, { isAdmin: false, isEmployee: false, isCoach: false, isAthlete: false })
        }
      >
        Get Users
      </button>
      <button onClick={() => UsersAPI.getSingleUser(5)}>Get Single User</button>
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
      <button onClick={() => SportsAPI.updateUserSports(5, [1])}>Update User Sports</button>
      <br />
      <br />
      <button onClick={() => CredentialAPI.changePassword("test", "admin")}>Change Password</button>
      <br />
      <br />
      <button onClick={() => InventoryAPI.getInventory(null, null, {})}>Get Inventory</button>
      <button
        onClick={() =>
          InventoryAPI.createInventory({
            name: "Game Jersey",
            description: "Home Game Jersey",
            surplus: false,
            taxable: false,
            expendable: false,
            sportSize: 1,
            inventorySizes: [{ size: "M", price: 40.35, quantity: 25 }]
          })
        }
      >
        Create Inventory
      </button>
      <button
        onClick={() =>
          InventoryAPI.updateInventory({
            id: 2,
            name: "Game Jersey",
            description: "Away Game Jersey",
            surplus: true,
            taxable: true,
            expendable: true,
            sportSize: 2,
            inventorySizes: [{ id: 3, size: "XL", price: 50.25, quantity: 10 }]
          })
        }
      >
        Update Inventory
      </button>
      <br />
      <br />
      <button onClick={() => CredentialAPI.changeFavicon("assets/creighton.ico")}>Change Favicon</button>

      <button onClick={() => props.history.push("/athletes")}>Athletes</button>
    </div>
  );
}
