import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

export default function SizesDialog(props) {
    const [sizesDialogOpen, closeSizesDialog] = [props.sizesDialogOpen, props.closeSizesDialog];
    const [dialogTitle, dialogContent] = [props.dialogTitle, props.dialogContent];
    const isEditDialog = dialogTitle.includes("Edit") || dialogTitle.includes("Add");
    return(
        <Dialog open={sizesDialogOpen} onClose={closeSizesDialog} disableBackdropClick>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>
                {dialogContent}
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