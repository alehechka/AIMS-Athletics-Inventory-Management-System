import { api } from "./index";

//Gets all inventory items in the based on pagination and filters provided
async function getInventory(page, limit, { id, surplus, sportSize, sports, gender, taxable, expendable }) {
  let sportSizeId = sportSize?.id ?? sportSize;
  sports = sports?.map((sport) => {
    return sport?.id ?? sport;
  });
  return await api
    .get(`/inventory`, {
      params: { page, limit, id, surplus, sportSizeId, gender, sports, taxable, expendable }
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
      return res.data;
    });
}

export { getInventory, createInventory, updateInventory };
