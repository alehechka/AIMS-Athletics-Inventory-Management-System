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

/** @module SizesDialog */

/**
 * Helper TextField that lets users add a new chip.
 * 
 * @param {Object} props - passed down from SizesDialog box.
 * @param {String[]} props.array - array containing the sizes to be edited.
 * @param {Function} props.onChange - function to be executed on button click.
 */
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
    );
}
/**
 * This component lets users add/edit/delete userSizes.
 * 
 * @param {Object} props - Passed down from Sports Table
 */
export default function SizesDialog(props) {
    const [sizesDialogOpen, closeSizesDialog] = [props.sizesDialogOpen, props.closeSizesDialog];
    const [dialogTitle, dialogContent] = [props.dialogTitle, props.dialogContent];
    const [sizesData, setSizesData] = [props.sizesData, props.setSizesData];
    const sportId = dialogContent.id;

    let columns = [
        {title: "ID", field: 'id', hidden: true, searchable: false},
        {title: "Item Name", field: "name", searchable: true,
        editComponent: props=>(
            <TextField
                variant="outlined"
                margin="normal"
                required
                label="Item Name"
                value={props.value}
                onChange={e=> props.onChange(e.target.value)}
            />
        )
        },
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
                                id: newData.id,
                                name: newData.name,
                                sizes: newData.sizes
                            };
                            setSizesData(sizesData.concat([newItem]));
                            console.log(sportId, newItem);
                            resolve();
                          }),
                        onRowUpdate: (newData, oldData) =>
                          new Promise((resolve, reject) => {
                            const newItem = {
                                id: oldData.id,
                                name: newData.name,
                                sizes: newData.sizes
                            };
                            setSizesData(sizesData.map(item => item.id === newData.id? newItem: item));
                            console.log(sportId, newItem);
                            resolve();
                          }),
                        onRowDelete: oldData =>
                          new Promise((resolve, reject) => {
                            setSizesData(sizesData.filter(item => item.name !== oldData.name));
                            console.log(sportId, sizesData.length);
                            resolve();
                          }),
                      }}
                />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=> closeSizesDialog(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={()=> closeSizesDialog(true)} color="primary" variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}