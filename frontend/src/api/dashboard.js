import { api } from "./index";

async function getSportEquipmentStats() {
  return await api
    .get(`/dashboard/equipment`)
    .then((res) => {
      return res.data;
    });
}

export { getSportEquipmentStats };
