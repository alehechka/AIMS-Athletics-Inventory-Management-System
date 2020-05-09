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
import TextField from "@material-ui/core/TextField";
import ListSubheader from "@material-ui/core/ListSubheader";

/** @module CheckInCard */

/**
 * Components for displaying the check in card
 * @param {Object} user - User to be displayed
 * @param {Object} items - List of unique items for the displayed user
 * @param {Object} sharedItems - List of items common between all users
 * @param {Number} tranIndex - Index of the transcaction
 * @param {Function} updateSingleTransaction - Function for updating singular transaction
 * @returns {Component} returns the component to be rendered
 */
export default function CheckInCard({ user, items, sharedItems, tranIndex, updateSingleTransaction }) {
  return (
    <Card style={{ marginBottom: "5px" }} variant="outlined">
        <CardContent>
            <Grid container spacing ={1} direction='row'>
                <Grid item xs = {2}>
                    <Typography component="h3" variant="h6">
                        {user?.firstName} {user?.lastName}
                    </Typography>
                </Grid>
                <Grid item xs= {3}>
                    <List style={{overflow: 'auto', maxHeight: 300, maxWidth: 360}}>
                        <ListSubheader>Shared Items</ListSubheader>
                        {sharedItems.map( (sharedItem, index) => (
                            <ListItem key={index} dense>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <ListItemText primary ={sharedItem.name} secondary = {sharedItem.size} />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField
                                        variant="outlined"
                                        margin="normal"
                                        type="number"
                                        fullWidth
                                        id="amount"
                                        label="Amount"
                                        onChange={(e) => {
                                            let amount = e.target.value
                                            updateSingleTransaction(tranIndex, index, "amountCheckedIn", amount, false)
                                            if(amount > 0) {
                                            updateSingleTransaction(tranIndex, index, "checked", true, false)
                                            } else {
                                            updateSingleTransaction(tranIndex, index, "checked", false, false)
                                            }
                                        }}
                                        defaultValue={sharedItem.amountCheckedIn}
                                        size="small"
                                        inputProps={{min:0, step:1, max: sharedItem.amountCheckedOut}} //max should be amount checked
                                        />
                                    </Grid>
                                    <Grid item xs ={2}>
                                        <ListItemSecondaryAction>
                                            <Checkbox
                                            checked={sharedItem.checked}
                                            value={sharedItem.checked}
                                            tabIndex={-1}
                                            onClick={(e) => {
                                                let checked = e.target.checked;
                                                updateSingleTransaction(tranIndex, index, "checked", checked, false)
                                                if(checked) {
                                                updateSingleTransaction(tranIndex, index, "amountCheckedIn", 1, false)
                                                } else {
                                                updateSingleTransaction(tranIndex, index, "amountCheckedIn", 0, false)
                                                }
                                            }}
                                            />
                                        </ListItemSecondaryAction>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid item xs={3}>
                    <List style={{overflow: 'auto', maxHeight: 300, maxWidth: 360}}>
                        <ListSubheader>Unique Items</ListSubheader>
                            {items.map( (item, index) => (
                                <ListItem key={index} dense>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <ListItemText primary ={item.name} secondary = {item.size} />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                            variant="outlined"
                                            margin="normal"
                                            type="number"
                                            fullWidth
                                            id="amount"
                                            label="Amount"
                                            onChange={(e) => {
                                                let amount = e.target.value
                                                updateSingleTransaction(tranIndex, index, "amountCheckedIn", amount, true)
                                                if(amount > 0) {
                                                updateSingleTransaction(tranIndex, index, "checked", true, true)
                                                } else {
                                                updateSingleTransaction(tranIndex, index, "checked", false, true)
                                                }
                                            }}
                                            defaultValue={item.amountCheckedIn}
                                            value={item.amountCheckedIn}
                                            size="small"
                                            inputProps={{min:0, step:1, max: item.amountCheckedOut}} //max should be amount checked
                                            />
                                        </Grid>
                                        <Grid item xs ={2}>
                                            <ListItemSecondaryAction>
                                                <Checkbox
                                                checked={item.checked}
                                                value={item.checked}
                                                tabIndex={-1}
                                                onClick={(e) => {
                                                    let checked = e.target.checked;
                                                    updateSingleTransaction(tranIndex, index, "checked", checked, true)
                                                    if(checked) {
                                                    updateSingleTransaction(tranIndex, index, "amountCheckedIn", 1, true)
                                                    } else {
                                                    updateSingleTransaction(tranIndex, index, "amountCheckedIn", 0, true)
                                                    }
                                                }}
                                                />
                                            </ListItemSecondaryAction>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            ))}
                        </List>
                </Grid>
            </Grid>
        </CardContent>
  </Card>
  );
}
