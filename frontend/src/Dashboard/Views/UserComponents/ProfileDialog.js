
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SportsSelect from '../Components/SportsSelect';

import Grid from '@material-ui/core/Grid';

/** @module ProfileDialog */

/**
 * Contains the elements in Dialog box form.
 * 
 * Props Passed down from Staff:
 * dialogOpen - contains the state of dialog box
 * dialogTitle - contains the title for dialog box
 * inputs - Object containing all form data to be modified
 * sport - list of sports selected in form
 * sports - object containing all sports available
 * sportIdLookup - Lookup for Sport Objects
 * 
 * @param {Object} props - props passed down from Users
 * @param {Function} props.showMessage - Helper function to display snackbar message.
 * @param {Object} props.context - Context variable containing all relevant user information.
 * @param {String} props.renderType - "Staff" or "Athlete". Page render changes based on this value.
 * @param {Boolean} props.dialogOpen - Determines dialog Open state
 * @param {Function} props.closeDialog - Closes dialog
 * @param {String} props.dialogTitle - sets dialog title
 * @param {Object} props.inputs - input value to be filled in form
 * @param {Function} props.changeInput - changes the values in input state
 * @param {String[]} props.sport - the option selected by user
 * @param {String[]} props.sports - the options that a user can select
 * @param {Function} props.handleSportChange - changes the current user option
 */
export default function ProfileDialog(props) {
    const renderType = props.renderType;
    const [dialogOpen, closeDialog] = [props.dialogOpen, props.closeDialog];
    const [inputs, changeInput] = [props.inputs, props.changeInput];
    const [sport, sports, handleSportChange] = [props.sport, props.sports, props.handleSportChange];

    const dialogTitle = props.dialogTitle;
    const isEditDialog = dialogTitle.includes("Edit");
    return(
        <Dialog open={dialogOpen} onClose={closeDialog} disableBackdropClick>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} style = {renderType !== "Staff" || isEditDialog? {"display": "none"}: {}}>
                        <FormControl required component="fieldset">
                            <FormLabel component="legend">Role</FormLabel>
                            <RadioGroup row value={inputs.role} name= "role" onChange={changeInput}>
                                <FormControlLabel value = "Admin"  label="Admin" control={<Radio />}/>
                                <FormControlLabel value = "Coach"  label="Coach" control={<Radio />}/>
                                <FormControlLabel value = "Employee"  label="Employee" control={<Radio />}/>
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} style = {isEditDialog? {"display": "none"}: {}}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            value= {inputs.email}
                            onChange= {changeInput}
                            autoFocus
                        />  
                    </Grid>
                    <Grid item xs={6} style = {isEditDialog? {"display": "none"}: {}}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="username"
                            label="User Name"
                            name="username"
                            autoComplete="username"
                            value= {inputs.username}
                            onChange= {changeInput}
                        />  
                    </Grid>
                    <Grid item xs={6} style = {isEditDialog? {"display": "none"}: {}}>
                        <TextField
                            variant="outlined"
                            type = "password"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            name="password"
                            autoComplete="password"
                            value= {inputs.password}
                            onChange= {changeInput}
                        /> 
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            name="firstName"
                            autoComplete="First Name"
                            value= {inputs.firstName}
                            onChange= {changeInput}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="Last Name"
                            value= {inputs.lastName}
                            onChange= {changeInput}
                        />
                    </Grid>
                    <Grid item xs= {4}>
                        <FormControl required component="fieldset">
                            <FormLabel component="legend">Gender</FormLabel>
                            <RadioGroup row value={inputs.gender} name= "gender" onChange={changeInput}>
                                <FormControlLabel value="F" labelPlacement="bottom" control={<Radio />} label="Female" />
                                <FormControlLabel value="M" labelPlacement="bottom" control={<Radio />} label="Male" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs = {8}>
                        <SportsSelect
                            sport = {sport}
                            sports = {sports}
                            handleSportChange = {handleSportChange}
                        />
                    </Grid>
                    <Grid item xs= {4}>
                        <FormControl required component="fieldset">
                            <FormLabel component="legend">Status</FormLabel>
                            <RadioGroup row value={inputs.isActive ? "active" : "inactive"} name= "isActive" onChange={changeInput}>
                                <FormControlLabel value="active" labelPlacement="bottom" control={<Radio />} label="Active" />
                                <FormControlLabel value="inactive" labelPlacement="bottom" control={<Radio />} label="Inactive" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs= {4}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            type = "number"
                            fullWidth
                            id="height"
                            label="Height(cm)"
                            name="height"
                            autoComplete="height"
                            value= {inputs.height}
                            onChange= {changeInput}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            type = "number"
                            fullWidth
                            id="weight"
                            label="Weight(lb)"
                            name="weight"
                            autoComplete="weight"
                            value= {inputs.weight}
                            onChange= {changeInput}
                        />
                    </Grid>
                </Grid>
                <ExpansionPanel style ={{marginTop: "12px"}}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} >
                        <Typography>Personal Information</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid container spacing = {2}>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    id="schoolId"
                                    label="Organization"
                                    name="schoolId"
                                    autoComplete="schoolId"
                                    value= {props.context.organization.shortName}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={9}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    id="address"
                                    label="Address"
                                    name="address"
                                    autoComplete="Address"
                                    value= {inputs.address}
                                    onChange= {changeInput}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    id="city"
                                    label="City"
                                    name="city"
                                    autoComplete="city"
                                    value= {inputs.city}
                                    onChange= {changeInput}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    id="state"
                                    label="State"
                                    name="state"
                                    autoComplete="state"
                                    value= {inputs.state}
                                    onChange= {changeInput}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    type = "number"
                                    fullWidth
                                    id="zip"
                                    label="Zip Code"
                                    name="zip"
                                    autoComplete="zip"
                                    value= {inputs.zip}
                                    onChange= {changeInput}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    type = "number"
                                    fullWidth
                                    id="lockerNumber"
                                    label="Locker Number"
                                    name="lockerNumber"
                                    value= {inputs.lockerNumber}
                                    onChange= {changeInput}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    type = "number"
                                    fullWidth
                                    id="lockerCode"
                                    label="Locker Code"
                                    name="lockerCode"
                                    value= {inputs.lockerCode}
                                    onChange= {changeInput}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    type = "number"
                                    fullWidth
                                    id="phone"
                                    label="Phone Number"
                                    name="phone"
                                    autoComplete="phone"
                                    value= {inputs.phone}
                                    onChange= {changeInput}
                                />
                            </Grid>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=> closeDialog(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => closeDialog(true)} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}