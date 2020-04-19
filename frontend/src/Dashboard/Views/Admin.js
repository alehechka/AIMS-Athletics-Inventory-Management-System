import React from "react";
import { UsersAPI, SportsAPI } from "../../api";
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@material-ui/icons/Info';
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

  const [sizesDialogOpen, setSizesDialogOpen] = React.useState(false);
  const [sizesDialogTitle, setSizesDialogTitle] = React.useState("Edit Sport");
  const [sizesDialogContent, setSizesDialogContent] = React.useState("Filler");
  const closeSizesDialog = (editConfirmed) => {
    if (editConfirmed) {

    }
    else {

    }
    setSizesDialogOpen(false);
  };

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
        {title: 'Email', field: 'email', editable: 'never', searchable : true, cellStyle: {width: "40%"}},
        {title: 'First Name', field: 'firstName', ...defaultOptions},
        {title: 'Last Name', field: 'lastName', ...defaultOptions},
        {title: 'Role', field: 'role', cellStyle: {width: "50%"},
        render: rowData  => getRole(rowData.role),
        editComponent: props => (
          <FormControl required component="fieldset">
              <FormGroup row>
                  <FormControlLabel value = "Admin"  label="Admin" 
                    control={<Checkbox checked={props.value.isAdmin} onChange={(e)=>{props.onChange({...props.value, isAdmin: e.target.checked})}} name="Admin" />}/>
                  <FormControlLabel value = "Athlete"  label="Athlete" 
                    control={<Checkbox checked={props.value.isAthlete} onChange={(e)=>{props.onChange({...props.value, isAthlete: e.target.checked})}} name="Athlete" />}/>
                  <FormControlLabel value = "Coach"  label="Coach" 
                    control={<Checkbox checked={props.value.isCoach} onChange={(e)=>{props.onChange({...props.value, isCoach: e.target.checked})}} name="Coach" />}/>
                  <FormControlLabel value = "Employee"  label="Employee" 
                    control={<Checkbox checked={props.value.isEmployee} onChange={(e)=>{props.onChange({...props.value, isEmployee: e.target.checked})}} name="Employee" />}/>
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
        {title: 'Name', field: 'name', cellStyle: { width: "90%"}},
        {title: 'Gender', field: 'gender'},
        {title: 'Sizes', field: 'sportSizes', 
          render: rowData => (
          <Tooltip title= "View Sport Sizes">
            <IconButton onClick = {() => {
                setSizesDialogTitle("View Sport Sizes");
                setSizesDialogOpen(true);
                setSizesDialogContent(JSON.stringify(rowData.sportSizes));
                }}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
        ), editable: 'never'
        },
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
        <Grid item xs={6}>
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
        <Grid item xs={6}>
          <SportsTable
            showMessage = {props.showMessage}
            isSportsLoading = {isSportsLoading}
            updateSportsLoading  = {updateSportsLoading}
            sportsData = {sportsData}
            updateSportsData = {updateSportsData}
            sportsColumns = {sportsColumns}
            sportsPageSize = {sportsPageSize}
            updateSportsPageSize = {updateSportsPageSize}

            sizesDialogTitle = {sizesDialogTitle}
            setSizesDialogTitle = {setSizesDialogTitle}
            sizesDialogContent = {sizesDialogContent}
            setSizesDialogContent ={setSizesDialogContent}
            sizesDialogOpen = {sizesDialogOpen}
            setSizesDialogOpen = {setSizesDialogOpen}
            closeSizesDialog = {closeSizesDialog} 
          />
        </Grid>
      </Grid>
      </div>
  );
}
