import React from "react";
import MaterialTable from 'material-table';
import {SportsAPI} from "../../../api";
import SizesDialog from "./SizesDialog";

export default function SportsTable(props){
    const [isSportsLoading, updateSportsLoading] = [props.isSportsLoading, props.updateSportsLoading];
    const [sportsData, updateSportsData] = [props.sportsData, props.updateSportsData];
    const sportsColumns = props.sportsColumns;
    const [sportsPageSize, updateSportsPageSize] = [props.sportsPageSize, props.updateSportsPageSize];

    const [sizesDialogOpen, setSizesDialogOpen, closeSizesDialog] = [props.sizesDialogOpen, props.setSizesDialogOpen, props.closeSizesDialog] ;
    const [sizesDialogTitle, setSizesDialogTitle] = [props.sizesDialogTitle, props.setSizesDialogTitle];
    const [sizesDialogContent, setSizesDialogContent] = [props.sizesDialogContent, props.setSizesDialogContent];
    return(
        <React.Fragment>
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
                actions={[
                    {
                    icon: 'edit',
                    tooltip: 'Edit Sport',
                    onClick: (event, rowData) => {
                        setSizesDialogTitle("Edit Sport");
                        setSizesDialogContent(JSON.stringify(rowData.sportSizes));
                        setSizesDialogOpen(true);
                        /**
                         * editable={{
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
                         */
                    }
                    },
                    {
                        icon: 'add',
                        tooltip: 'Add Sport',
                        isFreeAction: true,
                        onClick: (event) => {
                            setSizesDialogTitle("Add Sport");
                            setSizesDialogContent("Filler");
                            setSizesDialogOpen(true);
                        }
                    }
                ]}
            />
            <SizesDialog
              dialogTitle = {sizesDialogTitle}
              dialogContent = {sizesDialogContent}
              sizesDialogOpen = {sizesDialogOpen}
              closeSizesDialog = {closeSizesDialog} 
            />
        </React.Fragment>
    );
}