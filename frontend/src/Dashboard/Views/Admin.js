import React from "react";
import MaterialTable from 'material-table';
import { UsersAPI } from "../../api";
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  card: {
    height: "100%",
  },
});
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
  const classes = useStyles();
  //material Table hooks
  const [isLoading, updateLoading] = React.useState(true);
  const [data, updateData] = React.useState([]);
  const [columns, updateColumns] = React.useState([]);
  const [pageSize, updatePageSize] = React.useState(5);

  /**
   * Emulates ComponentDidMount lifecycle function
   * 
   * Queries the backend for credential data and populates the table.
   */
  React.useEffect(()=>{
    updateLoading(false);
    UsersAPI.getUsers(null, null, {isAdmin: true, isAthlete: true, isCoach: true, isEmployee: true}).then( (users)=> {
      //lets users search hidden columns
      const defaultOptions = { editable: 'never', hidden: true, searchable: true };
      updateColumns([
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
      const newData = users.map(user=> {
        return {
          id: user.id,
          email: user.credential.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: getRole(user.credential),
        };
      });
      updateData(newData);
    });
  }, []);
  /**
   * converts boolean object to string for representation.
   * @param {*} user 
   */
  const getRole = (user) =>{
    let role = "athlete";
    if (user.isAdmin) {
      role = "Admin";
    } else if (user.isEmployee) {
      role = "Employee";
    } else if (user.isCoach) {
      role = "Coach";
    } else if (user.isAthlete) {
      role = "Athlete";
    }
    return role;
  };
  return (
    <div style={{ maxWidth: '100%', marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <MaterialTable
              title="Roles"
              isLoading= {isLoading}
              columns={columns}
              data={data}
              pageSize = {pageSize}
              onChangeRowsPerPage = {updatePageSize}
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
                              updateData(data.map(user => newData.id === user.id ? newData : user));                 
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
          <Card className={classes.card}>
            <CardContent>
              <h2>Filler</h2>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      </div>
  );
}
