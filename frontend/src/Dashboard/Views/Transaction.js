import React from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
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
import Box from "@material-ui/core/Box";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import MaterialTable from "material-table";
import Chip from "@material-ui/core/Chip";
import Icon from "@material-ui/core/Icon";

import { SportsAPI, InventoryAPI, UsersAPI } from "../../api";
import { StepContent } from "@material-ui/core";

export default function Transaction(props) {

    const [usersSelected, setUsersSelected] = React.useState([]);
    const [userColumns, updateUserColumns] = React.useState([]);
    const [userData, updateUserData] = React.useState([]);
    const [isUserLoading, updateUserLoading] = React.useState(true);

    const [inventorySelected, setInventorySelected] = React.useState([]);
    const [inventoryColumns, updateInventoryColumns] = React.useState([]);
    const [inventoryData, updateInventoryData] = React.useState([]);
    const [isInventoryLoading, updateInventoryLoading] = React.useState(true);

    React.useEffect(() => {

        UsersAPI.getUsers(null, null, { isAdmin: true, isEmployee: true, isCoach: true, isAthlete: true }).then((users) => {
          updateUserColumns([
            {title: 'ID', field: 'id', hidden: true},
            {title: 'Sport', field: 'sportsJson', hidden: true},
            {title: 'First Name', field: 'firstName'},
            {title: 'Last Name', field: 'lastName'},
            {title: 'Sport(s)', field: 'sports',
                render: rowData => rowData.sports.map((val, index) =>
                    <Chip key={index} 
                        label={val.displayName} style ={{margin: 2}}
                        icon={<Icon>{val.icon}</Icon>}>
                    </Chip>),
                customFilterAndSearch: (term, rowData) => 
                    rowData.sports
                    .map(val => val.displayName)
                    .some(val => val.toLowerCase().includes(term.toLowerCase())),
                cellStyle: {width:"100%"}
            }
            ]);
            const customData = users.map(user =>({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                sportsJson: JSON.stringify(user.sports),
                sports: user.sports
            }));
            updateUserData(customData);
            updateUserLoading(false);
        });
    
        //setTeams([{id: 1, name: "The Ball Boys"}, {id:2, name: "Sportsmen"}]);
    
        InventoryAPI.getInventory(null, null, {}).then((inventory) => {
          updateInventoryColumns([
            {title: 'ID', field: 'id', hidden: true},
            {title: 'Name', field: 'name'},
            {title: 'Description', field: 'description'},
            {title: 'Quantity', field: 'quantity'}
            ]);
            const customData = inventory.map(inventory =>({
                id: inventory.id,
                name: inventory.name,
                description: inventory.description,
                quantity: inventory.totalQuantity
            }));
            updateInventoryData(customData);
            updateInventoryLoading(false);
        });
      }, []);

      function getSteps() {
        return ['Select Users', 'Select Inventory', 'Edit Transactions'];
      }

      function getStepContent(stepIndex) {
            switch (stepIndex) {
            case 0:
                return(       
                    <div style={{ maxWidth: '100%' }}>
                        <MaterialTable
                        title="Users"
                        isLoading = {isUserLoading}
                        columns={userColumns}
                        data={userData}
                        options={{selection : true}}
                        onSelectionChange= {(rows) => setUsersSelected(rows)}
                        />
                </div>)
            case 1:
                return(       
                    <div style={{ maxWidth: '100%' }}>
                        <MaterialTable
                        title="Inventory"
                        isLoading = {isInventoryLoading}
                        columns={inventoryColumns}
                        data={inventoryData}
                        options={{selection : true}}
                        onSelectionChange= {(rows) => setInventorySelected(rows)}
                        />
                </div>)
            case 2:
                return <Typography>Test2</Typography>;
            default:
                return <Typography>Test</Typography>;
            }
        }

      //STEPPER CONFIG
      const [activeStep, setActiveStep] = React.useState(0);
      const steps = getSteps();
    
      const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      };
    
      const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
      };
    
      const handleReset = () => {
        setActiveStep(0);
      };
      //

    return(
        <div>
        <Typography>Transactions</Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>
          {activeStep === steps.length ? (
            <div>
              <Typography>All steps completed</Typography>
              <Button onClick={handleReset}>Reset</Button>
            </div>
          ) : (
            <div>
              {getStepContent(activeStep)}
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button variant="contained" color="primary" onClick={handleNext}>
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>

              </div>
            </div>
          )}
        </div>
      </div>
    )
}