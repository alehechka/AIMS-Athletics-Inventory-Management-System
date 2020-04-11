import React from "react";
import MaterialTable from "material-table";

export default function TransactionTable({transactionData, transactionColumns, isTransactionLoading}) {
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
