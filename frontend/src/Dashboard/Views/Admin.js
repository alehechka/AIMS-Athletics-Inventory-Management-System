import React from "react";
import { UsersAPI, SportsAPI } from "../../api";
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import RolesTable from "./AdminComponents/RolesTable";
import SportsTable from "./AdminComponents/SportsTable";

/***
 * Contains the logic for admin page.
 * 
 * Hooks:
 * Loading - displays a loading icon when backend is queried/modified.
 * data - contains table data
 * columns - contains column information [unchanged for now]
 * pagesize - updates default pageSize for table
 */
export default function Admin(props) {
  //material Table hooks
  const [isRoleLoading, updateRoleLoading] = React.useState(true);
  const [roleData, updateRoleData] = React.useState([]);
  const [roleColumns, updateRoleColumns] = React.useState([]);
  const [rolePageSize, updateRolePageSize] = React.useState(5);

  const [isSportsLoading, updateSportsLoading] = React.useState(true);
  const [sportsData, updateSportsData] = React.useState([]);
  const [sportsColumns, updateSportsColumns] = React.useState([]);
  const [sportsPageSize, updateSportsPageSize] = React.useState(5);

  const { getRole } = props.context.actions;

  /**
   * Emulates ComponentDidMount lifecycle function
   * 
   * Queries the backend for credential data and populates the table.
   */
  React.useEffect(()=>{
    const defaultOptions = { editable: 'never', hidden: true, searchable: true };
    UsersAPI.getUsers(null, null, {isAdmin: true, isAthlete: true, isCoach: true, isEmployee: true}).then( (users)=> {
      //lets users search hidden columns
      updateRoleColumns([
        {title: 'ID', field: 'id', ...defaultOptions},
        {title: 'Email', field: 'email', editable: 'never', searchable : true},
        {title: 'First Name', field: 'firstName', ...defaultOptions},
        {title: 'Last Name', field: 'lastName', ...defaultOptions},
        {title: 'Role', field: 'role', cellStyle: {width:"100%"},
        render: rowData  => getRole(rowData.role),
        editComponent: props => (
          <FormControl required component="fieldset">
              <FormGroup>
                  <FormControlLabel value = "Admin"  label="Admin" 
                    control={<Checkbox checked={props.value.isAdmin} onChange={()=>{props.onChange({...props.value, isAdmin: true})}} name="Admin" />}/>
                  <FormControlLabel value = "Athlete"  label="Athlete" 
                    control={<Checkbox checked={props.value.isAthlete} onChange={()=>{props.onChange({...props.value, isAthlete: true})}} name="Athlete" />}/>
                  <FormControlLabel value = "Coach"  label="Coach" 
                    control={<Checkbox checked={props.value.isCoach} onChange={()=>{props.onChange({...props.value, isCoach: true})}} name="Coach" />}/>
                  <FormControlLabel value = "Employee"  label="Employee" 
                    control={<Checkbox checked={props.value.isEmployee} onChange={()=>{props.onChange({...props.value, isEmployee: true})}} name="Employee" />}/>
              </FormGroup>
          </FormControl>)
        }
      ]);
      const newRoleData = users.map(user=> {
        return {
          id: user.id,
          email: user.credential.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.credential,
        };
      });
      updateRoleData(newRoleData);
      updateRoleLoading(false);
    });
    SportsAPI.getSports().then((res)=> {
      updateSportsColumns([
        {name: 'ID', field: 'id', ...defaultOptions},
        {title: 'Name', field: 'name', cellStyle: {width:"100%"}},
        {title: 'Gender', field: 'gender'},
        {title: 'Icon', field: 'icon', ...defaultOptions},
        {title: 'Default', field: 'default', type: 'boolean', editable: 'never', searchable: false, filtering: false},
        {title: 'Display Name', field: 'displayName', ...defaultOptions}
      ]);
      updateSportsData(res);
      updateSportsLoading(false);
    });
  }, [getRole]);
  return (
    <div style={{ maxWidth: '100%', marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}>
      <Grid container spacing={3}>
        <Grid item xs="auto">
          <RolesTable
            showMessage = {props.showMessage}
            isRoleLoading = {isRoleLoading}
            updateRoleLoading  = {updateRoleLoading}
            roleData = {roleData}
            updateRoleData = {updateRoleData}
            roleColumns = {roleColumns}
            rolePageSize = {rolePageSize}
            updateRolePageSize = {updateRolePageSize}
          />
        </Grid>
        <Grid item xs="auto">
          <SportsTable
            showMessage = {props.showMessage}
            isSportsLoading = {isSportsLoading}
            updateSportsLoading  = {updateSportsLoading}
            sportsData = {sportsData}
            updateSportsData = {updateSportsData}
            sportsColumns = {sportsColumns}
            sportsPageSize = {sportsPageSize}
            updateSportsPageSize = {updateSportsPageSize}
          />
        </Grid>
      </Grid>
      </div>
  );
}
