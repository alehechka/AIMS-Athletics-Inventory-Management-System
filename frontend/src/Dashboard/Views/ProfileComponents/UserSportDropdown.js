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
  const [open, setOpen] = React.useState(new Array(sports?.length).fill(false));
  const savedSizes = userSizes[0];

  const handleClick = (idx) => {
    let newOpen = open;
    newOpen[idx] = !open[idx];
    setOpen(newOpen);
  };

  const updateSizes = (event, id) => {
    let sizes = userSizes[0];
    let changedIdx = sizes.findIndex((size) => {
      return size.sportSizeId == id;
    });
    if (changedIdx !== -1) {
      sizes[changedIdx].size = event.target.value;
    } else {
      sizes.push({ size: event.target.value, sportSizeId: id });
    }
    userSizes[1](sizes);
  };

  return (
    <div>
      {sports?.map((sport) => {
        return (
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography className={classes.heading}>{sport.displayName}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {sport.sportSizes?.map((sizeObj) => {
                return (
                  <FormControl style={{ width: "100%" }}>
                    <InputLabel>{sizeObj.name}</InputLabel>
                    <Select
                      id={1}
                      value={
                        savedSizes.filter((s) => {
                          return s.sportSizeId == sizeObj.id;
                        })[0]?.size
                      }
                      onChange={(e) => updateSizes(e, sizeObj.id)}
                    >
                      {sizeObj.sizes.map((size) => {
                        return (
                          <MenuItem key={sizeObj.id} value={size}>
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
