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
import Button from "@material-ui/core/Button";

import {SportsAPI, UsersApi, UsersAPI} from "../../api";

export default function Transaction(props) {

    const [checked, setChecked] = React.useState([]);
    const [checkedUsers, setCheckedUsers] = React.useState([]);
    const [sports, setSports] = React.useState([]);
    const [sportsFilter, setSportsFilter] = React.useState([]);
    const [usersMaster, setUsersMaster] = React.useState([]);
    const [users, setUsers] = React.useState([]);
    const [teams, setTeams] = React.useState([]);

    const handleSportFilter = (event) => {
        var tempUsers = JSON.parse(JSON.stringify(usersMaster))
        setSportsFilter(event.target.value);
        setUsers(tempUsers.filter(user => user.sports.find(sports => sports.name.includes(event.target.value))) );

    };

    const handleToggle = (value) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];
      const newCheckedUsers = [...checkedUsers];
      const newCheckedUser = usersMaster.find(user => user.id === value);

      console.log(newCheckedUser);
  
      if (currentIndex === -1) {
        newChecked.push(value);
        newCheckedUsers.push(newCheckedUser);
      } else {
        newChecked.splice(currentIndex, 1);
        newCheckedUsers.splice(currentIndex,1);
      }

      setChecked(newChecked);
      setCheckedUsers(newCheckedUsers);

    };


    React.useEffect(()=>{
        SportsAPI.getSports().then((sports)=> {
            setSports(sports);
        });

        UsersAPI.getUsers(null, null, {isAdmin: true, isEmployee: true, isCoach: true, isAthlete: true}).then( (users) => {
            setUsers(users)
            setUsersMaster(users)
        });

        setTeams([{id: 1, name: "The Ball Boys"}, {id:2, name: "Sportsmen"}]);
    
    }, []);

    return (
        <Grid item xs = {12} >
            <Card variant = "outlined">
                <CardContent>
                <Grid container spacing = {3}>
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
                                    <ListItem key = {user.id} dense button onClick={handleToggle(user.id)}>
                                        <ListItemText 
                                            primary = {user.fullName}
                                            secondary = {user.isActive}/>
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
            <Grid item xs = {12}>
                {checkedUsers.map(user => 
                <Card variant = "outlined">
                    <CardContent>
                        <Typography>{user.fullName}</Typography>
                    </CardContent>
                </Card>
                    )}

            </Grid>
        </Grid>

    );
  }