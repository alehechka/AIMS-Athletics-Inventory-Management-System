import React from "react";
import MaterialTable from "material-table";

export default function TransactionTable({transactionData, isTransactionLoading}) {
  const transactionColumns = [
    { title: "ID", field: "id", hidden: true },
    { title: "Issued To", field: "issuedTo" },
    { title: "Issued By", field: "issuedBy" },
    { title: "Equipment ID", field: "equipmentId" },
    { title: "Amount", field: "amount" },
    { title: "Returned", field: "returned"}
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
