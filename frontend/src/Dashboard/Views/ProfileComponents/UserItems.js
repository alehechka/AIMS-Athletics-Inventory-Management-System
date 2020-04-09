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
  const { username, equipment } = props;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {username}'s Equipment
        </Typography>

        <MaterialTable
          columns={[
            { title: "Item", field: "name" },
            { title: "Size", field: "size" },
            { title: "Count", field: "count" },
            { title: "Value", field: "value", render: (rowData) => formatter.format(rowData.value) }
          ]}
          data={equipment.map((item) => {
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
