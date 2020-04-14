import React from "react";
import Typography from "@material-ui/core/Typography";
// import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
// import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

export default function CheckInCard({ user, items, sharedItems, tranIndex, updateSingleTransaction }) {
    console.log(items);
  return (
    <Card style={{ marginBottom: "5px" }} variant="outlined">
        <CardContent>
            <Typography component="h3" variant="h6">
                {user?.firstName} {user?.lastName}
            </Typography>
            {items.map( (item) => (
                <Typography component="h3" variant="h6">
                    {item.name}
                </Typography>
            ))}
            {sharedItems.map( (item) => (
                <Typography component="h3" variant="h6">
                    Shared {item.name}
                </Typography>
            ))}
        </CardContent>
  </Card>
  );
}
