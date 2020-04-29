import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import { UserInfoCard, UserPhysicalCard } from "./UserInfo";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
}));

export default function UserTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const {
    firstName,
    lastName,
    email,
    username,
    address,
    city,
    state,
    zip,
    phone,
    role,
    lockerNumber,
    lockerCode,
    height,
    weight,
    gender,
    sports,
    userSizes
  } = props;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Card container spacing={3}>
        <AppBar position="static">
          <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
            <Tab label="Basic Info" {...a11yProps(0)} />
            <Tab label="Size Info" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <UserInfoCard
            credentials={props.credentials}
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
          ></UserInfoCard>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <UserPhysicalCard
            username={username}
            height={height}
            weight={weight}
            gender={gender}
            sports={sports}
            userSizes={userSizes}
          ></UserPhysicalCard>
        </TabPanel>
        {props.children}
      </Card>
    </div>
  );
}
