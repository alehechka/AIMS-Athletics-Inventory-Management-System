import React, {forwardRef} from "react";
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



export default function Athletes(props) {
  return (
    <div style={{ maxWidth: '100%' }}>
    <MaterialTable
      icons={tableIcons}
      options= {{exportButton: true,
                exportFileName: "AIMS_athlete_report"}}
      actions={[
        {
          icon: Add,
          tooltip: 'Add Athlete',
          isFreeAction: true,
          onClick: (event) => alert("You want to add a new row")
        }]}
        columns={[
        { title: 'ID', field: 'id' , type: 'numeric'},
        { title: 'First', field: 'firstName' },
        { title: 'Last', field: 'lastName'},
        { title: 'Gender', field: 'gender' },
        { title: 'Number', field: 'number' , type: 'numeric'},
        { title: 'Locker', field: 'locker', type:'numeric' },
        { title: 'Class', field: 'class', type: 'numeric' },
        { title: 'Sport', field: 'sport'}
      ]}
      data={[{ id : 1, gender: "male", number: 10, locker: 200, firstName: "John", lastName: "Sportsman", sport: "Soccer", class: "Senior" }]}
      title="Athletes"
    />
    <Link to="/addathlete" className="btn btn-primary">add page</Link>
  </div>
  );
}
