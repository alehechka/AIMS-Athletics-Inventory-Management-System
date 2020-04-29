
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from "@material-ui/core/InputLabel";
import Typography from '@material-ui/core/Typography';
import SportsSelect from './SportsSelect';
import MaterialTable from "material-table";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Grid from '@material-ui/core/Grid';

/**
 * Contains the elements in Dialog box form.
 * 
 * Props Passed down from Staff:
 * dialogOpen - contains the state of dialog box
 * dialogTitle - contains the title for dialog box
 * inputs - Object containing all form data to be modified
 * sport - list of sports selected in form
 * sports - object containing all sports available
 * sportIdLookup - Lookup for Sport Objects
 * 
 * @param {*} props props passed down from Staff
 */
export default function InventoryDialog(props) {
    const [dialogOpen, closeDialog] = [props.dialogOpen, props.closeDialog];
    const [inputs, changeInput] = [props.inputs, props.changeInput];
    const [sportObjects, sportObject, setSportObject] = [props.sportObjects, props.sportObject, props.setSportObject];
    const [sportSizes, sportSize, setSportSize, setSportSizes] = [props.sportSizes, props.sportSize, props.setSportSize, props.setSportSizes];
    const [state, setState] = React.useState({
        surplus: false,
        taxable: false,
        expendable: false,
        alertQuantity: false,
        jerseyNumbers: false
    });
    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    const dialogTitle = props.dialogTitle;
    const isEditDialog = dialogTitle.includes("Edit");

    const handleSportChange = (e) => {
        const sport = e.target.value;
        setSportObject(sport);
        let sizes = sportObjects.filter(sp => sp.default)[0].sportSizes;
        if(!sport.default) {
            sizes = sizes.concat(sport.sportSizes);
        }
        setSportSizes(sizes);
    }

    const sizeColumns = [
        { title: "ID", field: "id", hidden: true},
        { title: "Size", field: "size", },
        { title: "Barcode", field: "barcode" },
        { title: "Price", field: "price", type: "currency" },
        { title: "Quantity", field: "quantity", type: "numeric" },
        { title: "Alert Quantity", field: "alertQuantity", hidden: !state.alertQuantity },
        { title: "Jersey Numbers", field: "jerseyNumbers", hidden: !state.jerseyNumbers}
    ];

    return (
        <Dialog open={dialogOpen} onClose={closeDialog} disableBackdropClick>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            autoComplete="Name"
                            value={inputs.name}
                            onChange={changeInput}
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={4} >
                        <FormControlLabel
                            control={<Checkbox checked={state.jerseyNumbers} onChange={handleChange} name="jerseyNumbers" color="primary" />}
                            label="Jersey Numbers"
                            labelPlacement="end"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="description"
                            label="Description"
                            name="description"
                            autoComplete="Description"
                            value={inputs.description}
                            onChange={changeInput}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <FormControlLabel
                            control={<Checkbox checked={state.surplus} onChange={handleChange} name="surplus" color="primary" />}
                            label="Surplus"
                            labelPlacement="end"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <FormControlLabel
                            control={<Checkbox checked={state.taxable} onChange={handleChange} name="taxable" color="primary" />}
                            label="Taxable"
                            labelPlacement="end"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <FormControlLabel
                            control={<Checkbox checked={state.expendable} onChange={handleChange} name="expendable" color="primary" />}
                            label="Expendable"
                            labelPlacement="end"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl variant="outlined" margin="normal" required fullWidth>
                            <InputLabel id="sport-label">Sport</InputLabel>
                            <Select
                                id="sport"
                                labelId="sport-label"
                                label="Sport"
                                value={sportObject} onChange={handleSportChange}
                            >
                                {sportObjects.map(sport =>
                                    <MenuItem key={sport.id} value={sport}>
                                        {sport.name}
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl variant="outlined" margin="normal" required fullWidth>
                            <InputLabel id="size-label">Size</InputLabel>
                            <Select
                                id="size"
                                labelId="size-label"
                                label="Size"
                                value={sportSize} onChange={(e) => setSportSize(e.target.value)}
                            >
                                {sportSizes.map(size =>
                                    <MenuItem key={size.id} value={size}>
                                        {size.name}
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControlLabel
                            control={<Checkbox checked={state.alertQuantity} onChange={handleChange} name="alertQuantity" color="primary" />}
                            label="Alert Quantity"
                            labelPlacement="end"
                        />
                    </Grid>
                </Grid>
                <MaterialTable 
                    title="Sizes"
                    columns={sizeColumns}
                    data={inputs.inventorySizes}
                    option={{
                        search: false,
                        filtering: false,
                        actionsColumnIndex: -1,
                        tableLayout: "auto",
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => closeDialog(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => closeDialog(true)} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}