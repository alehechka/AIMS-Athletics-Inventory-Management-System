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

function UserInfoCard(props) {
  const {
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
  const name = useState(firstName[0] + " " + lastName[0]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {role} Information for {name}
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
              value={email[0]}
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
              value={phone[0]}
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
              fullWidth
              id="zip"
              label="Zip"
              onChange={(e) => zip[1](e.target.value)}
              value={zip[0]}
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
                value={lockerNumber}
                disabled
              ></TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="lockerCode"
                label="Locker Code"
                value={lockerCode.match(/.{2}/g).join("-")}
                disabled
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
  const { name, height, weight, gender, sizes } = props;
  const hockeySizes = sizes.hockey; // Loading dummy data for now
  const [head, setHead] = useState(hockeySizes.head);
  const [shirt, /*setShirt*/] = useState(hockeySizes.shirt);
  const [pants, setPants] = useState(hockeySizes.pants);
  const [socks, setSocks] = useState(hockeySizes.socks);
  const [shoes, setShoes] = useState(hockeySizes.shoes);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Physical Information for {name}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="height"
              label="Height (inches)"
              value={height}
              disabled
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="weight"
              label="Weight (lbs)"
              value={weight}
              disabled
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="gender"
              label="Gender"
              value={gender}
              disabled
            />
          </Grid>
        </Grid>
        <br />
        <Divider />
        <br />
        <Typography variant="h5" gutterBottom>
          Size Information for {name}
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
      </CardContent>
    </Card>
  );
}

export { UserInfoCard, UserPhysicalCard };
