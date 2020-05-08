import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MaterialTable from "material-table";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
// import { CompactPicker } from 'react-color';

import Grid from "@material-ui/core/Grid";

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
  const [sportSizes, sportSize, setSportSize, setSportSizes] = [
    props.sportSizes,
    props.sportSize,
    props.setSportSize,
    props.setSportSizes
  ];
  const [state, setState] = React.useState({
    alertQuantity: false,
    jerseyNumbers: false
  });

  const dialogTitle = props.dialogTitle;
  const isEditDialog = dialogTitle.includes("Edit");

  const handleSportChange = (e) => {
    const sport = e.target.value;
    setSportObject(sport);
    let sizes = sportObjects.filter((sp) => sp.default)[0].sportSizes;
    if (!sport.default) {
      sizes = sizes.concat(sport.sportSizes);
    }
    setSportSizes(sizes);
  };

  const sizeColumns = [
    { title: "ID", field: "id", hidden: true },
    { title: "Size", field: "size" },
    { title: "Barcode", field: "barcode", hidden: true },
    { title: "Jersey Numbers", field: "jerseyNumbers", hidden: !inputs.jerseyNumbers },
    { title: "Price", field: "price", type: "currency" },
    { title: "Quantity", field: "quantity", type: "numeric" },
    { title: "Alert Quantity", field: "alertQuantity", type: "numeric", hidden: !inputs.alertQuantity }
  ];

  const handleChangeComplete = (color) => {
    changeInput({
      target: {
        name: "color",
        value: color.hex
      }
    });
  };

  const handleSportSizeChange = (e) => {
    const spSize = e.target.value;
    setSportSize(spSize);
    if (!inputs.inventorySizes.length) {
      let invSizes = [];
      for (let size of spSize.sizes) {
        invSizes.push({
          alertQuantity: 0,
          price: 0,
          quantity: 0,
          size,
          jerseyNumbers: []
        });
      }
      changeInput({
        target: {
          name: "inventorySizes",
          value: invSizes
        }
      });
    }
  };

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
          <Grid item xs={6}>
            {/* <CompactPicker color={{ hex: inputs.color }} onChangeComplete={handleChangeComplete} /> */}
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
          <Grid item xs={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={inputs.surplus}
                  value={inputs.surplus}
                  onClick={changeInput}
                  name="surplus"
                  color="primary"
                />
              }
              label="Surplus"
              labelPlacement="end"
            />
          </Grid>
          <Grid item xs={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={inputs.taxable}
                  value={inputs.taxable}
                  onClick={changeInput}
                  name="taxable"
                  color="primary"
                />
              }
              label="Taxable"
              labelPlacement="end"
            />
          </Grid>
          <Grid item xs={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={inputs.expendable}
                  value={inputs.expendable}
                  onClick={changeInput}
                  name="expendable"
                  color="primary"
                />
              }
              label="Expendable"
              labelPlacement="end"
            />
          </Grid>
          <Grid item xs={3}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={inputs.jerseyNumbers}
                  value={inputs.jerseyNumbers}
                  onClick={changeInput}
                  name="jerseyNumbers"
                  color="primary"
                />
              }
              label="Jersey Numbers"
              labelPlacement="end"
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl variant="outlined" margin="normal" required fullWidth>
              <InputLabel id="sport-label">Sport</InputLabel>
              <Select id="sport" labelId="sport-label" label="Sport" value={sportObject} onChange={handleSportChange}>
                {sportObjects.map((sport) => (
                  <MenuItem key={sport.id} value={sport}>
                    {sport.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl variant="outlined" margin="normal" required fullWidth>
              <InputLabel id="size-label">Size</InputLabel>
              <Select id="size" labelId="size-label" label="Size" value={sportSize} onChange={handleSportSizeChange}>
                {sportSizes.map((size) => (
                  <MenuItem key={size.id} value={size}>
                    {size.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={inputs.alertQuantity}
                  value={inputs.alertQuantity}
                  onClick={changeInput}
                  name="alertQuantity"
                  color="primary"
                />
              }
              label="Alert Quantity"
              labelPlacement="end"
            />
          </Grid>
        </Grid>
        <MaterialTable
          title="Sizes"
          columns={sizeColumns}
          data={inputs.inventorySizes}
          options={{
            search: false,
            filtering: false,
            actionsColumnIndex: -1,
            tableLayout: "auto"
          }}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                const valid = newData.size && parseFloat(newData.price) && newData.quantity;
                const newItem = {
                  ...newData,
                  price: parseFloat(newData.price),
                  quantity: parseInt(newData.quantity),
                  alertQuantity: parseInt(newData.alertQuantity)
                };
                if (valid) {
                  changeInput({
                    target: {
                      name: "inventorySizes",
                      value: [...inputs.inventorySizes, newItem]
                    }
                  });
                  resolve();
                } else {
                  reject();
                }
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                const valid = newData.size && parseFloat(newData.price) && newData.quantity;
                const newItem = {
                  ...newData,
                  price: parseFloat(newData.price),
                  quantity: parseInt(newData.quantity),
                  alertQuantity: parseInt(newData.alertQuantity)
                };
                if (valid) {
                  const items = inputs.inventorySizes.filter((item) => item !== oldData);
                  changeInput({
                    target: {
                      name: "inventorySizes",
                      value: [...items, newItem]
                    }
                  });
                  resolve();
                } else {
                  reject();
                }
              })
          }}
          actions={[]}
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
