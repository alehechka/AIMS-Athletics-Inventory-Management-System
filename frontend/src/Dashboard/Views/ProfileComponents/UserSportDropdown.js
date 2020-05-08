import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ExpandMore from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
}));

export default function UserSportDropdown(props) {
  const classes = useStyles();
  const { sports, userSizes } = props;

  const [, updateState] = React.useState();

  const updateSizes = (event, id) => {
    let sizes = userSizes[0];
    let changedIdx = sizes.findIndex((size) => {
      return size.sportSizeId === id;
    });
    if (changedIdx !== -1) {
      sizes[changedIdx].size = event.target.value;
    } else {
      sizes.push({ size: event.target.value, sportSizeId: id });
    }
    userSizes[1](sizes);
    updateState({});
  };

  return (
    <div>
      {sports.map((sport) => {
        return (
          <ExpansionPanel key={sport.id}>
            <ExpansionPanelSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography className={classes.heading}>{sport.displayName}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {sport.sportSizes.map((sizeObj) => {
                let idx = userSizes[0].findIndex((s) => {
                  return s.sportSizeId === sizeObj.id;
                });
                return (
                  <FormControl key={sizeObj.id} style={{ width: "100%" }}>
                    <InputLabel>{sizeObj.name}</InputLabel>
                    <Select onChange={(e) => updateSizes(e, sizeObj.id)} value={userSizes[0][idx]?.size}>
                      {sizeObj.sizes.map((size) => {
                        return (
                          <MenuItem key={size} value={size}>
                            {size}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                );
              })}
            </ExpansionPanelDetails>
          </ExpansionPanel>
        );
      })}
    </div>
  );
}
