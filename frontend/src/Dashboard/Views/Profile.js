import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import UserTabs from "./ProfileComponents/UserTabs";
import UserItemCard from "./ProfileComponents/UserItems";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import { UsersAPI } from "../../api";

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
  const parser = new URLSearchParams(props.location.search);
  const userId = parser.get("id");
  const [user, updateUser] = useState({});
  const [equipment, setEquipment] = useState([]);
  const firstName = useState("");
  const lastName = useState("");
  const email = useState("");
  const username = useState(props.context.credentials.username);
  const address = useState("");
  const city = useState("");
  const state = useState("");
  const zip = useState(null);
  const phone = useState(null);
  const gender = useState("");
  const height = useState(null);
  const weight = useState(null);
  const role = useState("");
  const lockerNumber = useState(null);
  const lockerCode = useState(null);
  const sizes = useState([]);

  useEffect(() => {
    if (userId) {
      UsersAPI.getSingleUser(userId).then((user) => {
        updateUser(user);
      });
    } else {
      UsersAPI.getCurrentUser().then((user) => {
        setUserData(user);
        setEquipment(user.equipment);
      });
    }
  }, []);

  const setUserData = (user) => {
    updateUser({ user });
    firstName[1](user.firstName);
    lastName[1](user.lastName);
    email[1](user.credential.email);
    address[1](user.address);
    city[1](user.city);
    state[1](user.state);
    zip[1](user.zip);
    phone[1](user.phone);
    gender[1](user.gender);
    height[1](user.height);
    weight[1](user.weight);
    lockerNumber[1](user.lockerNumber);
    lockerCode[1](user.lockerCode);
    sizes[1](user.userSizes);
    setEquipment(user.equipment);
    role[1](getRole(user.credential));
  };

  /**
   * converts boolean object to string for representation.
   * @param {*} user
   */
  const getRole = (user) => {
    let role = "Athlete";
    if (user.isAdmin) {
      role = "Admin";
    } else if (user.isEmployee) {
      role = "Employee";
    } else if (user.isCoach) {
      role = "Coach";
    } else if (user.isAthlete) {
      role = "Athlete";
    }
    return role;
  };

  const onSubmit = (event) => {
    UsersAPI.updateCurrentUser({
      ...user,
      firstName: firstName[0],
      lastName: lastName[0],
      address: address[0],
      city: city[0],
      state: state[0],
      zip: zip[0],
      phone: phone[0],
      gender: gender[0],
      height: height[0],
      weight: weight[0],
      lockerNumber: lockerNumber[0],
      lockerCode: lockerCode[0],
      userSizes: sizes[0]
    });
    props.showMessage("Information Successfully Updated!");
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <UserTabs
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
          sizes={sizes}
        >
          <div>
            <Button variant="contained" type="submit" color="primary" onClick={onSubmit} style={{ float: "right" }}>
              Update Info
            </Button>
          </div>
        </UserTabs>
      </Grid>
      <Grid item xs={6}>
        <UserItemCard username={username} equipment={equipment} />
      </Grid>
    </Grid>
  );
}
