import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import MaterialTable from "material-table";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});

/***
 * Contains the MaterialTable that displays paginated items checked out to the user.
 * Currently it is not possible to check items in or out from this interface. *
 *
 * @param {Object} props - props passed down from Profile
 * @param {Function} props.showMessage - Helper function to display snackbar message.
 * @param {Object} props.context - Context variable containing all relevant user information.
 */
export default function UserItemCard(props) {
  const { firstName, equipment } = props;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {firstName}'s Equipment
        </Typography>

        <MaterialTable
          title={""}
          columns={[
            { title: "Item", field: "name", cellStyle: { width: "100%" } },
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
