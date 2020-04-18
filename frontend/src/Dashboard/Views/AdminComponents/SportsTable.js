import React from "react";
import MaterialTable from 'material-table';
import {SportsAPI} from "../../../api";

export default function SportsTable(props){
    const [isSportsLoading, updateSportsLoading] = [props.isSportsLoading, props.updateSportsLoading];
    const [sportsData, updateSportsData] = [props.sportsData, props.updateSportsData];
    const sportsColumns = props.sportsColumns;
    const [sportsPageSize, updateSportsPageSize] = [props.sportsPageSize, props.updateSportsPageSize];
    return(
        <MaterialTable
            title="Sports"
            isLoading= {isSportsLoading}
            columns={sportsColumns}
            data={sportsData}
            pageSize = {sportsPageSize}
            onChangeRowsPerPage = {updateSportsPageSize}
            options={{
                search: true,
                filtering: true,
                actionsColumnIndex: -1,
                tableLayout: "auto",
            }}
            editable={{
                onRowAdd: newData =>
                new Promise((resolve, reject) => {
                    if (newData.name.length === 0) {
                    resolve();
                    props.showMessage(`Sports Name cannot be empty.`, "warning");
                    }
                    else {
                    newData.displayName = newData.name + ` (${newData.gender})`;
                    SportsAPI.createSport(newData).then((res) =>{
                        newData.id = res.id;
                        updateSportsData(sportsData.concat([newData]));
                        props.showMessage(`Added entry for ${newData.displayName}`);
                        resolve();
                    }).catch(err => {
                        props.showMessage(`Unable to add entry for ${newData.displayName}`, 'error');
                        reject();
                    });
                    }
                }),
                onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                    if (oldData.name === newData.name && oldData.gender === newData.gender) {
                    resolve();
                    props.showMessage(`You didn't change anything for ${oldData.displayName}.`, "info");
                    }
                    else {
                    newData.displayName = newData.name + ` (${newData.gender})`;
                    SportsAPI.updateSport(newData).then((res) =>{
                        updateSportsData(sportsData.map(sport => newData.id === sport.id ? newData : sport)); 
                        props.showMessage(`Updated entry for ${newData.displayName}`);
                        resolve();
                    }).catch(err => {
                        props.showMessage(`Unable to update entry for ${newData.displayName}`, 'error');
                        reject();
                    });
                    
                    }
                }),
            }}
        />
    );
}