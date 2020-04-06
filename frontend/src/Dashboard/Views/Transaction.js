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
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import {SportsAPI, InventoryAPI, UsersAPI} from "../../api";

export default function Transaction(props) {


    const [users, setUsers] = React.useState([]);
    const [usersMaster, setUsersMaster] = React.useState([]);
    const [usersCheckbox, setUsersCheckbox] = React.useState([]);
    const [checkedUsers, setCheckedUsers] = React.useState([]);
 
    const [sports, setSports] = React.useState([]);
    const [sportsFilter, setSportsFilter] = React.useState([]);

    const [teams, setTeams] = React.useState([]);

    const [inventory, setInventory] = React.useState([]);
    const [inventoryCheckbox, setInventoryCheckbox] = React.useState([]);
    const [checkedInventory, setCheckedInventory] = React.useState([]);
 
    const handleSportFilter = (event) => {
        var tempUsers = JSON.parse(JSON.stringify(usersMaster))
        setSportsFilter(event.target.value);
        setUsers(tempUsers.filter(user => user.sports.find(sports => sports.name.includes(event.target.value))) );

    };

    const handleAthleteToggle = (value) => () => {
      const currentIndex = usersCheckbox.indexOf(value);
      const newUsersCheckbox = [...usersCheckbox];
      const newCheckedUsers = [...checkedUsers];
      const newCheckedUser = usersMaster.find(user => user.id === value);

      console.log(newCheckedUser);
  
      if (currentIndex === -1) {
        newUsersCheckbox.push(value);
        newCheckedUsers.push(newCheckedUser);
      } else {
        newUsersCheckbox.splice(currentIndex, 1);
        newCheckedUsers.splice(currentIndex,1);
      }

      setUsersCheckbox(newUsersCheckbox);
      setCheckedUsers(newCheckedUsers);

    };

    const handleInventoryToggle = (value) => () => {
        const currentIndex = inventoryCheckbox.indexOf(value);
        const newInventoryCheckbox = [...inventoryCheckbox];
        const newCheckedInventory = [...checkedInventory];
        const newCheckedInventoryItem = inventory.find(inventory => inventory.id === value);

        if(currentIndex === -1){
            newInventoryCheckbox.push(value);
            newCheckedInventory.push(newCheckedInventoryItem);
        } else {
            newInventoryCheckbox.splice(currentIndex, 1);
            newCheckedInventory.splice(currentIndex, 1);
        }

        setInventoryCheckbox(newInventoryCheckbox);
        setCheckedInventory(newCheckedInventory);

        console.log(newCheckedInventory);
    }


    React.useEffect(()=>{
        SportsAPI.getSports().then((sports)=> {
            setSports(sports);
        });

        UsersAPI.getUsers(null, null, {isAdmin: true, isEmployee: true, isCoach: true, isAthlete: true}).then( (users) => {
            setUsers(users)
            setUsersMaster(users)
        });

        setTeams([{id: 1, name: "The Ball Boys"}, {id:2, name: "Sportsmen"}]);

        InventoryAPI.getInventory(null,null, {}).then( (inventory)=> {
            setInventory(inventory);
        });
    
    }, []);

    return (
        <Grid item xs = {12} >
            <Card variant = "outlined">
                <CardContent>
                <Grid container spacing = {4}>
                    <Grid item xs = {1}>
                        <Typography>Sports</Typography>
                        <Select
                            style = {{minWidth: 60}}
                            defaultValue = {""}
                            onChange = {handleSportFilter}>
                            {sports.map(sport =>
                                <MenuItem key = {sport.id} value = {sport.name}>{sport.displayName}</MenuItem>
                                )}
                        </Select>
                    </Grid>
                    <Grid item xs = {2}>
                        <Typography>Teams</Typography>
                        <List>
                            {teams.map( (team) => {
                                return (
                                    <ListItem key = {team.id} dense>
                                        <ListItemText primary = {team.name}></ListItemText>
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
                    <Grid item xs = {3}>
                        <Typography>Athletes</Typography>
                        <List
                            style = {{overflow: 'auto', maxHeight: 250}}>
                            {users.map( (user) => {
                                return (
                                    <ListItem key = {user.id} dense button onClick={handleAthleteToggle(user.id)}>
                                        <ListItemText 
                                            primary = {user.fullName}
                                            secondary = {user.isActive}/>
                                        <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={usersCheckbox.indexOf(user.id) !== -1}
                                        />
                                        </ListItemIcon>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Grid>
                    <Grid item xs = {6}>
                        <Typography>Inventory</Typography>
                        <List
                            style = {{overflow: 'auto', maxHeight: 250}}>
                            {inventory.map( (inventory) => {
                                return (
                                    <ListItem key = {inventory.id} dense button onClick={handleInventoryToggle(inventory.id)}>
                                        <ListItemText 
                                            primary = {inventory.name}
                                            secondary = {inventory.description}/>
                                        <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={inventoryCheckbox.indexOf(inventory.id) !== -1}
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
            <Grid item xs = {12}>
                {checkedUsers.map(user => 
                <Card variant = "outlined" key = {user.id}>
                    <CardContent>
                        <Grid container spacing ={2}>
                            <Grid item xs = {2}>
                                <Typography>{user.fullName}</Typography>
                            </Grid>
                            <Grid item xs = {8}>
                                {user.sports.map(sport => 
                                    <Typography>{sport.name}</Typography>
                                    )}
                            </Grid>
                            <Grid item xs = {2}>
                                <IconButton aria-label="delete" onClick ={handleAthleteToggle(user.id)}>
                                    <CloseIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                    )}

            </Grid>
        </Grid>

    );
  }