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

import { getCurrentUser, updateCurrentUser } from "../../api/users";
import { UserInfoCard, UserPhysicalCard } from "./ProfileComponents/userinfo";
import UserTabs from "./ProfileComponents/usertabs";
import UserItemCard from "./ProfileComponents/useritems";

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
  gender: "Male",
  sports: ["hockey", "baseball"],
  height: 69,
  weight: 160,
  lockerNumber: 115,
  lockerCode: 210315
};

const dummySizes = {
  hockey: {
    head: "M",
    shirt: "L",
    pants: 38,
    socks: "5-12",
    shoes: 12
  },
  baseball: {
    head: "M",
    shirt: "L",
    pants: "36",
    socks: "5-12",
    shoes: "11.5"
  }
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
    id: 6,
    name: "Bat",
    size: null,
    dueDate: new Date(2020, 11, 17).toDateString(),
    value: 14999
  }
];

export default function Profile(props) {
  const firstName = useState(dummyUser.firstName);
  const lastName = useState(dummyUser.lastName);
  const email = useState(dummyUser.email);
  const username = useState(dummyUser.username);
  const address = useState(dummyUser.address);
  const city = useState(dummyUser.city);
  const state = useState(dummyUser.state);
  const zip = useState(dummyUser.zip);
  const phone = useState(dummyUser.phone);
  const gender = dummyUser.gender;
  const height = dummyUser.height;
  const weight = dummyUser.weight;
  const name = useState(firstName[0] + " " + lastName[0]);
  const role = dummyUser.role;
  const lockerNumber = dummyUser.lockerNumber;
  const lockerCode = String(dummyUser.lockerCode);

  // TODO: handle submit logic
  const onSubmit = (event) => {
    return null;
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <UserTabs
          name={name}
          firstName={firstName}
          lastName={lastName}
          email={email}
          username={username}
          address={address}
          city={city}
          state={state}
          zip={zip}
          phone={phone}
          role={role}
          lockerNumber={lockerNumber}
          lockerCode={lockerCode}
          height={height}
          weight={weight}
          gender={gender}
          sizes={dummySizes}
        ></UserTabs>
      </Grid>
      <Grid item xs={6}>
        <UserItemCard name={name} equipment={dummyEquipment}></UserItemCard>
      </Grid>
    </Grid>
  );
}
