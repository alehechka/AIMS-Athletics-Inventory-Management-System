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
import CheckOutCard from "./CheckOutCard";
import { InventoryAPI, UsersAPI, TransactionAPI } from "../../../api";

export default function CheckOut(props) {
  const parser = new URLSearchParams(props.location.search);
  const userId = parseInt(parser.get("userId"));
  const inventoryId = parseInt(parser.get("inventoryId"));
  const [usersSelected, setUsersSelected] = React.useState([]);
  const [userColumns, updateUserColumns] = React.useState([]);
  const [userData, updateUserData] = React.useState([]);
  const [isUserLoading, updateUserLoading] = React.useState(true);

  const [inventorySelected, setInventorySelected] = React.useState([]);
  const [inventoryColumns, updateInventoryColumns] = React.useState([]);
  const [inventoryData, updateInventoryData] = React.useState([]);
  const [isInventoryLoading, updateInventoryLoading] = React.useState(true);

  const [transactions, setTransactions] = React.useState([]);

  function updateTransactions() {
    setTransactions(
      usersSelected.map((user) => {
        return {
          user,
          items: inventorySelected.map((item) => {
            return {
              ...item,
              checked: true,
              amount: 1,
              inventorySize: item.inventorySizes.filter((inventorySize) => {
                return (
                  user.userSizes.filter((userSize) => userSize.sportSizeId === item.sportSize)[0]?.size ===
                  inventorySize.size
                );
              })[0]?.id
            };
          })
        };
      })
    );
  }

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

      InventoryAPI.getInventory(null, null, {}).then((inventory) => {
        updateInventoryColumns([
          { title: "ID", field: "id", hidden: true },
          { title: "inventorySizes", field: "inventorySizes", hidden: true },
          { title: "Name", field: "name" },
          { title: "Description", field: "description", cellStyle: { width: "100%" } },
          { title: "sportSize", field: "sportSize", hidden: true },
          {
            title: "Sport",
            field: "sports",
            render: (rowData) =>
              rowData.sports.map((val, index) => (
                <Chip key={index} label={val.displayName} style={{ margin: 2 }} icon={<Icon>{val.icon}</Icon>}></Chip>
              )),
            customFilterAndSearch: (term, rowData) =>
              rowData.sports.map((val) => val.displayName).some((val) => val.toLowerCase().includes(term.toLowerCase()))
          },
          { title: "Quantity", field: "quantity" }
        ]);
        const customData = inventory.map((inventory) => {
          let customerInventory = {
            id: inventory.id,
            inventorySizes: inventory.inventorySizes,
            name: inventory.name,
            description: inventory.description,
            sportSize: inventory.sportSize.id,
            sports: [inventory.sportSize.sport],
            quantity: inventory.totalQuantity,
            tableData: { checked: inventory.id === inventoryId }
          };
          if (customerInventory.tableData.checked) {
            setInventorySelected([...inventorySelected, customerInventory]);
            setActiveStep(userId ? 2 : 0);
          }
          return customerInventory;
        });
        updateInventoryData(customData);
        updateInventoryLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.context.authorized, inventoryId, userId]);

  React.useEffect(() => {
    updateTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersSelected, inventorySelected]);

  function getSteps() {
    return ["Select Users", "Select Inventory", "Edit Transactions"];
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
            onSelectionChange={(rows) => {
              setUsersSelected(rows);
            }}
          />
        );
      case 1:
        if (props.location.pathname !== props.match.path + "/inventory") {
          props.history.push(props.match.path + "/inventory?" + parser.toString());
        }
        return (
          <MaterialTable
            title="Inventory"
            isLoading={isInventoryLoading}
            columns={inventoryColumns}
            data={inventoryData}
            options={{ selection: true, filtering: true, tableLayout: "auto" }}
            onSelectionChange={(rows) => {
              setInventorySelected(rows);
            }}
          />
        );
      case 2:
        if (props.location.pathname !== props.match.path + "/transactions") {
          props.history.push(props.match.path + "/transactions?" + parser.toString());
        }
        return transactions.map((transaction, index) => (
          <CheckOutCard
            key={index}
            tranIndex={index}
            {...transaction}
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
  } else if (props.location.pathname.includes("/transactions")) {
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
  
  const handleSubmit = () => {
    TransactionAPI.checkOut(transactions);
  }

  return (
    <div style={{ maxWidth: "100%", marginLeft: "10px", marginRight: "10px", marginBottom: "10px" }}>
      <Typography component="h1" variant="h6">
        Checkout Equipment {usersSelected.length ? `(${usersSelected.length} users)` : ""}{" "}
        {inventorySelected.length ? `(${inventorySelected.length} items)` : ""}
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
              {activeStep === steps.length - 1 ? (
                <Button variant="contained" color="secondary" onClick={handleSubmit}>
                  Submit
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
