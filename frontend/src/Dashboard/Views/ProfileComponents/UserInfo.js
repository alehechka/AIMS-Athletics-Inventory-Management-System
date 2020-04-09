import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";

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
              type = "number"
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
                value={lockerCode[0]/*.match(/.{2}/g).join("-")*/}
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

function UserPhysicalCard(props) {
  const { username, height, weight, gender, sizes } = props;
  const hockeySizes = sizes[0]; // Loading dummy data for now
  const [head, setHead] = useState(hockeySizes ? hockeySizes.head : "");
  const [shirt, setShirt] = useState(hockeySizes ? hockeySizes.shirt : "");
  const [pants, setPants] = useState(hockeySizes ? hockeySizes.pants : "");
  const [socks, setSocks] = useState(hockeySizes ? hockeySizes.socks : "");
  const [shoes, setShoes] = useState(hockeySizes ? hockeySizes.shoes : "");

  // const updateSizes = (event) =>{
  //   sizes[1]([{
  //     ...sizes[0],
  //     [event.target.name]: event.target.value
  //   }])
  // };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Physical Information for {username}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={3}>
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
          <Grid item xs={3}>
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
          <Grid item xs={3}>
            <FormControl required component="fieldset">
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup row value={gender[0]} name="role" onChange={(e) => gender[1](e.target.value)}>
                <FormControlLabel value="M" label="Male" control={<Radio />} />
                <FormControlLabel value="F" label="Female" control={<Radio />} />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        <br />
        <Divider />
        <br />
        <div>
          <Typography variant="h5" gutterBottom>
            Size Information for {username}
          </Typography>
          <Select id="head" value={head} onChange={setHead}>
            <MenuItem value={"S"}>Small</MenuItem>
            <MenuItem value={"M"}>Medium</MenuItem>
            <MenuItem value={"L"}>Large</MenuItem>
            <MenuItem value={"XL"}>Extra Large</MenuItem>
          </Select>
          <FormHelperText>Head Size</FormHelperText>
          <Select id="shirt" value={shirt} onChange={setHead}>
            <MenuItem value={"S"}>Small</MenuItem>
            <MenuItem value={"M"}>Medium</MenuItem>
            <MenuItem value={"L"}>Large</MenuItem>
            <MenuItem value={"XL"}>Extra Large</MenuItem>
          </Select>
          <FormHelperText>Shirt Size</FormHelperText>
          <TextField id="pants" value={pants} onChange={setPants}></TextField>
          <FormHelperText>Pant Size</FormHelperText>
          <Select id="socks" value={socks} onChange={setSocks}>
            <MenuItem value={"5-12"}>5-12</MenuItem>
            <MenuItem value={"13-20"}>13-20</MenuItem>
          </Select>
          <FormHelperText>Sock Size</FormHelperText>
          <Select id="shoes" value={shoes} onChange={setShoes}>
            {[...Array(21).keys()].map((size) => (
              <MenuItem value={size}>{size}</MenuItem>
            ))}
          </Select>
          <FormHelperText>Shoe Size</FormHelperText>
        </div>
      </CardContent>
    </Card>
  );
}

export { UserInfoCard, UserPhysicalCard };
