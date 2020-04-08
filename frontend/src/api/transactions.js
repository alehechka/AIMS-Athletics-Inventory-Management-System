import axios from "axios";

import { apiUrl } from "./index";

//Gets all transactions based on provided filters
async function getTransactions({ issuedBy, issuedTo, returned, createdBegin, createdEnd, sports }, page, limit) {
  sports = sports?.map((sport) => {
    return sport?.id ?? sport;
  });
  return await axios
    .get(`${apiUrl}/transactions`, {
      params: { page, limit, issuedBy, issuedTo, returned, createdBegin, createdEnd, sports },
      withCredentials: true
    })
    .then((res) => {
      return res.data;
    });
}

async function checkOut(transactions, comment) {
  for (let tran of transactions) {
    tran.issuedTo = tran.issuedTo.id || tran.issuedTo;
    for (let item of tran.items) {
      item.inventorySize = item.inventorySize.id || item.inventorySize;
    }
  }
  return await axios
    .post(
      `${apiUrl}/transactions/checkOut`,
      {
        comment,
        transactions
      },
      {
        withCredentials: true
      }
    )
    .then((res) => {
      return res.data;
    });
}

async function checkIn(transactions, comment) {
  for (let tran of transactions) {
    tran.issuedTo = tran.issuedTo.id || tran.issuedTo;
    for (let item of tran.items) {
      item.equipment = item.equipment.id || item.equipment;
    }
  }
  return await axios
  .post(
    `${apiUrl}/transactions/checkIn`,
    {
      comment,
      transactions,
    },
    {
      withCredentials: true
    }
  )
  .then((res) => {
    return res.data;
  })
}

export { getTransactions, checkOut, checkIn };
