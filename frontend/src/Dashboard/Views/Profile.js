import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import UserTabs from "./ProfileComponents/UserTabs";
import UserItemCard from "./ProfileComponents/UserItems";
import Button from "@material-ui/core/Button";
import { UsersAPI } from "../../api";

/** @module Profile */

/**
 * Contains the logic for Profile page containing basic user information
 *
 * Children:
 *    UserTabs
 *    UserItemCard
 *
 * @param {Object} props - props passed down from Navbar or Users screen
 * @param {Function} props.showMessage - Helper function to display snackbar message.
 * @param {Object} props.context - Context variable containing all relevant user information.
 * @returns {Component} returns the component to be rendered
 */
export default function Profile(props) {
  const parser = new URLSearchParams(props.location.search);
  const [userId, setUserId] = useState(parser.get("userId"));
  const [user, setUser] = useState({});
  const [equipment, setEquipment] = useState([]);
  const firstName = useState("");
  const lastName = useState("");
  const email = useState("");
  const username = user?.credential?.username;
  const address = useState("");
  const city = useState("");
  const state = useState("");
  const zip = useState(null);
  const phone = useState("");
  const gender = useState("");
  const height = useState(null);
  const weight = useState(null);
  const role = useState("");
  const lockerNumber = useState("");
  const lockerCode = useState("");
  const sports = useState([]);
  const userSizes = useState([]);

  useEffect(() => {
    if (userId) {
      UsersAPI.getSingleUserFromBackend(userId).then((user) => {
        setUserData(user);
        setEquipment(user.equipment);
      });
    } else {
      UsersAPI.getCurrentUser().then((user) => {
        setUserData(user);
        setEquipment(user.equipment);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.location.search, userId]);

  /**
   * Updates current User object and all relevant data fields.
   * Fields are detached from user object so that erroneous changes are not
   * made to the user and the time to display update is minimized.
   *
   * @param {User} user - User object for updating data
   */
  const setUserData = (user) => {
    setUser(user);
    setUserId(user.id);
    firstName[1](user.firstName);
    lastName[1](user.lastName);
    email[1](user?.credential?.email);
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
    sports[1](user.sports);
    userSizes[1](user.userSizes);
    setEquipment(user.equipment);
    role[1](props.context.actions.getRole(user.credential));
  };

  /**
   * Handles form submission to update user information in the database
   * and displays confirmation window.
   *
   * @param {Event} event - Submit event from button click
   */
  const onSubmit = (event) => {
    UsersAPI.updateUser({
      id: user.id,
      schoolId: user.School,
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
      userSizes: userSizes[0]
    });
    props.showMessage("Information Successfully Updated!");
  };

  return (
    <div style={{ maxWidth: "100%", marginLeft: "10px", marginRight: "10px", marginBottom: "10px" }}>
      <Grid container spacing={3}>
        <Grid item xs={7}>
          <UserTabs
            credentials={props.context.credentials}
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
            sports={sports[0]}
            userSizes={userSizes}
          >
            <div>
              <Button variant="contained" type="submit" color="primary" onClick={onSubmit} style={{ float: "right" }}>
                Update Info
              </Button>
            </div>
          </UserTabs>
        </Grid>
        <Grid item xs={5}>
          <UserItemCard firstName={user?.firstName} equipment={equipment} />
        </Grid>
      </Grid>
    </div>
  );
}
