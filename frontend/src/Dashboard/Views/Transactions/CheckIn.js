import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import MaterialTable from "material-table";
import SportsChip from "../Components/SportsChip";
import StepButton from "@material-ui/core/StepButton";
import Grid from "@material-ui/core/Grid";
import TransactionTable from "./TransactionTable";
import CheckInCard from "./CheckInCard";
import { UsersAPI, TransactionAPI, SportsAPI } from "../../../api";

/** @module CheckIn */

/**
 * Contains the logic for admin page containing sport and role tables.
 *
 * Hooks:
 * Loading - displays a loading icon when backend is queried/modified.
 * data - contains table data
 * columns - contains column information 
 * 
 * @param {Object} props - props passed down from Dashboard
 * @returns {Component} returns the component to be rendered
 */
export default function CheckIn(props) {

  const parser = new URLSearchParams(props.location.search);

  const userId = parseInt(parser.get("userId"));
  const inventoryId = parseInt(parser.get("inventoryId"));

  const [usersSelected, setUsersSelected] = React.useState([]);
  const [userColumns, updateUserColumns] = React.useState([]);
  const [userData, updateUserData] = React.useState([]);
  const [isUserLoading, updateUserLoading] = React.useState(true);

  const [transactions, setTransactions] = React.useState([]);
  const [transactionData, setTransactionData] = React.useState([]);
  const [isTransactionLoading, setTransactionLoading] = React.useState(true);

  React.useEffect(() => {
    updateTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersSelected]);

    /**
   * Called when a new user is added to a transaction
   * Refactors the list of shared and unique items
   */
  function updateTransactions() {
    var listOfItemIds = usersSelected.map((user) => {
      return user.equipment.map((transaction) => {
        return transaction.inventorySize.inventory.id;
      });
    });

    var listOfSharedItemIds = getCommonElements(listOfItemIds);

    setTransactions(
      usersSelected.map((user) => {
        let listOfItems = user.equipment.map((transaction) => {
          return {
            inventoryId: transaction.inventorySize.inventory.id,
            equipmentId: transaction.id,
            name: transaction.inventorySize.inventory.name,
            description: transaction.inventorySize.inventory.description,
            size: transaction.inventorySize.size,
            amountCheckedOut: transaction.count,
            amountCheckedIn: 0,
            checked: false
          };
        });

        let listOfItemsMASTER = JSON.parse(JSON.stringify(listOfItems));

        var listOfSharedItems = [];

        for (var element of listOfItemsMASTER) {
          if (listOfSharedItemIds.includes(element.inventoryId)) {
            element.checked = true;
            element.amountCheckedIn = 1;
            listOfSharedItems.push(element);
            listOfItems.splice(element, 1);
          }
        }

        return {
          user,
          items: listOfItems,
          sharedItems: listOfSharedItems
        };
      })
    );
    //console.log(transactions);
  }

   /**
   * Allows for a single transaction to be changed
   * Change implies that the amount has been updated
   **/
  function updateSingleTransaction(tranIndex, itemIndex, key, value, uniqiue) {
    if (uniqiue) {
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

  /**
   * Helper function for returning a list containing the common elements
   * @param {Object} arrays - combined array of unique and shared items
   * @returns {Array} values - array of items that are common between the arrays
   */

  function getCommonElements(arrays) {
    if (arrays.length === 0) {
      arrays = [-1];
    }
    let currentValues = {};
    let commonValues = {};
    for (let i = arrays[0].length - 1; i >= 0; i--) {
      currentValues[arrays[0][i]] = 1;
    }
    for (let i = arrays.length - 1; i > 0; i--) {
      let currentArray = arrays[i];
      for (let j = currentArray.length - 1; j >= 0; j--) {
        if (currentArray[j] in currentValues) {
          commonValues[currentArray[j]] = 1;
        }
      }
      currentValues = commonValues;
      commonValues = {};
    }
    return Object.keys(currentValues).map(function(value) {
      return parseInt(value);
    });
  }

  React.useEffect(() => {
    if (props.context.authorized) {
      fetchData();
    }
  }, [props.context.authorized, userId, inventoryId]);

  /**
   * loads data from the backend to populate the tables for users and inventory
   * @async
   */
  async function fetchData() {
    let selectOptions;
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
          render: (rowData) => rowData.sports.map((val, index) => <SportsChip key={index} sport={val} />),
          lookup: selectOptions,
          customFilterAndSearch: (term, rowData) => {
            if (Array.isArray(term)) {
              if (term.length === 0) return true;
              return term.some((selectedVal) => rowData.sports.map((val) => val.displayName).includes(selectedVal));
            }
            return rowData.sports
              .map((val) => val.displayName)
              .some((val) => val.toLowerCase().includes(term.toLowerCase()));
          },
          cellStyle: { width: "20%" }
        },
        { cellStyle: { width: "80%" } }
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

  /**
   * Helper function for getting page titles for the stepper
   * @returns step title
   */
  function getSteps() {
    return transactionData.length
      ? ["Select Users", "Edit Transactions", "View Transactions"]
      : ["Select Users", "Edit Transactions"];
  }

  /**
   * Gets the content to be rendered for the current step
   * @param {Number} stepIndex - index of the current step
   * @returns the react component to be rendered for the current step
   */
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
        if (props.location.pathname !== props.match.path + "/checkin") {
          props.history.push(props.match.path + "/checkin?" + parser.toString());
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
        return <TransactionTable transactionData={transactionData} isTransactionLoading={isTransactionLoading} />;
      default:
        return <Typography>Test</Typography>;
    }
  }

  //STEPPER CONFIG
  let step = 0;

  const [activeStep, setActiveStep] = React.useState(step);
  const steps = getSteps();

  /**
   * Handles the logic for getting the next step
   */
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  /**
   * Handles the logic for getting the previous setp
   */
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  /**
   * Handles the logic for the current step
   * @param {Number} step - current step
   */
  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  /**
   * Handles the logic for the rest button setting the active step to 0
   */
  const handleReset = () => {
    setActiveStep(0);
  };

  /**
   * Submits the current transactions and advances to the next step
   */
  const handleSubmit = () => {
    props.showMessage("Submitting order...", "info");

    var formattedTransactions = transactions.map((transaction) => {
      return {
        ...transaction,
        items: transaction.items.concat(transaction.sharedItems)
      };
    });

    TransactionAPI.checkIn(formattedTransactions)
      .then((formattedTransactions) => {
        setUsersSelected([]);
        updateUserData((prev) => {
          return prev.map((user) => {
            return {
              ...user,
              tableData: {
                ...user.tableData,
                checked: false
              }
            };
          });
        });
        setTransactionData(formattedTransactions);
        setTransactionLoading(false);
        props.showMessage("Order created successfully!");
        handleNext();
      })
      .catch((err) => {
        console.log(err);
        props.showMessage("Order failed to complete.", "error");
      });
  };

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
                  disabled={
                    usersSelected.length === 0 ||
                    (transactions.filter((tran) => {
                      return tran.items.filter((item) => {
                        return item.checked;
                      }).length;
                    }).length === 0 &&
                      transactions.filter((tran) => {
                        return tran.sharedItems.filter((item) => {
                          return item.checked;
                        }).length;
                      }).length === 0)
                  }
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
