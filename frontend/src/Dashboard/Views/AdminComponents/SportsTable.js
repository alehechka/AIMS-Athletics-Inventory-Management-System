import React from "react";
import MaterialTable from "material-table";
import { SportsAPI } from "../../../api";
import SizesDialog from "./SizesDialog";

export default function SportsTable(props) {
  const [isSportsLoading, updateSportsLoading] = [props.isSportsLoading, props.updateSportsLoading];
  const [sportsData, updateSportsData] = [props.sportsData, props.updateSportsData];
  const sportsColumns = props.sportsColumns;
  const [sportsPageSize, updateSportsPageSize] = [props.sportsPageSize, props.updateSportsPageSize];
  

  const [sizesDialogOpen, closeSizesDialog] = [props.sizesDialogOpen, props.closeSizesDialog];
  const [sizesDialogTitle, setSizesDialogTitle] = [props.sizesDialogTitle, props.setSizesDialogTitle];
  const [sizesDialogContent] = [props.sizesDialogContent];
  const [sizesData, setSizesData] = [props.sizesData, props.setSizesData];

  return (
    <React.Fragment>
      <MaterialTable
        title="Sports"
        isLoading={isSportsLoading}
        columns={sportsColumns}
        data={sportsData}
        pageSize={sportsPageSize}
        onChangeRowsPerPage={updateSportsPageSize}
        options={{
          search: true,
          filtering: true,
          actionsColumnIndex: -1,
          tableLayout: "auto"
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              if (newData.name.length === 0) {
                props.showMessage(`Sports Name cannot be empty.`, "warning");
                reject();
              } else {
                newData.displayName = newData.name + ` (${newData.gender})`;
                SportsAPI.createSport(newData)
                  .then((res) => {
                    newData.id = res.id;
                    updateSportsData(sportsData.concat([newData]));
                    props.showMessage(`Added entry for ${newData.displayName}`);
                    resolve();
                  })
                  .catch((err) => {
                    props.showMessage(`Unable to add entry for ${newData.displayName}`, "error");
                    reject();
                  });
              }
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              const testChanges =
                oldData.name === newData.name && oldData.gender === newData.gender && oldData.icon === newData.icon;
              const valid = newData.name.length > 0;
              if (testChanges) {
                props.showMessage(`You didn't change anything for ${oldData.displayName}.`, "info");
                resolve();
              } else if (!valid) {
                props.showMessage(`Sports Name cannot be empty.`, "warning");
                reject();
              } else {
                newData.displayName = newData.name + ` (${newData.gender})`;
                SportsAPI.updateSport(newData)
                  .then((res) => {
                    updateSportsData(sportsData.map((sport) => (newData.id === sport.id ? newData : sport)));
                    props.showMessage(`Updated entry for ${newData.displayName}`);
                    resolve();
                  })
                  .catch((err) => {
                    props.showMessage(`Unable to update entry for ${newData.displayName}`, "error");
                    reject();
                  });
              }
            })
        }}
        actions={[
          {
            icon: "update",
            tooltip: "Refresh Inventory",
            isFreeAction: true,
            onClick: async (event, rowData) => {
              props.showMessage("Refreshing sports...", "info");
              updateSportsLoading(true);
              await SportsAPI.getSportsFromBackend()
                .then((sports) => {
                  updateSportsLoading(false);
                  updateSportsData(sports);
                  props.showMessage("Successfully updated sports!");
                })
                .catch((err) => {
                  updateSportsLoading(false);
                  props.showMessage("Failed to update sports.", "error");
                });
            }
          }
        ]}
      />
      <SizesDialog
        dialogTitle={sizesDialogTitle}
        setDialogTitle={setSizesDialogTitle}
        dialogContent={sizesDialogContent}
        sizesDialogOpen={sizesDialogOpen}
        closeSizesDialog={closeSizesDialog}
        sizesData={sizesData}
        setSizesData={setSizesData}
      />
    </React.Fragment>
  );
}
