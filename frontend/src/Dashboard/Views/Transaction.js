import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import InputLabel from "@material-ui/core/InputLabel"
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import ListSubheader from "@material-ui/core/ListSubheader";

import {SportsAPI, UsersApi, UsersAPI} from "../../api";

export default function Transaction(props) {

    const [checked, setChecked] = React.useState([0]);

    const handleToggle = (value) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];
  
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
  
      setChecked(newChecked);

    }
    const [sports, setSports] = React.useState([]);
    const [users, setUsers] = React.useState([]);

    React.useEffect(()=>{
        SportsAPI.getSports().then((sports)=> {
            setSports(sports);
        });

        UsersAPI.getUsers(null, null, {isAdmin: true, isEmployee: true, isCoach: true,}).then( (users) => {
            setUsers(users)
        });
    
    });

    return (
        <Grid item xs = {12} >
            <Card variant = "outlined">
                <CardContent>
                <Grid container spacing = {3}>
                    <Grid item xs = {2} style ={{marginTop: 15}}>
                        <InputLabel id="sport-input">Sport</InputLabel>
                        <Select
                        style = {{minWidth: 120}}
                        labelId="sport-input"
                        id="demo-simple-select"
                        >
                        {sports.map(sport =>
                            <MenuItem value = {sport.id}>{sport.displayName}</MenuItem>
                            )}
                        </Select>
                    </Grid>
                    <Grid item xs = {4}>
                        <List
                            subheader={
                            <ListSubheader component="div" id="nested-list-subheader">
                                List of Teams
                            </ListSubheader>
                            }>
                            {sports.map( (sport) => {
                                return (
                                    <ListItem key = {sport.id} dense>
                                        <ListItemText primary = {sport.displayName}></ListItemText>
                                        <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                        />
                                        </ListItemIcon>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Grid>
                    <Grid item xs = {6}>
                        <List
                            subheader={
                            <ListSubheader component="div" id="nested-list-subheader">
                                List of Athletes
                            </ListSubheader>
                            }>
                            {users.map( (user) => {
                                return (
                                    <ListItem key = {user.id} dense button onClick={handleToggle(user.id)}>
                                        <ListItemText primary = {`${user.firstName} ${user.lastName}`}></ListItemText>
                                        <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={checked.indexOf(user.id) !== -1}
                                        />
                                        </ListItemIcon>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Grid>
                </Grid>
                </CardContent>
            </Card>
        </Grid>
    );
  }