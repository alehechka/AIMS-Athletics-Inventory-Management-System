import React from "react";
import MaterialTable from 'material-table';
import { CredentialAPI } from "../../../api";
export default function RolesTable(props) {
    const isRoleLoading = props.isRoleLoading;
    const [roleData, updateRoleData] = [props.roleData, props.updateRoleData];
    const roleColumns = props.roleColumns;
    const [rolePageSize, updateRolePageSize] = [props.rolePageSize, props.updateRolePageSize];

    return(
        <MaterialTable
            title="Roles"
            isLoading= {isRoleLoading}
            columns={roleColumns}
            data={roleData}
            pageSize = {rolePageSize}
            onChangeRowsPerPage = {updateRolePageSize}
            options={{
                search: true,
                filtering: true,
                actionsColumnIndex: -1,
                tableLayout: "auto",
            }}
            editable={{
            onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                    const fullName = newData.firstName + " " + newData.lastName;
                    const testValidity = (role) => role.isAdmin || role.isAthlete || role.isEmployee || role.isCoach;
                    if (JSON.stringify(oldData.role) === JSON.stringify(newData.role)) {
                        resolve();
                        props.showMessage(`You didn't change the role for ${fullName}.`, "info");
                    }
                    else if (!testValidity(newData.role)){
                        reject();
                        props.showMessage(`You must select at least one role for ${fullName}.`, "error");
                    }
                    else {
                        const updatedUser = {
                            id: newData.id, 
                            isAdmin: newData.role.isAdmin, 
                            isAthlete: newData.role.isAthlete,
                            isCoach: newData.role.isCoach,
                            isEmployee: newData.role.isEmployee,
                        };
                        CredentialAPI.updateCredentials(updatedUser).then((res) => {
                            console.log(res);
                            updateRoleData(roleData.map(user => newData.id === user.id ? newData : user));                 
                            props.showMessage(`${fullName}'s role successfully changed!`);
                            resolve();
                        }).catch((err) =>{
                            reject();
                            props.showMessage(`Unable to change the role for ${fullName} ${err}!`, "error");
                        });
                    }
                }),
            }}
          /> 
    );
}