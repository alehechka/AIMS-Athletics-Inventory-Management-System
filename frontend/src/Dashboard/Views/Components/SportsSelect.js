import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';

/** @module SportsSelect */

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: "100%"
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, sport, theme) {
  return {
    fontWeight:
      sport.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
/**
 * Special Multi select for sports
 * 
 * @param {Object} props - props passed down from ProfileDialog
 * @param {String[]} props.sport - the option selected by user
 * @param {String[]} props.sports - the options that a user can select
 */
export default function SportsSelect(props) {
  const classes = useStyles();
  const theme = useTheme();
       
  const [sport, handleSportChange] = [props.sport, props.handleSportChange];
  const sports = props.sports;
  return (
    <div>
      <FormControl required variant = "outlined" className={classes.formControl}>
        <InputLabel>Sports</InputLabel>
        <Select
          multiple
          value={sport}
          onChange={handleSportChange}
          input={<Input />}
          renderValue={(selected) => (
            <div className={classes.chips}>
              {selected.map((value) => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {sports.map((name) => (
            <MenuItem key={name} value={name} style={getStyles(name, sport, theme)}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}