import React from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import UserSportDropdown from "./UserSportDropdown";

/** @module UserInfoCard */

/**
 * Contains all the basic information about the user, e.g. name, address,
 * role, locker information, etc.
 *
 *
 * @param {Object} props - props passed down from UserTabs
 * @param {Function} props.showMessage - Helper function to display snackbar message.
 * @param {Object} props.context - Context variable containing all relevant user information.
 * @returns {Component} returns the component to be rendered
 */
function UserInfoCard(props) {
  const {
    username,
    firstName,
    lastName,
    email,
    address,
    city,
    state,
    zip,
    phone,
    role,
    lockerNumber,
    lockerCode
  } = props;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {role} Information for {username}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="firstName"
              label="First Name"
              onChange={(e) => firstName[1](e.target.value)}
              value={firstName[0]}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="lastName"
              label="Last Name"
              onChange={(e) => lastName[1](e.target.value)}
              value={lastName[0]}
            />
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              type="email"
              variant="outlined"
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              onChange={(e) => email[1](e.target.value)}
              value={email[0] || ""}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="tel"
              variant="outlined"
              margin="normal"
              fullWidth
              id="phone"
              label="Phone Number"
              onChange={(e) => phone[1](e.target.value)}
              value={phone[0] || ""}
            />
          </Grid>
        </Grid>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          id="address"
          label="Address"
          onChange={(e) => address[1](e.target.value)}
          value={address[0]}
        />
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="city"
              label="City"
              onChange={(e) => city[1](e.target.value)}
              value={city[0]}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="state"
              label="State"
              onChange={(e) => state[1](e.target.value)}
              value={state[0]}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              variant="outlined"
              margin="normal"
              type="number"
              fullWidth
              id="zip"
              label="Zip"
              onChange={(e) => zip[1](e.target.value)}
              value={zip[0] || ""}
            />
          </Grid>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="lockerNumber"
                label="Locker Number"
                value={lockerNumber[0]}
                onChange={(e) => lockerNumber[1](e.target.value)}
                disabled={!(props.credentials.isAdmin || props.credentials.isEmployee)}
              ></TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="lockerCode"
                label="Locker Code"
                value={lockerCode[0] /*.match(/.{2}/g).join("-")*/}
                onChange={(e) => lockerCode[1](e.target.value)}
                disabled={!(props.credentials.isAdmin || props.credentials.isEmployee)}
              ></TextField>
            </Grid>
          </Grid>
          <Grid container spacing={1}></Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

/** @module UserPhysicalCard */

/**
 * Contains the Size and physical information components of the
 * Profile page. Height, Weight and Gender are editable.
 *
 * Children:
 *    UserSportDropdown
 *
 * @param {Object} props - props passed down from UserTabs
 * @param {Function} props.showMessage - Helper function to display snackbar message.
 * @param {Object} props.context - Context variable containing all relevant user information.
 * @returns {Component} returns the component to be rendered
 */
function UserPhysicalCard(props) {
  const { username, height, weight, gender, sports, userSizes } = props;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Physical Information for {username}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <FormControl required component="fieldset" style={{ width: "100%", paddingTop: "5%" }}>
              <InputLabel id="genderLabel">Gender</InputLabel>
              <Select labelId="genderLabel" id="gender" value={gender[0]} onChange={(e) => gender[1](e.target.value)}>
                <MenuItem value={"M"}>Male</MenuItem>
                <MenuItem value={"F"}>Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="height"
              label="Height (inches)"
              onChange={(e) => height[1](e.target.value)}
              value={height[0]}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="weight"
              label="Weight (lbs)"
              onChange={(e) => weight[1](e.target.value)}
              value={weight[0]}
            />
          </Grid>
        </Grid>
        <br />
        <Divider />
        <br />
        <div>
          <Typography variant="h5" gutterBottom>
            Size Information for {username}
          </Typography>
        </div>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <UserSportDropdown sports={sports} userSizes={userSizes} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export { UserInfoCard, UserPhysicalCard };
