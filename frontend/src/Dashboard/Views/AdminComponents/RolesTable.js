import React from "react";
import MaterialTable from 'material-table';

export default function RolesTable(props) {
    const [isRoleLoading, updateRoleLoading] = [props.isRoleLoading, props.updateRoleLoading];
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
                    if (oldData.role === newData.role) {
                        resolve();
                        props.showMessage(`You didn't change the role for ${fullName}.`, "info");
                    }
                    else {
                    setTimeout(() => {
                        if (Math.random() < 0.9){
                            updateRoleData(roleData.map(user => newData.id === user.id ? newData : user));                 
                            props.showMessage(`${fullName}'s role successfully changed!`);
                            resolve();
                        }
                        else {
                            reject();
                            props.showMessage(`Unable to change the role for ${fullName}!`, "error");
                        }
                    }, 500);
                    }
                }),
            }}
          /> 
    );
}