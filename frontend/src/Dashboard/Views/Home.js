import React from "react";
import {
  UsersAPI,
  SportsAPI,
  CredentialAPI,
  InventoryAPI,
  changeFavicon,
  EquipmentAPI,
  TransactionAPI
} from "../../api";

export default function Home(props) {
  const user = {
    id: 1,
    firstName: "Adam"
  }
  const inventories = {
    id: 1,
    name: "T-Shirt",
    inventorySizes: [
      {
        id: 1,
        size: "XL",
        price: 20.00,
        quantity: 10
      }
    ]
  }
  const selectedInventorySize = {
    id: 3,
    size: "M",
    price: 25.00,
    quantity: 20
  }
  const transactions = [
    {
      issuedTo: user,
      items: [
        {
          inventorySize: inventories.inventorySizes[0],
          amount: 2
        },
        {
          inventorySize: selectedInventorySize,
          amount: 1
        }
      ]
    }
  ];
  const transactions2 = [
    {
      issuedTo: user,
      items: [
        {
          equipment: {id: 1},
          amount: 2
        },
      ]
    }
  ];
  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => UsersAPI.getUsers(null, null, {withDetails:["UserSize","Equipment"]})}>Get Users</button>
      <button onClick={() => UsersAPI.getSingleUser(7)}>Get Single User</button>
      <button onClick={() => UsersAPI.getCurrentUser()}>Get Current</button>
      <button onClick={() => UsersAPI.createUser("test8@test.com", null, "password", false, false, false, true, { sports: [2, { id: 3 }], phone: 1234567891 })}>
        Create User
      </button>
      <button
        onClick={() =>
          UsersAPI.updateCurrentUser({ address: "Admin City", userSizes: [{ size: "L", sportSizeId: 2 }] })
        }
      >
        Update Current
      </button>
      <button onClick={() => UsersAPI.updateUser({ id: 3, address: "Athlete Town" })}>Update User</button>
      <br />
      <br />
      <button onClick={() => SportsAPI.getSports()}>Get Sports</button>
      <button onClick={() => SportsAPI.getSport(1)}>Get Sport</button>
      <button onClick={() => SportsAPI.createSport({ name: "Football", gender: "M" })}>Create Sport</button>
      <button onClick={() => SportsAPI.updateSport({ id: 1, name: "Administration", gender: "M" })}>
        Update Sport
      </button>
      <br />
      <br />
      <button onClick={() => SportsAPI.updateUserSports(4, [3, { id: 2 }])}>Update User Sports</button>
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
      <button onClick={() => EquipmentAPI.getEquipment({ sports: [1, { id: 2 }] })}>Get Equipment</button>
      <button onClick={() => EquipmentAPI.getCurrentEquipment({ count: 0 })}>Get Current Equipment</button>
      <br />
      <br />
      <button onClick={() => TransactionAPI.getTransactions({})}>Get Transactions</button>
      <button onClick={() => TransactionAPI.checkOut(transactions, "comment")}>Check out</button>
      <button onClick={() => TransactionAPI.checkIn(transactions2, "comment")}>Check in</button>
      <br />
      <br />
      <button onClick={() => changeFavicon("assets/creighton.ico")}>Change Favicon</button>
    </div>
  );
}
