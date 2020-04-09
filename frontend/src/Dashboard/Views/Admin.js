import React from "react";
import MaterialTable from 'material-table';
import { UsersAPI, SportsAPI } from "../../api";
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';


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
        {title: 'Role', field: 'role', editComponent: props => (
          <FormControl required component="fieldset">
              <RadioGroup row value={props.value} name= "role" onChange={e => props.onChange(e.target.value)}>
                  <FormControlLabel value = "Admin"  label="Admin" control={<Radio />}/>
                  <FormControlLabel value = "Athlete"  label="Athlete" control={<Radio />}/>
                  <FormControlLabel value = "Coach"  label="Coach" control={<Radio />}/>
                  <FormControlLabel value = "Employee"  label="Employee" control={<Radio />}/>
              </RadioGroup>
          </FormControl>)
        }
      ]);
      const newRoleData = users.map(user=> {
        return {
          id: user.id,
          email: user.credential.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: props.context.actions.getRole(user.credential),
        };
      });
      updateRoleData(newRoleData);
      updateRoleLoading(false);
    });
    SportsAPI.getSports().then((res)=> {
      updateSportsColumns([
        {name: 'ID', field: 'id', ...defaultOptions},
        {title: 'Name', field: 'name'},
        {title: 'Gender', field: 'gender'},
        {title: 'Icon', field: 'icon', ...defaultOptions},
        {title: 'Default', field: 'default', type: 'boolean', editable: 'never'},
        {title: 'Display Name', field: 'displayName', ...defaultOptions}
      ]);
      updateSportsData(res);
      updateSportsLoading(false);
    });
  }, []);
  return (
    <div style={{ maxWidth: '100%', marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <MaterialTable
              title="Roles"
              isLoading= {isRoleLoading}
              columns={roleColumns}
              data={roleData}
              pageSize = {rolePageSize}
              onChangeRowsPerPage = {updateRolePageSize}
              options={{
                  search: true,
                  filtering: true,
                  actionsColumnIndex: -1,
                  tableLayout: "fixed",
              }}
              editable={{
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                      const fullName = newData.firstName + " " + newData.lastName;
                      if (oldData.role === newData.role) {
                        resolve();
                        props.showMessage(`You didn't change the role for ${fullName}.`, "info");
                      }
                      else {
                        setTimeout(() => {
                            if (Math.random() < 0.9){
                              updateRoleData(roleData.map(user => newData.id === user.id ? newData : user));                 
                              props.showMessage(`${fullName}'s role successfully changed to ${newData.role}!`);
                              resolve();
                            }
                            else {
                              reject();
                              props.showMessage(`Unable to change the role for ${fullName}!`, "error");
                            }
                        }, 500);
                      }
                  }),
              }}
          /> 
        </Grid>
        <Grid item xs={6}>
        <MaterialTable
              title="Sports"
              isLoading= {isSportsLoading}
              columns={sportsColumns}
              data={sportsData}
              pageSize = {sportsPageSize}
              onChangeRowsPerPage = {updateSportsPageSize}
              options={{
                  search: true,
                  filtering: true,
                  actionsColumnIndex: -1,
                  tableLayout: "fixed",
              }}
              editable={{
                  onRowAdd: newData =>
                    new Promise((resolve, reject) => {
                     if (newData.name.length === 0) {
                      resolve();
                      props.showMessage(`Sports Name cannot be empty.`, "warning");
                     }
                     else {
                       newData.displayName = newData.name + ` (${newData.gender})`;
                       SportsAPI.createSport(newData).then((res) =>{
                          newData.id = res.id;
                          updateSportsData(sportsData.concat([newData]));
                          props.showMessage(`Added entry for ${newData.displayName}`);
                          resolve();
                        }).catch(err => {
                          props.showMessage(`Unable to add entry for ${newData.displayName}`, 'error');
                          console.log(err);
                          reject();
                        });
                     }
                   }),
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                      if (oldData.name === newData.name && oldData.gender === newData.gender) {
                        resolve();
                        props.showMessage(`You didn't change anything for ${oldData.displayName}.`, "info");
                      }
                      else {
                        newData.displayName = newData.name + ` (${newData.gender})`;
                        SportsAPI.updateSport(newData).then((res) =>{
                          updateSportsData(sportsData.map(sport => newData.id === sport.id ? newData : sport)); 
                          props.showMessage(`Updated entry for ${newData.displayName}`);
                          resolve();
                        }).catch(err => {
                          props.showMessage(`Unable to update entry for ${newData.displayName}`, 'error');
                          console.log(err);
                          reject();
                        });
                        
                      }
                    }),
              }}
          />
        </Grid>
      </Grid>
      </div>
  );
}
