import React from 'react';
import MaterialTable from 'material-table';
import {SportsAPI, InventoryAPI} from "../../api";
import SportsChip from './Components/SportsChip';

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

    //material Table hooks
    const [isLoading, updateLoading] = React.useState(true);
    const [data, updateData] = React.useState([]);
    const [columns, updateColumns] = React.useState([]);
    const [pageSize, updatePageSize] = React.useState(5);

    const [sports, setSports] = React.useState([]);
    const [sportIdLookup, setSportIdLookup]= React.useState({});

    /**
     * Emulates ComponentDidMount lifecycle function
     * 
     * Queries the backend for inventory data
     */
    React.useEffect(()=>{
        InventoryAPI.getInventory(null, null, {}).then( (inventories)=> {
            updateColumns([
                {title: 'Item ID', field: 'id', hidden: true},
                {title: 'Name', field: 'name', cellStyle: {width:"35%"}},
				{title: 'Description', field: 'description', cellStyle: {width:"65%"}},
                {title: 'Barcode', field: 'barcode', hidden: true},
                {
                    title: "Sport",
                    field: "sports",
                    sorting: false,
                    render: (rowData) =>
                      rowData.sports.map((val, index) => (
                        <SportsChip key={index} sport={val} />
                      )),
                    customFilterAndSearch: (term, rowData) =>
                      rowData.sports.map((val) => val.displayName).some((val) => val.toLowerCase().includes(term.toLowerCase()))
                  },
                {title: 'Price', field: 'price', type: 'currency', searchable: false, filtering: false},
                {title: 'Quantity', field: 'quantity', type: 'numeric', searchable: false, filtering: false},
            ]);
            const customData = inventories.map(inventory =>({
                id: inventory.id,
                name: inventory.name,
				description: inventory.description,
                barcode: inventory.barcode,
                sports: [inventory.sport],
                price: inventory.averagePrice,
                quantity: inventory.totalQuantity
            }));
            updateData(customData);
            updateLoading(false);
        }).catch(err => {
          updateLoading(false);
        });
        SportsAPI.getSports().then((sports)=> {
            setSports(sports.map(sport => sport.displayName));
            setSportIdLookup(sports.reduce((obj, sport) => {
                obj[sport.displayName] = sport
                return obj
            }, {}));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            tableLayout: "auto"
          }}
          actions={[
            {
              icon: "shopping_cart",
              tooltip: "Transactions",
              onClick: (event, rowData) => {
                props.showMessage("Redirecting to Transactions page...");
                props.history.push(`/checkout?inventoryId=${rowData.id}`);
              }
            }
            // {
            //     icon: 'create',
            //     tooltip: 'Edit',
            //     onClick: (event, rowData) => {
            //         UsersAPI.getSingleUser(rowData.id).then((data)=>{
            //             updateLoading(true);
            //             //Remove all Null entries in json
            //             Object.keys(data).map(key => {data[key] = data[key] ? data[key]: ""; return null;});
            //             setInputs(deepCopy(data));
            //             const rowSportsJson = JSON.parse(rowData.sportsJson);
            //             setSport(rowSportsJson.map(sport => sport.displayName));
            //             setDialogOpen(true);
            //             setDialogTitle("Edit " + renderType);
            //         });
            //     }
            // },
            // {
            //     icon: 'add',
            //     tooltip: 'Add',
            //     isFreeAction: true,
            //     onClick: (event, rowData) => {
            //         updateLoading(true);
            //         setInputs(deepCopy(initialValues));
            //         setSport([]);
            //         setDialogOpen(true);
            //         setDialogTitle("Add " + renderType);
            //     }
            //   },
          ]}
        />
      </div>
    );
}