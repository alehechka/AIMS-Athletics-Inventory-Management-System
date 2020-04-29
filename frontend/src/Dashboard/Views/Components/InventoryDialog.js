
import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SportsSelect from './SportsSelect';

import Grid from '@material-ui/core/Grid';

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
 * @param {*} props props passed down from Staff
 */
export default function ProfileDialog(props) {
    const renderType = props.renderType;
    const [dialogOpen, closeDialog] = [props.dialogOpen, props.closeDialog];
    const [inputs, changeInput] = [props.inputs, props.changeInput];
    const [sport, sports, handleSportChange] = [props.sport, props.sports, props.handleSportChange];
	const [state, setState] = React.useState({
		surplus: false,
		taxable: false,
		expendable: false,
		alertQuantity: false,
	 });
	 const handleChange = (event) => {
		setState({ ...state, [event.target.name]: event.target.checked });
	 };

    const dialogTitle = props.dialogTitle;
    const isEditDialog = dialogTitle.includes("Edit");
    return(
        <Dialog open={dialogOpen} onClose={closeDialog} disableBackdropClick>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            autoComplete="Name"
                            value= {inputs.name}
                            onChange= {changeInput}
                            autoFocus
                        />  
                    </Grid>
                    <Grid item xs={8}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="description"
                            label="Description"
                            name="description"
                            autoComplete="Description"
                            value= {inputs.description}
                            onChange= {changeInput}
                        />  
                    </Grid>
					<Grid item xs={3} sm={6}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="averagePrice"
                            label="Price"
                            name="averagePrice"
                            autoComplete="AveragePrice"
                            value= {inputs.averagePrice}
                            onChange= {changeInput}
                        />  
                    </Grid>
					<Grid item xs={3} sm={6}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="totalQuantity"
                            label="Quantity"
                            name="totalQuantity"
                            autoComplete="Quantity"
                            value= {inputs.totalQuantity}
                            onChange= {changeInput}
                        />  
                    </Grid>
					<Grid item xs={3} sm={2}>
                        <FormControlLabel
							control={<Checkbox checked={state.surplus} onChange={handleChange} name="surplus" color="primary"/>}
							label="Surplus"
							labelPlacement="top"
						/>  
                    </Grid>
					<Grid item xs={3} sm={2}>
                        <FormControlLabel
							control={<Checkbox checked={state.taxable} onChange={handleChange} name="taxable" color="primary"/>}
							label="Taxable"
							labelPlacement="top"
						/>  
                    </Grid>
					<Grid item xs={3} sm={8}>
                        <FormControlLabel
							control={<Checkbox checked={state.expendable} onChange={handleChange} name="expendable" color="primary"/>}
							label="Expendable"
							labelPlacement="top"
						/>  
                    </Grid>
					<Grid item xs = {4} sm={3}>
                        <SportsSelect
                            sport = {sport}
                            sports = {sports}
                            handleSportChange = {handleSportChange}
                        />
                    </Grid>
                    <Grid item xs = {3} sm={3}>
                        <SportsSelect
                            sport = {sport}
                            sports = {sports}
                            handleSportChange = {handleSportChange}
                        />
                    </Grid>
					<Grid item xs={3} sm={3}>
                        <FormControlLabel
							control={<Checkbox checked={state.alertQuantity} onChange={handleChange} name="alertQuantity" color="primary"/>}
							label="Alert Quantity"
							labelPlacement="top"
						/>  
                    </Grid>
                </Grid>
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