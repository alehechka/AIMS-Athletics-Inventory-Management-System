import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import InputAdornment from '@material-ui/core/InputAdornment';
import Add from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';

import MaterialTable from 'material-table';

function SizeTextField(props) {
    const [newSize, setNewSize] = React.useState("");
    const onChange = props.onChange;
    const array = props.array;
    return (<TextField
        variant="outlined"
        margin="normal"
        required
        label="Add Size"
        value={newSize}
        onChange={e=> setNewSize(e.target.value)}
        InputProps= {{
            endAdornment:
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                    onChange(array.concat([newSize]));
                    setNewSize("");
                }}
                edge="end"
              >
               <Add/>
              </IconButton>
            </InputAdornment>
        }}
    />

    )
}
export default function SizesDialog(props) {
    const [sizesDialogOpen, closeSizesDialog] = [props.sizesDialogOpen, props.closeSizesDialog];
    const [dialogTitle, dialogContent] = [props.dialogTitle, props.dialogContent];
    const [sizesData, setSizesData] = [props.sizesData, props.setSizesData];

    const sportId = dialogContent.id;
    let columns = [
        {title: "ID", hidden: true, editable: "never", searchable: false},
        {title: "Item Name", field: "name", searchable: true},
        {title: "Sizes", field: "sizes", searchable: false,
        render: rowData => rowData.sizes.map(size => <Chip label={size} key={size} style={{margin: "4px"}}/>),
        editComponent: props => (
            <React.Fragment>
                {props.value?props.value.map(size =>
                    <Chip label={size} key={size} style={{margin: "4px"}} onDelete ={(e) => {
                        props.onChange(props.value.filter(val => val !== size));
                    }}/>)
                :""}
                <SizeTextField
                    array={props.value? props.value:[]}
                    onChange={props.onChange}
                />
            </React.Fragment>
          )
        }
    ];
    return(
        <Dialog open={sizesDialogOpen} onClose={closeSizesDialog} disableBackdropClick maxWidth={"lg"} fullWidth>
            <DialogTitle>{dialogTitle} for {dialogContent.displayName}</DialogTitle>
            <DialogContent>
                <div style={{ width: "100%",}}>
                <MaterialTable
                    title="Item Sizes"
                    isLoading={false}
                    columns={columns}
                    data={sizesData}
                    options={{
                        pageSize: 5,
                        pageSizeOptions: [5],
                        headerStyle: {fontWeight: 'bold'},
                        actionsColumnIndex: -1,
                        tableLayout: "auto"
                    }}
                    editable={{
                        onRowAdd: newData =>
                          new Promise((resolve, reject) => {
                            const newItem = {
                                id: Math.random(),
                                name: newData.name,
                                sizes: newData.sizes
                            }
                            setSizesData(sizesData.concat([newItem]));
                            resolve();
                          }),
                        onRowUpdate: (newData, oldData) =>
                          new Promise((resolve, reject) => {
                            const newItem = {
                                id: oldData.id,
                                name: oldData.name,
                                sizes: newData.sizes
                            }
                            setSizesData(sizesData.map(item => item.id === newData.id? newItem: item));
                            resolve();
                          }),
                        onRowDelete: oldData =>
                          new Promise((resolve, reject) => {
                            setSizesData(sizesData.filter(item => item.id !== oldData.id));
                            resolve();
                          }),
                      }}
                />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=> closeSizesDialog()} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}