import React from "react";
import MaterialTable from "material-table";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import { CredentialAPI, UsersAPI } from "../../../api";

/** @module RolesTable */

/**
 * Contains the Role table and update password dialog logic.
 * 
 * @param {Object} props - passed down from Admin
 */
export default function RolesTable(props) {
  const [isRoleLoading, updateRoleLoading] = [props.isRoleLoading, props.updateRoleLoading];
  const [roleData, updateRoleData] = [props.roleData, props.updateRoleData];
  const roleColumns = props.roleColumns;
  const [rolePageSize, updateRolePageSize] = [props.rolePageSize, props.updateRolePageSize];

  const [passwordDialogOpen, setPasswordDialogOpen, closePasswordDialog] = [props.passwordDialogOpen, props.setPasswordDialogOpen, props.closePasswordDialog];
  const [passwordDialogTitle, setPasswordDialogTitle] = [props.passwordDialogTitle, props.setPasswordDialogTitle];
  const [setPasswordDialogId] = [props.setPasswordDialogId];
  const [passwordDialogValue, setPasswordDialogValue] = [props.passwordDialogValue, props.setPasswordDialogValue];
  const passwordError = passwordDialogValue.length > 0 && (passwordDialogValue.length < 8 || passwordDialogValue.length > 32);
  return (
    <React.Fragment>
      <MaterialTable
        title="Security"
        isLoading={isRoleLoading}
        columns={roleColumns}
        data={roleData}
        pageSize={rolePageSize}
        onChangeRowsPerPage={updateRolePageSize}
        options={{
          search: true,
          filtering: true,
          actionsColumnIndex: -1,
          tableLayout: "auto"
        }}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              const fullName = newData.firstName + " " + newData.lastName;
              const testValidity = (role) => role.isAdmin || role.isAthlete || role.isEmployee || role.isCoach;
              if (JSON.stringify(oldData.role) === JSON.stringify(newData.role)) {
                resolve();
                props.showMessage(`You didn't change the role for ${fullName}.`, "info");
              } else if (!testValidity(newData.role)) {
                reject();
                props.showMessage(`You must select at least one role for ${fullName}.`, "error");
              } else {
                const updatedUser = {
                  id: newData.id,
                  isAdmin: newData.role.isAdmin,
                  isAthlete: newData.role.isAthlete,
                  isCoach: newData.role.isCoach,
                  isEmployee: newData.role.isEmployee
                };
                CredentialAPI.updateCredentials(updatedUser)
                  .then((res) => {
                    console.log(res);
                    updateRoleData(roleData.map((user) => (newData.id === user.id ? newData : user)));
                    props.showMessage(`${fullName}'s role successfully changed!`);
                    resolve();
                  })
                  .catch((err) => {
                    reject();
                    props.showMessage(`Unable to change the role for ${fullName} ${err}!`, "error");
                  });
              }
            })
        }}
        actions={[
          {
            icon: "update",
            tooltip: "Refresh Users",
            isFreeAction: true,
            onClick: async (event, rowData) => {
              props.showMessage("Refreshing users...", "info");
              updateRoleLoading(true);
              await UsersAPI.getUsersFromBackend(null, null, {
                isAdmin: true,
                isEmployee: true,
                isCoach: true,
                isAthlete: true
              })
                .then((users) => {
                  updateRoleData(props.mapUsers(users));
                  updateRoleLoading(false);
                  props.showMessage("Successfully updated users!");
                })
                .catch((err) => {
                  updateRoleLoading(false);
                  props.showMessage("Failed to update users.", "error");
                });
            }
          },
          {
            icon: "vpn_key",
            tooltip: "Update Password",
            onClick: (event, rowData) => {
              updateRoleLoading(true);
              setPasswordDialogTitle(`${rowData.fullName}`);
              setPasswordDialogId(rowData.id);
              setPasswordDialogValue("");
              setPasswordDialogOpen(true);
            }
          }
        ]}
      />
      <Dialog open={passwordDialogOpen} onClose={closePasswordDialog} disableBackdropClick fullWidth>
        <DialogTitle>Edit Password for {passwordDialogTitle}</DialogTitle>
          <DialogContent>
              <div>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={passwordDialogValue}
                onChange={(e) => setPasswordDialogValue(e.target.value)}
                error={passwordError}
                helperText={passwordError ? "Password needs to be between 8 and 32 characters long" : ""}
              />
              </div>
          </DialogContent>
        <DialogActions>
            <Button onClick={()=> closePasswordDialog(false)} color="primary">
                Cancel
            </Button>
            <Button onClick={() => closePasswordDialog(true)} color="primary">
                Confirm
            </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
