import React from "react";
import { loadCSS } from "fg-loadcss";
import clsx from "clsx";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import AccountCircle from "@material-ui/icons/AccountCircle";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ListIcon from "@material-ui/icons/List";
import PersonIcon from "@material-ui/icons/Person";
import MenuIcon from "@material-ui/icons/Menu";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import LockIcon from "@material-ui/icons/Lock";
import Tooltip from "@material-ui/core/Tooltip";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Link } from "react-router-dom";

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(8) + 1
    }
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar
  }
}));
/**
 * Contains the navbar code.
 *
 * Hooks:
 * menuOpen,setMenuOpen - Sidebar togggle
 * dialogOpen, setDialogOpen - logout dialog toggle
 *
 * Props passed down from Dashboard
 * username string current username
 * noOfItemsCheckedOut int placeholder for number of items user has checked out
 * openProfile func reference redirects user
 * logOutUser func reference logs out user
 *
 * @param {*} props passed from Dashboard
 */
function Navbar(props) {
  const classes = useStyles();
  const username = props.context.credentials?.username;
  const organization = props.context.organization;
  const allowedViews = props.allowedViews;
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const menuItems = {
    Home: <DashboardIcon />,
    Athletes: <Icon className="fas fa-swimmer" />,
    Inventory: <ListIcon />,
    Staff: <PersonIcon />,
    Admin: <LockIcon />
  };
  /**
   * Toggles menuOpen state
   */
  const handleDrawerToggle = () => {
    setMenuOpen(!menuOpen);
  };
  /**
   * Opens logout confirmation dialog
   */
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };
  /**
   * Closes logout confirmation dialog
   */
  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  //Loads fontawesome css. Used for swimmer icon.
  React.useEffect(() => {
    loadCSS("https://use.fontawesome.com/releases/v5.12.0/css/all.css", document.querySelector("#font-awesome-css"));
  }, []);
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {organization?.shortName ? organization?.shortName : organization?.name} AIMS
          </Typography>
          <div>
            Welcome, {username}
            <Badge badgeContent={props.noOfItemsCheckedOut} color="error">
              <Tooltip title="Profile">
                <Link to="/profile" style={{ color: organization?.secondaryColor || '#FFF' }}>
                  <IconButton color="inherit">
                    <AccountCircle />
                  </IconButton>
                </Link>
              </Tooltip>
            </Badge>
            <Tooltip title="Logout">
              <IconButton onClick={handleDialogOpen} color="inherit">
                <PowerSettingsNewIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: menuOpen,
          [classes.drawerClose]: !menuOpen
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: menuOpen,
            [classes.drawerClose]: !menuOpen
          })
        }}
      >
        <div className={classes.toolbar}></div>
        <List>
          {Object.entries(menuItems)
            .filter(([key, value]) => allowedViews.includes(key))
            .map(([key, value]) => (
              <Tooltip title={key} key={key + Math.random()} placement="right">
                <Link to={`/${key.toLowerCase()}`}>
                  <ListItem button key={key + Math.random()}>
                    <ListItemIcon>{value}</ListItemIcon>
                    <ListItemText primary={key} />
                  </ListItem>
                </Link>
              </Tooltip>
            ))}
        </List>
      </Drawer>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle id="alert-dialog-title">{"Are you sure you want to log out?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">All unsaved changes will be lost.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            No
          </Button>
          <Button
            onClick={() => {
              handleDialogClose();
              props.logOutUser();
            }}
            color="secondary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Navbar;
