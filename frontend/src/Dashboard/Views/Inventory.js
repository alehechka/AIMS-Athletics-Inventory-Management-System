import React from "react";
import MaterialTable from "material-table";
import { SportsAPI, InventoryAPI } from "../../api";
import SportsChip from "./Components/SportsChip";
import InventoryDialog from "./Components/InventoryDialog";

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
    jerseyNumbers: false,
    description: "",
    surplus: false,
    taxable: false,
    expendable: false,
    sportId: "",
    sportSize: "",
    alertQuantity: false,
    inventorySizes: [],
  };
  const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

  const blockInventoryEdit = props.context.credentials.role === "Coach";

  const [defaultSport, setDefaultSport] = React.useState({});

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
  const [sportSizes, setSportSizes] = React.useState([]);
  const [sportSize, setSportSize] = React.useState({});
  const [sportObjects, setSportObjects] = React.useState([]);
  const [sportObject, setSportObject] = React.useState({});

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
      const defSport = sports.filter(sport=>sport.default)[0]
      setSportObjects(sports);
      setDefaultSport(defSport)
      setSportObject(defSport);
      setSportSizes(defSport.sportSizes);
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
          //{ title: "Sport", field: "sportsJson", hidden: true },
          { title: "Sports", field: "sportText", hidden: true, },
          { title: "Name", field: "name", cellStyle: { width: "35%" } },
          { title: "Description", field: "description", cellStyle: { width: "65%" } },
          { title: "Barcode", field: "barcode", hidden: true },
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
            },
          },
          { title: "Price", field: "price", type: "currency", searchable: false, filtering: false, },
          { title: "Quantity", field: "quantity", type: "numeric", searchable: false, filtering: false, }
        ]);

        updateData(mapInventory(inventories));
        updateLoading(false);
      })
      .catch((err) => {
        updateLoading(false);
      });
  }
  /**
   * Maps inventories array to array of objects to be displayed in material table.
   * @param {Object[]} inventories - inventory object to be mapped to another Object 
   */
  const mapInventory = (inventories) => {
    return inventories.map((inventory) => ({
      id: inventory.id,
      name: inventory.name,
      description: inventory.description,
      barcode: inventory.barcode,
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
    let value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
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
      if (dialogTitle.includes("Edit")) {
        InventoryAPI.updateInventory({...inputs, sportId: sportObject.id, sportSize})
          .then((res) => {
            updateData(data.map((row) => (row.id === res.id ? mapInventory([res])[0] : row)));
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
        InventoryAPI.createInventory({...inputs, sportId: sportObject.id, sportSize})
          .then((res) => {
            updateData([...data, mapInventory([res])[0]]);
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
          }
        }
        actions={[
          {
            icon: "shopping_cart",
            tooltip: "Transactions",
            onClick: (event, rowData) => {
              props.showMessage("Redirecting to Transactions page...");
              props.history.push(`/checkout?inventoryId=${rowData.id}`);
            }
          },
          {
            icon: "create",
            tooltip: "Edit Inventory Item",
            onClick: (event, rowData) => {
              InventoryAPI.getSingleInventory(rowData.id).then((data) => {
                updateLoading(true);
                setInputs(data);
                setSportObject(sportObjects.filter(sport => sport.id === data.sport.id)[0]);
                let sizes = [];
                for (let sport of sportObjects) {
                  if (sport.id === data.sport.id) {
                    setSportObject(sport);
                    if (!sport.default) {
                      sizes = sizes.concat(sport.sportSizes);
                    }
                  }
                  if (sport.default) {
                    sizes = sizes.concat(sport.sportSizes);
                  }
                }
                setSportSizes(sizes);
                setSportSize(sportSizes.filter(size => size.id === data.sportSize.id)[0])
                setDialogOpen(true);
                setDialogTitle("Edit Inventory Item");
              });
            }
          },
          {
            icon: "add",
            tooltip: "Add To Inventory",
            isFreeAction: true,
            onClick: (event, rowData) => {
              updateLoading(true);
              setInputs(deepCopy({...initialValues, sportId: defaultSport.id}));
              setSportObject(defaultSport);
              setSportSizes(defaultSport.sportSizes);
              setSportSize({});
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
        sportObject={sportObject}
        setSportObject={setSportObject}
        sportObjects={sportObjects}
        sportSizes={sportSizes}
        setSportSizes={setSportSizes}
        sportSize={sportSize}
        setSportSize={setSportSize}
        handleSportChange={handleSportChange}
      />
    </div>
  );
}