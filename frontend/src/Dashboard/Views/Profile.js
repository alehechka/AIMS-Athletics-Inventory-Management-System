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

/**
 * This component contains the UI logic for Profile.
 * 
 * State variables:
 * None
 * 
 * Prop variables passed down from App.js(through dashboard):
 * email - string- email address of the authorized user.
 * username - string - username of the authorized user.
 * role - string - role of the authorized user. 
 * showmessage - custom function to enqueue snackbar.
 * 
 * Props passed down from Snackbar provider.
 * 
 * enqueuesnackbar - function - shows a snackbar.
 * closesnackbar - function - closes a snackbar. 
 */
export default function Profile(props) {
    const email = props.email;
    const username = props.username;
    const role = props.role;
    return(
        <Grid container spacing={3}>
            <Grid item xs = {6}>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            Information
                        </Typography>
                        <Grid container spacing = {1}>
                            <Grid item xs = {12}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    id = "email"
                                    label="Email Address"
                                    value = {email}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs = {6}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    id = "username"
                                    label="Username"
                                    value = {username}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs = {6}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    id = "role"
                                    label = "Role"
                                    value = {role}
                                    disabled
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
                            Items Checked Out
                        </Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Item
                                    </TableCell>
                                    <TableCell>
                                        Due Date
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        Torso
                                    </TableCell>
                                    <TableCell>
                                        01/05/2019
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Socks
                                    </TableCell>
                                    <TableCell>
                                        01/07/2019
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}