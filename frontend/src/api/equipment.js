import { api } from "./index";

/**
 * Allows admins, employees, and coaches to view equipment of users
 * Coaches are limited to equipment of their sport
 * @param {object} equipmentDetail params to provide conditions to the query
 * @param {integer} page pagination page
 * @param {integer} limit pagination limit per page
 *
 * @return array of equipment
 */
async function getEquipment(
  {
    userId,
    sports,
    sportSizeId,
    inventoryId,
    taxable,
    surplus,
    expendable,
    count // will return items with count greater than or equal to provided (default is 1)
  },
  page,
  limit
) {
  sports = sports?.map((sport) => {
    return sport?.id ?? sport;
  });
  return await api
    .get(`/equipment`, {
      params: { page, limit, userId, sports, sportSizeId, inventoryId, taxable, surplus, expendable, count }
    })
    .then((res) => {
      return res.data;
    });
}

/**
 * Retrieves all equipment of the currently logged in user.
 * @param {object} count params to provide conditions to the query
 *
 * @return array of equipment
 */
async function getCurrentEquipment({
  count // will return items with count greater than or equal to provided (default is 1)
}) {
  return await api
    .get(`/equipment/current`, {
      params: { count }
    })
    .then((res) => {
      return res.data;
    });
}

export { getEquipment, getCurrentEquipment };
