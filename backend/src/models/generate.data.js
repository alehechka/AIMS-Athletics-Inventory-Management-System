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
      shortName: org.shortName
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
      sportId: sports[index % sports.length].id,
      organizationId: organizations[0].id
    }).then(res => {
      inventories[index].id = res.id;
    });
  }
};

const create = async () => {
  await createOrganizations();
  await createStatuses();
  await createSports();
  await createSportSizes()
  await createInventories();

  credentials.forEach((cred, index) => {
    db.Credential.create({
      ...cred,
      organizationId: organizations[0].id
    })
      .then(async created => {
        await db.User.create({
          ...users[index],
          credentialId: created.id,
          statusId: statuses[index % statuses.length].id,
          organizationId: organizations[0].id
        })
          .then(async res => {
            users[index].id = res.id;
            await db.PlayerSport.create({
              userId: res.id,
              sportId: sports[index % sports.length].id
            });
            await db.PlayerSize.create({
              userId: res.id,
              sportSizeId: sport_sizes[index % sport_sizes.length].id,
              size: sport_sizes[index % sport_sizes.length].sizes[0]
            });
            let eq = await db.Equipment.create({
              size: inventories[index % inventories.length].size,
              count: index,
              userId: users[index].id,
              inventoryId: inventories[index % inventories.length].id,
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
        console.error("Cred already exists: " + cred.email);
      });
  });
};
create();

//db.db.close();
