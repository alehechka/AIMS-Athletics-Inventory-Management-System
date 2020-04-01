import React from 'react';
import MaterialTable from 'material-table';
import { UsersAPI } from "../../api";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import Grid from '@material-ui/core/Grid';

export default function Staff(props) {
    const [isLoading, updateLoading] = React.useState(true);
    const [data, updateData] = React.useState([]);
    const [columns, updateColumns] = React.useState([]);
    const [pageSize, updatePageSize] = React.useState(5);

    const [dialogOpen, setDialogOpen] = React.useState(false);
    
    React.useEffect(()=>{
        UsersAPI.getUsers(null, null, {isAdmin: true, isEmployee: true, isCoach: true}).then((staff)=> {
                    
                    let newPageSize = staff.length > 20 ? 20: staff.length;
                    newPageSize = newPageSize < 5 ? 5 : newPageSize;
                    updatePageSize(newPageSize);
                    updateColumns([
                        {title: 'ID', field: 'id', hidden: true},
                        {title: 'Sport', field: 'sportsJson', hidden: true},
                        {title: 'First Name', field: 'firstName'},
                        {title: 'Last Name', field: 'lastName'},
                        {title: 'Sport(s)', field: 'sports'},
                    ]);
                    const customData = staff.map(user =>({
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        sportsJson: JSON.stringify(user.sports),
                        sports: user.sports.map(val=> `${val.name}` + (val.gender ? ` (${val.gender})` : "")).join(", ")
                    }));
                    updateData(customData);
                    updateLoading(false);
                });
    }, []);
    const closeDialog = () => setDialogOpen(false);
    return (
    <div style={{ maxWidth: '100%', marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}>
        <MaterialTable
            title="Staff"
            isLoading= {isLoading}
            columns={columns}
            data={data}
            options={{
                search: true,
                filtering: true,
                exportButton: true,
                pageSize,
                actionsColumnIndex: -1,
                tableLayout: "fixed"
            }}
            actions={[
                {
                  icon: 'list',
                  tooltip: 'Transactions',
                  onClick: (event, rowData) => {
                    
                  }
                },
                {
                    icon: 'add',
                    tooltip: 'Add',
                    isFreeAction: true,
                    onClick: (event, rowData) => {
                        setDialogOpen(true);
                      
                    }   
                  },
            ]}
            editable = {{             
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      {
                        const data = this.state.data;
                        const index = data.indexOf(oldData);
                        data[index] = newData;
                        this.setState({ data }, () => resolve());
                      }
                      resolve()
                    }, 1000)
                  }),
                onRowDelete: oldData =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      {
                        let data = this.state.data;
                        const index = data.indexOf(oldData);
                        data.splice(index, 1);
                        this.setState({ data }, () => resolve());
                      }
                      resolve()
                    }, 1000)
                  }),
            }}
        />
        <Dialog open={dialogOpen} onClose={closeDialog}>
            <DialogTitle>Add a new staff member</DialogTitle>
            <DialogContent>
            <div style ={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />  
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        type = "password"
                        id="password"
                        label="Password"
                        name="password"
                        autoComplete="password"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="fname"
                        label="First Name"
                        name="fname"
                        autoComplete="First Name"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="lname"
                        label="Last Name"
                        name="lname"
                        autoComplete="Last Name"
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <FormControl required variant="outlined" style ={{marginTop: "16px"}}>
                        <InputLabel>School</InputLabel>
                        <Select
                            id="school"
                            value={1}
                        >
                        <MenuItem value={1}>UNO</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={10}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="address"
                        label="Address"
                        name="address"
                        autoComplete="Address"
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="city"
                        label="City"
                        name="city"
                        autoComplete="city"
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        id="state"
                        label="State"
                        name="state"
                        autoComplete="state"
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        type = "number"
                        required
                        fullWidth
                        id="zip"
                        label="Zip Code"
                        name="zip"
                        autoComplete="zip"
                    />
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        type = "number"
                        required
                        fullWidth
                        id="phone"
                        label="Phone Number"
                        name="phone"
                        autoComplete="phone"
                    />
                </Grid>
                <Grid item xs= {2}>
                    <FormControl required variant="outlined" style ={{marginTop: "16px"}}>
                        <InputLabel>Gender</InputLabel>
                        <Select
                            id="gender"
                            value={"male"}
                        >
                            <MenuItem value={"male"}>Male</MenuItem>
                            <MenuItem value={"female"}>Female</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        type = "number"
                        required
                        fullWidth
                        id="height"
                        label="Height(cm)"
                        name="height"
                        autoComplete="height"
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        type = "number"
                        required
                        fullWidth
                        id="weight"
                        label="Weight(lb)"
                        name="weight"
                        autoComplete="weight"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        type = "number"
                        required
                        fullWidth
                        id="lockerNumber"
                        label="Locker Number"
                        name="lockerNumber"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        type = "number"
                        required
                        fullWidth
                        id="lockerCode"
                        label="Locker Code"
                        name="lockerCode"
                    />
                </Grid>
            </Grid>
            </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog} color="primary">
                    Cancel
                </Button>
                <Button onClick={closeDialog} color="primary">
                    Confirm
                </Button>
            </DialogActions>
      </Dialog>
    </div>);
}