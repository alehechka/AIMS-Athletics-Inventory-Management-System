import React from "react";
import MaterialTable from "material-table";
import { SportsAPI, InventoryAPI } from "../../api";
import SportsChip from "./Components/SportsChip";
import InventoryDialog from "./Components/InventoryDialog";
import Icon from "@material-ui/core/Icon";
import { CsvBuilder } from 'filefy';

/**
 * Contains the material table which lets the user edit staff entries.
 *
 * Hooks:
 * Loading - displays a loading icon when backend is queried/modified.
 * data - contains table data
 * columns - contains column information [unchanged for now]
 * pagesize - updates default pageSize for table
 * dialogOpen - contains the state of dialog box
 * dialogTitle - contains the title for dialog box
 * inputs - Object containing all form data to be modified
 * sport - list of sports selected in form
 * sports - object containing all sports available
 * sportIdLookup - Lookup for Sport Objects
 *
 * Props:
 * showMessage Displays a snackbar
 * @param {*} props props passed down from dashboard
 */
export default function Inventory(props) {
  
  const renderType = props.type;

  //List of default values to fill in the form
  const initialValues = {
    name: "",
    color: "",
    jerseyNumber: "",
    description: "",
    surplus: "",
    taxable: "",
    expendable: "",
    sport: "",
    sportSize: "",
	alertQuantity: ""
  };
  const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));
  
  const blockInventoryEdit = props.context.credentials.role === "Coach";
  
  //material Table hooks
  const [isLoading, updateLoading] = React.useState(true);
  const [data, updateData] = React.useState([]);
  const [columns, updateColumns] = React.useState([]);
  const [pageSize, updatePageSize] = React.useState(5);

  //Dialog hooks
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState("Add");
  
  //Form Hooks
  const [inputs, setInputs] = React.useState(deepCopy(initialValues));
  const [sport, setSport] = React.useState([]);
  const [sports, setSports] = React.useState([]);
  const [sportIdLookup, setSportIdLookup] = React.useState({});

  /**
   * Emulates ComponentDidMount lifecycle function
   *
   * Queries the backend for inventory data
   */
  React.useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchData() {
    let selectOptions;
    await SportsAPI.getSports().then((sports) => {
      setSports(sports.map((sport) => sport.displayName));
      setSportIdLookup(
        sports.reduce((obj, sport) => {
          obj[sport.displayName] = sport;
          return obj;
        }, {})
      );
      selectOptions = sports.reduce((obj, sport) => {
        obj[sport.displayName] = sport.displayName;
        return obj;
      }, {});
    });
    await InventoryAPI.getInventory(null, null, {})
      .then((inventories) => {
        updateColumns([
          { title: "Item ID", field: "id", hidden: true },
		  { title: "Sport", field: "sportsJson", hidden: true },
          { title: "Sports", field: "sportText", export: true, hidden: true,},
          { title: "Name", field: "name", export: true, cellStyle: { width: "35%" } },
          { title: "Description", field: "description",  export: true, cellStyle: { width: "65%" } },
          { title: "Barcode", field: "barcode",  export: true, hidden: true },
          {
            title: "Sport",
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
            }
          },
          { title: "Price", field: "price", type: "currency", searchable: false, filtering: false,  export: true },
          { title: "Quantity", field: "quantity", type: "numeric", searchable: false, filtering: false,  export: true }
        ]);

        updateData(mapInventory(inventories));
        updateLoading(false);
      })
      .catch((err) => {
        updateLoading(false);
      });
  }

  const mapInventory = (inventories) => {
    return inventories.map((inventory) => ({
      id: inventory.id,
      name: inventory.name,
      description: inventory.description,
      barcode: inventory.barcode,
	  // Need to fix Json, which will fix most the problems with edit and add
	  //sportsJson: JSON.stringify(inventory.sports),
      //sports: inventory.sports,
      //sportText: inventory.sports.map(sport => sport.displayName).join(", "),
	  sports: [inventory.sport],
      price: inventory.averagePrice,
      quantity: inventory.totalQuantity
    }));
  };

  /**
   * One function which handles all state changes in add/edit user form
   * Sports select statement is excluded
   *
   * @param {} event executed when a input is changed
   */
  const changeInput = (event) => {
    const key = event.target.name;
    let value = event.target.value;
    //special handler for checkbox button
	// Needs to be finished and linked up with InventoryDialog
    if (key === true) {
      value = value === "expendable";
    }
    setInputs({ ...inputs, [key]: value });
  };
  /**
   * handles changes in sports select input
   * @param {*} event
   */
  const handleSportChange = (event) => {
    setSport(event.target.value);
  };
  /**
   * Closes Dialog Box and sends the updated data to the backend
   *
   * @param {*} type true if user clicked on confirm else false
   */
  const closeDialog = (type) => {
    setDialogOpen(false);
    if (type) {
      const sportIds = sport.filter((name) => !sportIdLookup[name].default).map((name) => sportIdLookup[name].id);
      const newSportsJson = sport.map((sportName) => ({
        id: sportIdLookup[sportName].id,
        displayName: sportIdLookup[sportName].displayName,
        gender: sportIdLookup[sportName].gender,
        icon: sportIdLookup[sportName].icon
      }));
      const updatedInventory = {
        name: inputs.name,
        description: inputs.description,
        sportsJson: JSON.stringify(newSportsJson),
        sports: newSportsJson,
        sportText: newSportsJson.map(sport => sport.displayName).join(", ")
      };
      const newInventory = deepCopy(inputs);
      Object.keys(newInventory).map((key) => {
        if (newInventory[key] === "") {
          delete newInventory[key];
        }
        return null;
      });
      newInventory.schoolId = props.context.organization.id;
      newInventory.sports = sportIds;
      if (dialogTitle.includes("Edit")) {
        updatedInventory.id = inputs.id;
        newInventory.id = inputs.id;
        InventoryAPI.updateInventory(newInventory)
          .then((res) => {
            updatedInventory.id = res.id;
            updateData(data.map((row) => (row.id === updatedInventory.id ? updatedInventory : row)));
            updateLoading(false);
            props.showMessage(dialogTitle + " Done");
          })
          .catch((err) => {
            props.showMessage("Error:" + err, "error");
            updateLoading(false);
          });
      } else {
        if (inputs.role !== "Athlete") {
          inputs["is" + inputs.role] = true;
        }
        InventoryAPI.createInventory(
          inputs.name,
          inputs.description,
		  inputs.averagePrice,
		  inputs.totalQuantity,
          inputs.surplus,
          inputs.taxable,
          inputs.expendable,
          inputs.sportSizeId,
          newInventory
        )
          .then((res) => {
            updatedInventory.id = res.id;
            updateData([...data, updatedInventory]);
            updateLoading(false);
            props.showMessage(dialogTitle + " Done");
          })
          .catch((err) => {
            props.showMessage("Error:" + err, "error");
            updateLoading(false);
          });
      }
    } else {
      props.showMessage(dialogTitle + " Canceled", "info");
      updateLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "100%", marginLeft: "10px", marginRight: "10px", marginBottom: "10px" }}>
      <MaterialTable
        title="Inventory"
        isLoading={isLoading}
        columns={columns}
        data={data}
        pageSize={pageSize}
        onChangeRowsPerPage={updatePageSize}
        options={{
          search: true,
          filtering: true,
          actionsColumnIndex: -1,
          tableLayout: "auto",
		  exportButton: true,
          exportCsv: () => {
            const filterColumns = columns.filter(columnDef=> columnDef.export);
            const filterData = data.map(rowData => filterColumns.map(columnDef=> rowData[columnDef.field]));
            new CsvBuilder('InventoryReport.csv')
              .setDelimeter(",")
              .setColumns(filterColumns.map(columnDef => columnDef.title))
              .addRows(filterData)
              .exportFile();
          }
        }}
        actions={[
          {
            icon: "create",
            tooltip: "Edit Inventory Item",
            onClick: (event, rowData) => {
              InventoryAPI.getSingleInventory(rowData.id).then((data) => {
                updateLoading(true);
                //Remove all Null entries in json
                Object.keys(data).map((key) => {
                  data[key] = data[key] ? data[key] : "";
                  return null;
                });
                setInputs(deepCopy(data));
				// rowSportsJson causing issues and preventing update
                
				//const rowSportsJson = JSON.parse(rowData.sportsJson);
                //setSport(rowSportsJson.map((sport) => sport.displayName));
                setDialogOpen(true);
                setDialogTitle("Edit Inventory Item");
              });
            }
          },
		  {
            icon: "shopping_cart",
            tooltip: "Transactions",
            onClick: (event, rowData) => {
              props.showMessage("Redirecting to Transactions page...");
              props.history.push(`/checkout?inventoryId=${rowData.id}`);
            }
          },
		  {
            icon: "add",
            tooltip: "Add To Inventory",
            isFreeAction: true,
            onClick: (event, rowData) => {
              updateLoading(true);
              setInputs(deepCopy(initialValues));
              setSport([]);
              setDialogOpen(true);
              setDialogTitle("Add Item To Inventory");
            }
          },
		  {
            icon: "delete",
            tooltip: "Remove From Inventory",
            onClick: (event, rowData) => {
              props.showMessage("Removing item from Inventory Page.");
			  //Needs to call removed funtion so items are actually removed
            }
          },
          {
            icon: "update",
            tooltip: "Refresh Inventory",
            isFreeAction: true,
            onClick: async (event, rowData) => {
              props.showMessage("Refreshing inventory...", "info");
              updateLoading(true);
              await InventoryAPI.getInventoryFromBackend(null, null, {})
                .then((inventory) => {
                  updateData(mapInventory(inventory));
                  updateLoading(false);
                  props.showMessage("Successfully updated inventory!");
                })
                .catch((err) => {
                  updateLoading(false);
                  props.showMessage("Failed to update inventory.", "error");
                });
            }
          }
        ]}
      />
	  <InventoryDialog
        {...props}
        renderType={renderType}
        dialogOpen={dialogOpen}
        closeDialog={closeDialog}
        dialogTitle={dialogTitle}
        inputs={inputs}
        changeInput={changeInput}
        sport={sport}
        sports={sports}
        handleSportChange={handleSportChange}
      />
    </div>
  );
}