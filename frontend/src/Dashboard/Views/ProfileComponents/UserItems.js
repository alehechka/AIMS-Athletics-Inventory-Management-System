import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import MaterialTable from "material-table";

// Formatter to make any currency exchanges simpler
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});

export default function UserItemCard(props) {
  const { firstName, equipment } = props;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {firstName}'s Equipment
        </Typography>

        <MaterialTable
          title = {""}
          columns={[
            { title: "Item", field: "name", cellStyle: {width:"100%"} },
            { title: "Size", field: "size" },
            { title: "Count", field: "count" },
            { title: "Value", field: "value", render: (rowData) => formatter.format(rowData.value) }
          ]}
          data={equipment?.map((item) => {
            return {
              name: item.inventorySize.inventory.description,
              size: item.inventorySize.size,
              count: item.count,
              value: item.inventorySize.price
            };
          })}
        />
      </CardContent>
    </Card>
  );
}
