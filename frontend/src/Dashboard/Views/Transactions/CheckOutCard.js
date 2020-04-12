import React from "react";
import Typography from "@material-ui/core/Typography";
// import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
// import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

export default function CheckOutCard({ user, items, tranIndex, updateSingleTransaction }) {
  return (
    <Card style={{ marginBottom: "5px" }} variant="outlined">
      <CardContent>
        <Typography component="h3" variant="h6">
          {user?.firstName} {user?.lastName}
        </Typography>
        <List>
          {items.map((item, index) => (
            <ListItem key={index} dense>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <ListItemText primary={item.name} />
                </Grid>
                <Grid item xs={3}>
                  <FormControl variant="outlined" margin="dense" required fullWidth style={{ marginTop: "12px" }}>
                    <InputLabel id="inventory-size-label">Size</InputLabel>
                    <Select
                      id="size"
                      label="Size*"
                      labelId="inventory-size-label"
                      value={item.inventorySize}
                      onChange={(e) => updateSingleTransaction(tranIndex, index, "inventorySize", e.target.value)}
                    >
                      {item.inventorySizes.map((inventorySize, index) => (
                        <MenuItem key={index} value={inventorySize}>
                          {inventorySize.size}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    type="number"
                    fullWidth
                    id="amount"
                    label="Amount"
                    onChange={(e) => {
                        let amount = e.target.value
                        updateSingleTransaction(tranIndex, index, "amount", amount)
                        if(amount > 0) {
                          updateSingleTransaction(tranIndex, index, "checked", true)
                        } else {
                          updateSingleTransaction(tranIndex, index, "checked", false)
                        }
                    }}
                    value={item.amount}
                    size="small"
                    inputProps={{min:0, step:1}}
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    type="currency"
                    fullWidth
                    id="price"
                    label="Price"
                    value={parseFloat((item.inventorySize?.price * item.amount).toFixed(2)) || ""}
                    size="small"
                    disabled
                  />
                </Grid>
                <Grid item xs={1}>
                  <ListItemSecondaryAction>
                    <Checkbox
                      checked={item.checked}
                      value={item.checked}
                      tabIndex={-1}
                      onClick={(e) => {
                        let checked = e.target.checked;
                        updateSingleTransaction(tranIndex, index, "checked", checked)
                        if(checked) {
                          updateSingleTransaction(tranIndex, index, "amount", 1)
                        } else {
                          updateSingleTransaction(tranIndex, index, "amount", 0)
                        }
                      }}
                    />
                  </ListItemSecondaryAction>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
