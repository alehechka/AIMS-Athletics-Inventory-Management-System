import React from "react";
import MaterialTable from "material-table";

/** @module TransactionTable */

/**
 * Component for rendering the transaction table which displays all transactions
 * @param {Object} transactionData - Data for the transactions that were completed
 * @param {Boolean} isTransactionLoading - boolean for determing if the data is loading or not
 */
export default function TransactionTable({transactionData, isTransactionLoading}) {
  const transactionColumns = [
    { title: "ID", field: "id", hidden: true },
    { title: "Issued To", field: "IssuedTo.fullName", cellStyle: {width: "20%"} },
    { title: "Issued By", field: "IssuedBy.fullName", cellStyle: {width: "20%"} },
    { title: "Equipment", field: "equipment.inventorySize.inventory.name", cellStyle: {width: "25%"} },
    { title: "Size", field: "equipment.inventorySize.size", cellStyle: {width: "5%"}},
    { title: "Returned", field: "returned", type: "boolean"},
    { title: "Amount", field: "amount", type: "numeric" },
    { title: "Price", field: "price", type: "currency" },
  ];
  return (
    <MaterialTable
      title="Transactions"
      isLoading={isTransactionLoading}
      columns={transactionColumns}
      data={transactionData}
      options={{ tableLayout: "auto" }}
    />
  );
}
