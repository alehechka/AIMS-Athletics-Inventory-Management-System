import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";

import {SportsAPI, InventoryAPI, UsersAPI} from "../../api";


export default function Transaction(props) {


    const [users, setUsers] = React.useState([]);
    const [usersMaster, setUsersMaster] = React.useState([]);
    const [usersCheckbox, setUsersCheckbox] = React.useState([]);
 
    const [sports, setSports] = React.useState([]);
    const [sportsFilter, setSportsFilter] = React.useState([]);

    const [teams, setTeams] = React.useState([]);

    const [inventory, setInventory] = React.useState([]);
    const [inventoryCheckbox, setInventoryCheckbox] = React.useState([]);
    const [checkedInventory, setCheckedInventory] = React.useState([]);

    const [transactions, setTransactions] = React.useState([]);
 
    const handleSportFilter = (event) => {
        var tempUsers = JSON.parse(JSON.stringify(usersMaster))
        setSportsFilter(event.target.value);
        setUsers(tempUsers.filter(user => user.sports.find(sports => sports.name.includes(event.target.value))) );

    };

    const handleAthleteToggle = (value) => () => {
      const currentIndex = usersCheckbox.indexOf(value);
      const newUsersCheckbox = [...usersCheckbox];
      const newCheckedUser = usersMaster.find(user => user.id === value);

      const newTransactions = [...transactions];
      let newTransaction = {id : newCheckedUser.id, fullName : newCheckedUser.fullName, inventory:[]};
  
      if (currentIndex === -1) {
        newUsersCheckbox.push(value);
        newTransactions.push(newTransaction);
      } else {
        newUsersCheckbox.splice(currentIndex, 1);
        newTransactions.splice(currentIndex,1);
      }

      setUsersCheckbox(newUsersCheckbox);
      setTransactions(newTransactions);

      //console.log(newTransactions);

    };

    const handleInventoryToggle = (value) => () => {
        //console.log(transactions);
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

        //console.log(newCheckedInventory);

        let temp = [];

        newCheckedInventory.forEach(inventory => temp.push({id: inventory.id, name: inventory.name}));
        transactions.forEach(transaction => transaction.inventory = temp)

        //console.log(temp);

        setInventoryCheckbox(newInventoryCheckbox);
        setCheckedInventory(newCheckedInventory);
        setTransactions(transactions);

        //console.log(transactions);

    }

    const handleTransactionToggle= (transactionId, inventoryId) => () => {
        var currentTransaction = transactions.find(transaction => transaction.id === transactionId);
        var indexOfCurrentTransaction = transactions.indexOf(currentTransaction);
        var itemToFind = currentTransaction.inventory.find(inventory => inventory.id === inventoryId);
        var itemExistsInTransaction = currentTransaction.inventory.includes(itemToFind);

        let newTransactions = transactions;

        var inventoryDeepCopy = JSON.parse(JSON.stringify(newTransactions[indexOfCurrentTransaction].inventory))

        if(itemExistsInTransaction)
        {
            var indexToRemove = currentTransaction.inventory.indexOf(itemToFind);
            
            inventoryDeepCopy.splice(indexToRemove,1);
            
            newTransactions[indexOfCurrentTransaction].inventory = inventoryDeepCopy;
            
        } else {

            var itemToAdd = inventory.find(inventory=> inventory.id === inventoryId);

            inventoryDeepCopy.push(itemToAdd);

            newTransactions[indexOfCurrentTransaction].inventory = inventoryDeepCopy;
        }


        setTransactions(newTransactions);
  
    }


    React.useEffect(()=>{
        SportsAPI.getSports().then((sports)=> {
            setSports(sports);
        });

        UsersAPI.getUsers(null, null, {isAdmin: true, isEmployee: true, isCoach: true, isAthlete: true}).then( (users) => {
            setUsers(users);
            setUsersMaster(users);
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
                                        {/*<Checkbox
                                            edge="start"
                                            checked={inventoryCheckbox.indexOf(inventory.id) !== -1}
                                        />*/}
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
                {transactions.map(transaction => 
                <Card variant = "outlined" key = {transaction.id}>
                    <CardContent>
                        <Grid container spacing ={2}>
                            <Grid item xs = {2}>
                                <Typography>Athlete</Typography>
                                <Typography>{transaction.fullName}</Typography>
                            </Grid>
                            <Grid item xs = {3}>
                                <Typography>Inventory</Typography>
                                <List
                                    style = {{overflow: 'auto', maxHeight: 250}}>
                                    {transaction.inventory.map(inventory => {
                                        return (
                                            <ListItem key = {inventory.id} dense>
                                                <ListItemText primary = {inventory.name}></ListItemText>
                                                <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    onChange={handleTransactionToggle(transaction.id, inventory.id)}
                                                    defaultChecked
                                                />
                                                </ListItemIcon>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </Grid>
                            <Grid item xs = {2}>
                                <IconButton aria-label="delete" onClick ={handleAthleteToggle(transaction.id)}>
                                    <CloseIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                    )}
                {/*<Button onClick = {() => console.log(transactions)}>Print Transactions</Button>*/}
            </Grid>
        </Grid>

    );
  }