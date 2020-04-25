import React from "react";
import MaterialTable from "material-table";

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
