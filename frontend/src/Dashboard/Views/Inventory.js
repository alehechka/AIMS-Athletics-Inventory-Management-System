import React, {forwardRef} from "react";
import {InventoryAPI} from "../../api";
import MaterialTable from 'material-table'
import {Link} from "react-router-dom";
import Add from '@material-ui/icons/Add';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
Add: forwardRef((props, ref) => <Add {...props} ref={ref} />),
Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

export default function Inventory(props) {
  
  const [inventory, setInventory] = React.useState([]);
  
  React.useEffect(()=>{

        InventoryAPI.getInventory(null,null, {}).then( (inventory)=> {
            setInventory(inventory);
        });
        console.log(inventory)
    
    }, [inventory]);

  return (
    <div style={{ maxWidth: '100%' }}>
    <MaterialTable
      icons={tableIcons}
      options= {{exportButton: true,
                exportFileName: "AIMS_inventory_report"}}
      actions={[
        {
          icon: Add,
          tooltip: 'Add to Inventory',
          isFreeAction: true,
          onClick: (event) => alert("Add an item to inventory")
        }]}
        columns={[
        { title: 'ID', field: 'id' , type: 'numeric'},
        { title: 'Sport', field: 'sport' },
        { title: 'Name', field: 'name'},
        { title: 'Barcode', field: 'barcode' , type: 'numeric'},
        { title: 'Price', field: 'price', type:'numeric' },
        { title: 'Quantity', field: 'quantity', type: 'numeric' }
      ]}
      data={[{ id : 357, sport: "Basketball", name: "Black Adidas Hoodie", barcode: 123456, price: 59, quantity: 60 }]}
      title="Inventory"
    />
	<Link to="/addinventory" className="btn btn-primary">add page</Link>
  </div>
  );
}