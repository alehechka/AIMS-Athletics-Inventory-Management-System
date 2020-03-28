import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

export default function AddAthlete(props) {

    return (
        <Grid container spacing={3}>
        <Grid item xs = {6}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Information
                    </Typography>
                    <Grid container spacing = {1}>
                    <Grid item xs = {6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id = "firstName"
                                label="First Name"
                                
                            />
                        </Grid>
                        <Grid item xs = {6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id = "lastName"
                                label="Last Name"
                            />
                        </Grid>
                        <Grid item xs = {12}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id = "email"
                                label="Email Address"
                            />
                        </Grid>
                        <Grid item xs = {6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id = "locker"
                                label="Locker No."
                                type ="number"
                            />
                        </Grid>
                        <Grid item xs = {6}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                fullWidth
                                id = "jersey"
                                label="Jersey No."
                                type = "number"
                            />
                        </Grid>
                    </Grid>

                </CardContent>
            </Card>
        </Grid>
        <Grid item xs = {6}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Sports (will auto populate from table)
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs = {12}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Size Chart
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
    )
}