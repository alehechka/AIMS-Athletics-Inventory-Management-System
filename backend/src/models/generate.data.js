"use strict";

const db = require("./database");

const {
  credentials,
  users,
  sports,
  inventories,
  statuses,
  organizations,
  sport_sizes
} = require("./data.json");

const createOrganizations = async () => {
  for (let org of organizations) {
    await db.Organization.create({
      name: org.name,
      shortName: org.shortName, 
      logo: org.logo
    }).then(res => {
      org.id = res.id;
    });
  }
};

const createStatuses = async () => {
  for (let status of statuses) {
    await db.Status.create({
      name: status.name,
      academicYear: status.academicYear
    }).then(res => {
      status.id = res.id;
    });
  }
};

const createSports = async () => {
  for (let sport of sports) {
    await db.Sport.create({
      name: sport.name,
      gender: sport.gender,
      organizationId: organizations[0].id
    }).then(res => {
      sport.id = res.id;
    });
  }
};

const createSportSizes = async () => {
  for (let index in sport_sizes) {
    await db.SportSize.create({
      name: sport_sizes[index].name,
      sizes: sport_sizes[index].sizes,
      sportId: sports[index % sports.length].id
    }).then(res => {
      sport_sizes[index].id = res.id;
    });
  }
};

const createInventories = async () => {
  for (let index in inventories) {
    await db.Inventory.create({
      ...inventories[index],
      sportSizeId: sport_sizes[index % sport_sizes.length].id,
      organizationId: organizations[0].id
    }).then(async res => {
      inventories[index].id = res.id;
      for (let i in inventories[index].sizes) {
        await db.InventorySize.create({
          ...inventories[index].sizes[i],
          inventoryId: inventories[index].id,
        }).then(resp => {
          inventories[index].sizes[i].id = resp.id
        })
      }
    });
  }
};

const create = async () => {
  await createOrganizations();
  await createStatuses();
  await createSports();
  await createSportSizes()
  await createInventories();

  for(let index in credentials) {
    let cred = credentials[index];
    await db.Credential.create({
      ...cred,
      password: await db.hashPassword(cred.password),
      organizationId: organizations[0].id
    })
      .then(async created => {
        await db.User.create({
          ...users[index],
          credentialId: created.id,
          statusId: statuses[index % statuses.length].id,
          organizationId: created.organizationId
        })
          .then(async res => {
            users[index].id = res.id;
            await db.UserSport.create({
              userId: res.id,
              sportId: sports[0].id
            });
            await db.UserSport.create({
              userId: res.id,
              sportId: sports[(index % (sports.length -1))+1].id
            });
            await db.UserSize.create({
              userId: res.id,
              sportSizeId: sport_sizes[index % sport_sizes.length].id,
              size: sport_sizes[index % sport_sizes.length].sizes[0]
            });
            let eq = await db.Equipment.create({
              size: inventories[index % inventories.length].size,
              count: index,
              userId: users[index].id,
              inventorySizeId: inventories[index % inventories.length].sizes[0].id,
              organizationId: organizations[0].id
            });
            await db.Transaction.create({
              amount: index,
              return: index % 2,
              equipmentId: eq.id,
              issuedBy: users[index].id,
              issuedTo: users[index].id,
              organizationId: organizations[0].id
            });
          })
          .catch(err => {
            console.error("User already exists: " + users[index].id);
          });
      })
      .catch(err => {
        console.error(err);
        console.error("Cred already exists: " + cred.email);
      });
  }
};

const creightonAccount = async () => {
  let sport = await db.Sport.create({
    name: "Admin",
    organizationId: 2
  });
  await db.Credential.create({
    email: "creighton@creighton.edu",
    username: "cu",
    password: await db.hashPassword("cu"),
    isAdmin: true,
    organizationId: 2
  }).then(async res => {
    await db.User.create({
      credentialId: res.id,
      firstName: "Creighton",
      lastName: "Account",
      organizationId: 2,
      statusId: 1
    }).then(async res => {
      await db.UserSport.create({
        userId: res.id,
        sportId: sport.id
      })
    })
  })
}

const main = async () => {
  console.log("Syncing database...");
  await db.db.sync({ force: true, alter: true });
  console.log("Database sync complete.");
  console.log("\nPopulating data...");
  await create();
  await creightonAccount();
  console.log("Data population complete.");
  console.log("\nClosing database connection...");
  await db.db.close();
  console.log("Database connection closed.")
}

main();
