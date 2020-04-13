import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import MaterialTable from "material-table";
import SportsChip from '../Components/SportsChip';
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


  function updateSingleTransaction(tranIndex, itemIndex, key, value) {
    setTransactions((prev) => {
      prev[tranIndex].items[itemIndex][key] = value;
      return [...prev];
    });
  }


  React.useEffect(() => {
    if (props.context.authorized) {
      UsersAPI.getUsers(null, null, {
        isAdmin: true,
        isEmployee: true,
        isCoach: true,
        isAthlete: true,
        withDetails: ["UserSize"]
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
                <SportsChip key={index} sport={val}/>
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
            userSizes: user.userSizes,
            firstName: user.firstName,
            lastName: user.lastName,
            sportsJson: JSON.stringify(user.sports),
            sports: user.sports,
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
    return ["Select Users", "Edit Transactions"];
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
        return usersSelected.map((user, index) => (
          <CheckInCard
            key={index}
            tranIndex={index}
            user={user}
            updateSingleTransaction={updateSingleTransaction}
          />
        ));
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
  //

  return (
    <div style={{ maxWidth: "100%", marginLeft: "10px", marginRight: "10px", marginBottom: "10px" }}>
      <Typography component="h1" variant="h6">
        Checkout Equipment {usersSelected.length ? `(${usersSelected.length} users)` : ""}
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
          <Typography>All steps completed</Typography>
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
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Submit" : "Next"}
              </Button>
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
}

