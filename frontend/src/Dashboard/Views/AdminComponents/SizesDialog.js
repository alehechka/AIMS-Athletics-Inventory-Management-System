import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';

export default function SizesDialog(props) {
    const [sizesDialogOpen, closeSizesDialog] = [props.sizesDialogOpen, props.closeSizesDialog];
    const [dialogTitle, setDialogTitle, dialogContent] = [props.dialogTitle, props.setDialogTitle, props.dialogContent];
    const isEditDialog = dialogTitle.includes("Edit");
    
    let render = dialogContent;
    const sportId = dialogContent.id;
    if (dialogTitle === "Edit Sport Sizes") {
        render = "1";
        const sportSizes = dialogContent.sportSizes;
        console.log(sportId, sportSizes);
    }
    else if (dialogTitle === "View Item Sizes") {
        const sportSizes = dialogContent.sportSizes;
        let itemsRender = "There are no inventory items with sizes attached to this sport";
        if (sportSizes.length !== 0){
            itemsRender = sportSizes.map((val)=>(
                <ExpansionPanel key ={`${val.id}Panel`} defaultExpanded>
                    <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    >
                        {val.name}
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div>
                            {val.sizes.map(size=> (
                                <Chip label={size} style ={{margin: "8px"}}/>
                            ))}
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            ));
        }
        render = (
            <div>
                <Button
                    onClick={() => setDialogTitle("Edit Sport Sizes")}
                >
                    Edit
                </Button>
                {itemsRender}
            </div>);
    }
    return(
        <Dialog open={sizesDialogOpen} onClose={closeSizesDialog} disableBackdropClick fullWidth>
            <DialogTitle>{dialogTitle} for {dialogContent.displayName}</DialogTitle>
            <DialogContent>
                <div>
                    {render}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=> closeSizesDialog(false)} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => closeSizesDialog(true)} color="primary" style = {!isEditDialog? {"display": "none"}: {}}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}