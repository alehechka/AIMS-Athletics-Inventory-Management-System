import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";

import { getCurrentUser, updateCurrentUser } from "../../api/users";

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

// Dummy data to test dynamic functionality
const dummyUser = {
  firstName: "Sample",
  lastName: "Worker",
  username: "sample_worker",
  email: "sample_worker@sample.com",
  role: "Athlete",
  address: "1234 Sample Way",
  city: "Omaha",
  state: "NE",
  zip: 68114,
  phone: "(402) 555-5555",
  gender: null,
  sports: ["hockey", "baseball"],
  height: 69,
  weight: 160,
  lockerNumber: 115,
  lockerCode: 210315
};

const dummyEquipment = [
  {
    id: 1,
    name: "Jersey",
    size: "L",
    dueDate: new Date(2020, 11, 17).toDateString(),
    value: 19995
  },
  {
    id: 2,
    name: "Padded Pants",
    size: "38",
    dueDate: new Date(2020, 11, 17).toDateString(),
    value: 24998
  },
  {
    id: 3,
    name: "Socks",
    size: "5-12",
    dueDate: new Date(2020, 11, 17).toDateString(),
    value: 4995
  },
  {
    id: 4,
    name: "Blades",
    size: "12",
    dueDate: new Date(2020, 11, 17).toDateString(),
    value: 29999
  },
  {
    id: 5,
    name: "Stick",
    size: null,
    dueDate: new Date(2020, 11, 17).toDateString(),
    value: 14999
  },
  {
    id: 1,
    name: "Jersey",
    size: "L",
    dueDate: new Date(2020, 11, 17).toDateString(),
    value: 19995
  },
  {
    id: 2,
    name: "Padded Pants",
    size: "38",
    dueDate: new Date(2020, 11, 17).toDateString(),
    value: 24998
  },
  {
    id: 3,
    name: "Socks",
    size: "5-12",
    dueDate: new Date(2020, 11, 17).toDateString(),
    value: 4995
  },
  {
    id: 4,
    name: "Blades",
    size: "12",
    dueDate: new Date(2020, 11, 17).toDateString(),
    value: 29999
  },
  {
    id: 5,
    name: "Stick",
    size: null,
    dueDate: new Date(2020, 11, 17).toDateString(),
    value: 14999
  },
  {
    id: 1,
    name: "Jersey",
    size: "L",
    dueDate: new Date(2020, 11, 17).toDateString(),
    value: 19995
  },
  {
    id: 2,
    name: "Padded Pants",
    size: "38",
    dueDate: new Date(2020, 11, 17).toDateString(),
    value: 24998
  },
  {
    id: 3,
    name: "Socks",
    size: "5-12",
    dueDate: new Date(2020, 11, 17).toDateString(),
    value: 4995
  },
  {
    id: 4,
    name: "Blades",
    size: "12",
    dueDate: new Date(2020, 11, 17).toDateString(),
    value: 29999
  },
  {
    id: 5,
    name: "Stick",
    size: null,
    dueDate: new Date(2020, 11, 17).toDateString(),
    value: 14999
  }
];

export default function Profile(props) {
  const [firstName, setFirstName] = useState(dummyUser.firstName);
  const [lastName, setLastName] = useState(dummyUser.lastName);
  const [email, setEmail] = useState(dummyUser.email);
  const [username, setUsername] = useState(dummyUser.username);
  const [address, setAddress] = useState(dummyUser.address);
  const [city, setCity] = useState(dummyUser.city);
  const [state, setState] = useState(dummyUser.state);
  const [zip, setZip] = useState(dummyUser.zip);
  const [phone, setPhone] = useState(dummyUser.phone);
  const [gender, setGender] = useState(dummyUser.gender);
  const [height, setHeight] = useState(dummyUser.height);
  const [weight, setWeight] = useState(dummyUser.weight);
  const [name, setName] = useState(firstName + " " + lastName);
  const role = dummyUser.role;
  const lockerNumber = dummyUser.lockerNumber;
  const lockerCode = String(dummyUser.lockerCode);

  // TODO: handle submit logic
  const onSubmit = (event) => {
    return null;
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  });

  // TODO: Break this into smaller subcomponents
  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
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
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
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
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
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
                  value={phone}
                />
              </Grid>
            </Grid>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="address"
              label="Address"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
            />
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="city"
                  label="City"
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField variant="outlined" margin="normal" fullWidth id="state" label="State" value={state} />
              </Grid>
              <Grid item xs={4}>
                <TextField variant="outlined" margin="normal" fullWidth id="zip" label="Zip" value={zip} />
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
      </Grid>
      <Grid item xs={6}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {name}'s Equipment
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dummyEquipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.size ?? "None"}</TableCell>
                    <TableCell>{item.dueDate}</TableCell>
                    <TableCell>{formatter.format(item.value / 100)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { "aria-label": "rows per page" },
                    native: true
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableFooter>
            </Table>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
