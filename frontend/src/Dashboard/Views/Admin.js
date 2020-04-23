import React from "react";
import { UsersAPI, SportsAPI } from "../../api";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from "@material-ui/icons/Info";
import RolesTable from "./AdminComponents/RolesTable";
import SportsTable from "./AdminComponents/SportsTable";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Icon from "@material-ui/core/Icon";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";

/***
 * Contains the logic for admin page.
 *
 * Hooks:
 * Loading - displays a loading icon when backend is queried/modified.
 * data - contains table data
 * columns - contains column information [unchanged for now]
 * pagesize - updates default pageSize for table
 */
const iconList = [
  {
    name: "Admin",
    value: "people"
  },
  {
    name: "Whistle",
    value: "sports"
  },
  {
    name: "Baseball",
    value: "sports_baseball"
  },
  {
    name: "Basketball",
    value: "sports_basketball"
  },
  {
    name: "Bowling",
    value: "fas fa-bowling-ball"
  },
  {
    name: "Cricket",
    value: "sports_cricket"
  },
  {
    name: "Football",
    value: "sports_football"
  },
  {
    name: "eSports",
    value: "sports_esports"
  },
  {
    name: "Golf",
    value: "sports_golf"
  },
  {
    name: "Handball",
    value: "sports_handball"
  },
  {
    name: "Hockey Sticks",
    value: "sports_hockey"
  },
  {
    name: "Hockey Puck",
    value: "fas fa-hockey-puck"
  },
  {
    name: "Kabaddi",
    value: "sports_kabaddi"
  },
  {
    name: "MMA",
    value: "sports_mma"
  },
  {
    name: "Motor sports",
    value: "sports_motorsports"
  },
  {
    name: "Rugby",
    value: "sports_rugby"
  },
  {
    name: "Soccer",
    value: "far fa-futbol"
  },
  {
    name: "Tennis",
    value: "sports_tennis"
  },
  {
    name: "Table Tennis",
    value: "fas fa-table-tennis"
  },
  {
    name: "Volleyball",
    value: "sports_volleyball"
  }
];
export default function Admin(props) {
  //material Table hooks
  const [isRoleLoading, updateRoleLoading] = React.useState(true);
  const [roleData, updateRoleData] = React.useState([]);
  const [roleColumns, updateRoleColumns] = React.useState([]);
  const [rolePageSize, updateRolePageSize] = React.useState(5);

  const [isSportsLoading, updateSportsLoading] = React.useState(true);
  const [sportsData, updateSportsData] = React.useState([]);
  const [sportsColumns, updateSportsColumns] = React.useState([]);
  const [sportsPageSize, updateSportsPageSize] = React.useState(5);

  const [sizesDialogOpen, setSizesDialogOpen] = React.useState(false);
  const [sizesDialogTitle, setSizesDialogTitle] = React.useState("Edit Sport");
  const [sizesDialogContent, setSizesDialogContent] = React.useState("Filler");

  const [passwordDialogOpen, setPasswordDialogOpen] = React.useState(false);
  const [passwordDialogTitle, setPasswordDialogTitle] = React.useState("Edit Password");
  const [passwordDialogId, setPasswordDialogId] = React.useState(0);
  const [passwordDialogValue, setPasswordDialogValue] = React.useState("");
  const closeSizesDialog = (editConfirmed) => {
    if (editConfirmed) {
    } else {
    }
    setSizesDialogOpen(false);
  };
  const closePasswordDialog = (editConfirmed) => {
    if (editConfirmed) {
      const password = passwordDialogValue;
      if (password < 8 || password > 32) {
        props.showMessage("Invalid Password Length", "warning");
      }
      else {
        props.showMessage(`Changed Password Successfully for ${passwordDialogTitle}`, "success");
        console.log(`ID: ${passwordDialogId} : ${passwordDialogValue}`);
        setPasswordDialogOpen(false);
        updateRoleLoading(false);
      }
    } else {
      props.showMessage("Canceled Password Change", "info");
      setPasswordDialogOpen(false);
      updateRoleLoading(false);
    }
  };

  const { getRole } = props.context.actions;

  /**
   * Emulates ComponentDidMount lifecycle function
   *
   * Queries the backend for credential data and populates the table.
   */
  React.useEffect(() => {
    const defaultOptions = { editable: "never", hidden: true, searchable: true };
    UsersAPI.getUsers(null, null, { isAdmin: true, isAthlete: true, isCoach: true, isEmployee: true }).then((users) => {
      //lets users search hidden columns
      updateRoleColumns([
        { title: "ID", field: "id", ...defaultOptions },
        { title: "Email", field: "email", ...defaultOptions },
        { title: "Full Name", field: "fullName", editable: "never", searchable: true, cellStyle: { width: "40%" } },
        { title: "First Name", field: "firstName", ...defaultOptions },
        { title: "Last Name", field: "lastName", ...defaultOptions },
        {
          title: "Role",
          field: "role",
          cellStyle: { width: "50%" },
          customFilterAndSearch: (term, rowData) =>
            getRole(rowData.role)
              .toLowerCase()
              .includes(term.toLowerCase()),
          render: (rowData) => getRole(rowData.role),
          editComponent: (props) => (
            <FormControl required component="fieldset">
              <FormGroup row>
                <FormControlLabel
                  value="Admin"
                  label="Admin"
                  control={
                    <Checkbox
                      checked={props.value.isAdmin}
                      onChange={(e) => {
                        props.onChange({ ...props.value, isAdmin: e.target.checked });
                      }}
                      name="Admin"
                    />
                  }
                />
                <FormControlLabel
                  value="Athlete"
                  label="Athlete"
                  control={
                    <Checkbox
                      checked={props.value.isAthlete}
                      onChange={(e) => {
                        props.onChange({ ...props.value, isAthlete: e.target.checked });
                      }}
                      name="Athlete"
                    />
                  }
                />
                <FormControlLabel
                  value="Coach"
                  label="Coach"
                  control={
                    <Checkbox
                      checked={props.value.isCoach}
                      onChange={(e) => {
                        props.onChange({ ...props.value, isCoach: e.target.checked });
                      }}
                      name="Coach"
                    />
                  }
                />
                <FormControlLabel
                  value="Employee"
                  label="Employee"
                  control={
                    <Checkbox
                      checked={props.value.isEmployee}
                      onChange={(e) => {
                        props.onChange({ ...props.value, isEmployee: e.target.checked });
                      }}
                      name="Employee"
                    />
                  }
                />
              </FormGroup>
            </FormControl>
          )
        }
      ]);
      updateRoleData(mapUsers(users));
      updateRoleLoading(false);
    });
    SportsAPI.getSports().then((res) => {
      updateSportsColumns([
        { name: "ID", field: "id", ...defaultOptions },
        { title: "Name", field: "name", cellStyle: { width: "30%" } },
        {
          title: "Gender",
          field: "gender",
          cellStyle: { width: "30%" },
          lookup: { M: "Male", F: "Female" },
          editComponent: (props) => (
            <FormControl required component="fieldset">
              <RadioGroup
                row
                defaultValue="F"
                value={props.value}
                name="gender"
                onChange={(e) => props.onChange(e.target.value)}
              >
                <FormControlLabel value="F" control={<Radio />} label="Female" />
                <FormControlLabel value="M" control={<Radio />} label="Male" />
              </RadioGroup>
            </FormControl>
          )
        },
        {
          title: "Sizes",
          field: "sportSizes",
          render: (rowData) => (
            <Tooltip title="View Item Sizes">
              <IconButton
                onClick={() => {
                  setSizesDialogTitle("View Item Sizes");
                  setSizesDialogOpen(true);
                  setSizesDialogContent(rowData);
                }}
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
          ),
          editable: "never",
          filtering: false
        },
        {
          title: "Icon",
          field: "icon",
          filtering: false,
          render: (rowData) => <Icon className={rowData.icon}>{rowData.icon}</Icon>,
          editComponent: (props) => (
            <FormControl>
              <Select defaultValue="people" value={props.value} onChange={(e) => props.onChange(e.target.value)}>
                {iconList.map((icon) => (
                  <MenuItem value={icon.value}>
                    <ListItemIcon>
                      <Icon className={icon.value} style={{ marginRight: "3px" }}>
                        {icon.value}
                      </Icon>
                      {icon.name}
                    </ListItemIcon>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )
        },
        { title: "Default", field: "default", type: "boolean", editable: "never", searchable: false, filtering: false },
        { title: "Display Name", field: "displayName", ...defaultOptions }
      ]);
      updateSportsData(res);
      updateSportsLoading(false);
    });
  }, [getRole]);

  const mapUsers = (users) => {
    return users.map((user) => {
      return {
        id: user.id,
        email: user.credential.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.credential
      };
    });
  };

  return (
    <div style={{ maxWidth: "100%", marginLeft: "10px", marginRight: "10px", marginBottom: "10px" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <RolesTable
            showMessage={props.showMessage}
            isRoleLoading={isRoleLoading}
            updateRoleLoading={updateRoleLoading}
            roleData={roleData}
            updateRoleData={updateRoleData}
            mapUsers={mapUsers}
            roleColumns={roleColumns}
            rolePageSize={rolePageSize}
            updateRolePageSize={updateRolePageSize}
            passwordDialogOpen= {passwordDialogOpen}
            setPasswordDialogOpen={setPasswordDialogOpen}
            passwordDialogTitle={passwordDialogTitle}
            setPasswordDialogTitle={setPasswordDialogTitle}
            passwordDialogId={passwordDialogId}
            setPasswordDialogId={setPasswordDialogId}
            passwordDialogValue={passwordDialogValue}
            setPasswordDialogValue={setPasswordDialogValue}
            closePasswordDialog={closePasswordDialog}
          />
        </Grid>
        <Grid item xs={12}>
          <SportsTable
            showMessage={props.showMessage}
            isSportsLoading={isSportsLoading}
            updateSportsLoading={updateSportsLoading}
            sportsData={sportsData}
            updateSportsData={updateSportsData}
            sportsColumns={sportsColumns}
            sportsPageSize={sportsPageSize}
            updateSportsPageSize={updateSportsPageSize}
            sizesDialogTitle={sizesDialogTitle}
            setSizesDialogTitle={setSizesDialogTitle}
            sizesDialogContent={sizesDialogContent}
            setSizesDialogContent={setSizesDialogContent}
            sizesDialogOpen={sizesDialogOpen}
            setSizesDialogOpen={setSizesDialogOpen}
            closeSizesDialog={closeSizesDialog}
          />
        </Grid>
      </Grid>
    </div>
  );
}
