import { api } from "./index";

//Gets all transactions based on provided filters
async function getTransactions({ issuedBy, issuedTo, returned, createdBegin, createdEnd, sports }, page, limit) {
  sports = sports?.map((sport) => {
    return sport?.id ?? sport;
  });
  return await api
    .get(`/transactions`, {
      params: { page, limit, issuedBy, issuedTo, returned, createdBegin, createdEnd, sports }
    })
    .then((res) => {
      return res.data;
    });
}

async function checkOut(transactions, comment) {
  transactions = transactions.map((tran) => {
    return {
      issuedTo: tran.user.id || tran.user,
      items: tran.items
        .filter((item) => item.checked)
        .map((item) => {
          return {
            amount: item.amount,
            inventorySize: item.inventorySize?.id || item.inventorySize
          };
        })
    };
  });
  return await api
    .post(
      `/transactions/checkOut`,
      {
        comment,
        transactions
      }
    )
    .then((res) => {
      return res.data;
    });
}

async function checkIn(transactions, comment) {
  transactions = transactions.map((tran) => {
    return {
      issuedTo: tran.user.id || tran.user,
      items: tran.items
        .filter((item) => item.checked)
        .map((item) => {
          return {
            amount: item.amount,
            equipment: item.equipment?.id || item.equipment
          };
        })
    };
  });

  return await api
    .post(
      `/transactions/checkIn`,
      {
        comment,
        transactions
      }
    )
    .then((res) => {
      return res.data;
    });
}

export { getTransactions, checkOut, checkIn };
