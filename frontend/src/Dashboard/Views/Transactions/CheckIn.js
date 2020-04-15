import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import MaterialTable from "material-table";
import Chip from "@material-ui/core/Chip";
import Icon from "@material-ui/core/Icon";
import StepButton from "@material-ui/core/StepButton";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import CheckInCard from "./CheckInCard";
import { InventoryAPI, UsersAPI } from "../../../api";

export default function CheckOut(props) {
  const parser = new URLSearchParams(props.location.search);
  const userId = parseInt(parser.get("userId"));
  const inventoryId = parseInt(parser.get("inventoryId"));
  
  const [usersSelected, setUsersSelected] = React.useState([]);
  const [userColumns, updateUserColumns] = React.useState([]);
  const [userData, updateUserData] = React.useState([]);
  const [isUserLoading, updateUserLoading] = React.useState(true);


  const [transactions, setTransactions] = React.useState([]);
  const [transactionData, setTransactionData] = React.useState([]);


  React.useEffect(() => {
    updateTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersSelected]);

  function updateTransactions(){
    var listOfItemIds = usersSelected.map( (user) => {
      return (
          user.equipment.map( (transaction) => {
            return (transaction.inventorySize.inventory.id);
        })
      )
    })


    console.log(listOfItemIds);
    var listOfSharedItemIds = getCommonElements(listOfItemIds);
    console.log("Shared " + listOfSharedItemIds);

    setTransactions(
      usersSelected.map( (user) => {
        let listOfItems = user.equipment.map( (transaction) => {
          return {
            id: transaction.inventorySize.inventory.id,
            name: transaction.inventorySize.inventory.name,
            description: transaction.inventorySize.inventory.description,
            size: transaction.inventorySize.size,
            amountCheckedOut: transaction.count,
            amountCheckedIn: 0,
            checked: false};
        })

        console.log(listOfItems);

        let listOfItemsMASTER = JSON.parse(JSON.stringify(listOfItems));

        var listOfSharedItems = []; 

        for(var element of listOfItemsMASTER){
            if(listOfSharedItemIds.includes(element.id)){
              listOfSharedItems.push(...listOfItems.splice(listOfItems.indexOf(element),1));
              var pushed = listOfSharedItems.pop();
              pushed.checked = true;
              pushed.amountCheckedIn = 1;
              listOfSharedItems.push(pushed);
            }
        }

        return {
          user,
          items: listOfItems,
          sharedItems: listOfSharedItems
        }
      })
    )
    console.log(transactions);
  }


  //Need to split into function for shared and unique list
  function updateSingleTransaction(tranIndex, itemIndex, key, value, uniqiue) {
    
    if(uniqiue){
      setTransactions((prev) => {
        prev[tranIndex].items[itemIndex][key] = value;
        return [...prev];
      });
    } else {
      setTransactions((prev) => {
        prev[tranIndex].sharedItems[itemIndex][key] = value;
        return [...prev];
      });
    }


  }


  function getCommonElements(arrays) {
    
    if(arrays.length == 0){
      arrays =[-1];
    }
    var currentValues = {};
    var commonValues = {};
    for (var i = arrays[0].length -1; i >=0; i--){
      currentValues[arrays[0][i]] = 1; 
    }
    for (var i = arrays.length-1; i>0; i--){
      var currentArray = arrays[i];
      for (var j = currentArray.length-1; j >=0; j--){
        if (currentArray[j] in currentValues){
          commonValues[currentArray[j]] = 1; 
        }
      }
      currentValues = commonValues;
      commonValues = {};
    }
    return Object.keys(currentValues).map(function(value){
      return parseInt(value);
    });
  }

  React.useEffect(() => {
    if (props.context.authorized) {
      UsersAPI.getUsers(null, null, {
        isAdmin: true,
        isEmployee: true,
        isCoach: true,
        isAthlete: true,
        withDetails: ["Equipment"]
      }).then((users) => {
        updateUserColumns([
          { title: "ID", field: "id", hidden: true },
          { title: "Sport", field: "sportsJson", hidden: true },
          { title: "userSizes", field: "userSizes", hidden: true },
          { title: "First Name", field: "firstName" },
          { title: "Last Name", field: "lastName" },
          {
            title: "Sport(s)",
            field: "sports",
            render: (rowData) =>
              rowData.sports.map((val, index) => (
                <Chip key={index} label={val.displayName} style={{ margin: 2 }} icon={<Icon>{val.icon}</Icon>}></Chip>
              )),
            customFilterAndSearch: (term, rowData) =>
              rowData.sports
                .map((val) => val.displayName)
                .some((val) => val.toLowerCase().includes(term.toLowerCase())),
            cellStyle: { width: "100%" }
          }
        ]);
        const customData = users.map((user) => {
          let customUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            sportsJson: JSON.stringify(user.sports),
            sports: user.sports,
            equipment: user.equipment,
            tableData: { checked: user.id === userId }
          };
          if (customUser.tableData.checked) {
            setUsersSelected([...usersSelected, customUser]);
            setActiveStep(inventoryId ? 2 : 1);
          }
          return customUser;
        });
        updateUserData(customData);
        updateUserLoading(false);
      });
    }
  }, [props.context.authorized, inventoryId, userId]);



  function getSteps() {
    return transactionData.length
    ? ["Select Users", "Edit Transactions", "View Transactions"]
    : ["Select Users", "Edit Transactions"];
  }

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        if (props.location.pathname !== props.match.path + "/users") {
          props.history.push(props.match.path + "/users?" + parser.toString());
        }
        return (
          <MaterialTable
            title="Users"
            isLoading={isUserLoading}
            columns={userColumns}
            data={userData}
            options={{ selection: true, filtering: true, tableLayout: "auto" }}
            onSelectionChange={(rows) => setUsersSelected(rows)}
          />
        );
      case 1:
        if (props.location.pathname !== props.match.path + "/inventory") {
          props.history.push(props.match.path + "/inventory?" + parser.toString());
        }
        return transactions.map((transaction, index) => (
          <CheckInCard
            key={index}
            tranIndex={index}
            {...transaction}
            updateSingleTransaction={updateSingleTransaction}
          />
        ));
      case 2:
        return <Typography>table goes here</Typography>;
      default:
        return <Typography>Test</Typography>;
    }
  }

  //STEPPER CONFIG
  let step = 0;
  if (props.location.pathname.includes("/inventory")) {
    step = 1;
  } else if (props.location.pathname.includes("/checkOut")) {
    step = 2;
  }
  const [activeStep, setActiveStep] = React.useState(step);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSubmit= () => {
    props.showMessage("Submitting order..." ,"info");
    setTransactionData(transactions);
    handleNext();
    props.showMessage("Order created successfully!");
  }
  //

  return (
    <div style={{ maxWidth: "100%", marginLeft: "10px", marginRight: "10px", marginBottom: "10px" }}>
      <Typography component="h1" variant="h6">
        Check In Equipment {usersSelected.length ? `(${usersSelected.length} users)` : ""}
      </Typography>
      <Stepper nonLinear activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton onClick={handleStep(index)}>
              <StepLabel>{label}</StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <div>
          <Button onClick={handleReset}>Reset</Button>
        </div>
      ) : (
        <div>
          {getStepContent(activeStep)}
          <Grid container justify="space-between" style={{ marginTop: "10px" }}>
            <Grid item>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
            </Grid>
            <Grid item>
              {activeStep === 1 ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              ) : activeStep === steps.length - 1 ? (
                <Button variant="contained" color="primary" onClick={handleReset}>
                  Reset
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleNext}>
                  Next
                </Button>
              )}
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
}

