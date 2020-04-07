import React from 'react';
import MaterialTable from 'material-table';
import Chip from '@material-ui/core/Chip';
import ProfileDialog from './Components/ProfileDialog'
import { UsersAPI, SportsAPI } from "../../api";
import Icon from "@material-ui/core/Icon";

/**
 * Contains the material table which lets the user edit staff entries.
 * 
 * Hooks:
 * Loading - displays a loading icon when backend is queried/modified.
 * data - contains table data
 * columns - contains column information [unchanged for now]
 * pagesize - updates default pageSize for table
 * dialogOpen - contains the state of dialog box
 * dialogTitle - contains the title for dialog box
 * inputs - Object containing all form data to be modified
 * sport - list of sports selected in form
 * sports - object containing all sports available
 * sportIdLookup - Lookup for Sport Objects
 * 
 * Props:
 * showMessage Displays a snackbar
 * @param {*} props props passed down from dashboard
 */
export default function Staff(props) {
    //List of default values to fill in the form
    const initialValues = {
        email: "",
        username: "",
        password: "",
        schoolId: props.context.organization.shortName,
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        zip: 0,
        phone: 0,
        gender: "F",
        height: 0,
        weight: 0,
        lockerNumber: "",
        lockerCode: "",
        role: "Athlete",
        isAdmin: false,
        isEmployee: false,
        isCoach: false,
        isAthlete: true
    };
    const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

    //material Table hooks
    const [isLoading, updateLoading] = React.useState(true);
    const [data, updateData] = React.useState([]);
    const [columns, updateColumns] = React.useState([]);
    const [pageSize, updatePageSize] = React.useState(5);

    //Dialog hooks
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [dialogTitle, setDialogTitle] = React.useState("Add");
    //Form Hooks
    const [inputs, setInputs] = React.useState(deepCopy(initialValues));
    const [sport, setSport] = React.useState([]);
    const [sports, setSports] = React.useState([]);
    const [sportIdLookup, setSportIdLookup]= React.useState({});

    /**
     * Emulates ComponentDidMount lifecycle function
     * 
     * Queries the backend for staff data, sports data and populates the table.
     */
    React.useEffect(()=>{
        UsersAPI.getUsers(null, null, {isAdmin: true, isEmployee: true, isCoach: true,}).then( (staff)=> {
            updateColumns([
                {title: 'ID', field: 'id', hidden: true},
                {title: 'Sport', field: 'sportsJson', hidden: true},
                {title: 'First Name', field: 'firstName'},
                {title: 'Last Name', field: 'lastName'},
                {title: 'Sport(s)', field: 'sports',
                    render: rowData => rowData.sports.map((val, index) =>
                        <Chip key={index} 
                            label={val.displayName} style ={{margin: 2}}
                            icon={<Icon>{val.icon}</Icon>}>
                        </Chip>),
                    customFilterAndSearch: (term, rowData) => 
                        rowData.sports
                        .map(val => val.displayName)
                        .some(val => val.toLowerCase().includes(term.toLowerCase()))
                },
            ]);
            const customData = staff.map(user =>({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                sportsJson: JSON.stringify(user.sports),
                sports: user.sports
            }));
            updateData(customData);
            updateLoading(false);
        });
        SportsAPI.getSports().then((sports)=> {
            setSports(sports.map(sport => sport.displayName));
            setSportIdLookup(sports.reduce((obj, sport) => {
                obj[sport.displayName] = sport
                return obj
            }, {}));
        });
    }, []);
    /**
     * One function which handles all state changes in add/edit user form
     * Sports select statement is excluded
     * 
     * @param {} event executed when a input is changed
     */
    const changeInput = (event) =>{
        const key = event.target.name;
        let value = event.target.value;
        //special handler for radio button
        if (key === "isActive") {
            value = value === "active";
        }
        setInputs({...inputs, [key]: value});
    };
    /**
     * handles changes in sports select input
     * @param {*} event 
     */
    const handleSportChange = (event) => {
        setSport(event.target.value);
    };
    /**
     * Closes Dialog Box and sends the updated data to the backend
     * 
     * @param {*} type true if user clicked on confirm else false
     */
    const closeDialog = (type) => {
        setDialogOpen(false);
        if (type){
            const sportIds = sport.filter(name => !sportIdLookup[name].default).map(name => sportIdLookup[name].id);
            const newSportsJson = sport.map(sportName => ({
                id: sportIdLookup[sportName].id,
                displayName: sportIdLookup[sportName].displayName,
                gender: sportIdLookup[sportName].gender,
                icon: sportIdLookup[sportName].icon,
            }));
            const updatedUser = {
                firstName: inputs.firstName,
                lastName: inputs.lastName,
                sportsJson: JSON.stringify(newSportsJson),
                sports: newSportsJson
            };
            console.log("Updated SportIds:" + sportIds);
            const newUser = deepCopy(inputs);
            Object.keys(newUser).map(key => {
                if (newUser[key] === "") {
                    delete newUser[key];
                }
                return null;
            });
            newUser.schoolId = props.context.organization.id;
            newUser.sports = sportIds;
            if (dialogTitle.includes("Edit")) { 
                updatedUser.id = inputs.id;
                newUser.id = inputs.id;
                UsersAPI.updateUser(newUser).then((res)=>{
                    console.log(res);
                    updatedUser.id = res.id;
                    updateData(data.map(row => row.id === updatedUser.id? updatedUser: row));
                    updateLoading(false); 
                    props.showMessage(dialogTitle + " Done");
                }).catch(err =>{
                    props.showMessage("Error:" + err, "error");
                    updateLoading(false);
                });
            }
            else {
                if (inputs.role !== "Athlete") {
                    inputs["is" + inputs.role] = true;
                }
                UsersAPI.createUser(inputs.email, inputs.userName, inputs.password, inputs.isAdmin, inputs.isEmployee, inputs.isCoach, inputs.isAthlete, newUser).then((res)=>{
                    console.log(res);
                    updatedUser.id = res.id;
                    updateData([...data, updatedUser]);
                    updateLoading(false); 
                    props.showMessage(dialogTitle + " Done");
                }).catch(err =>{
                    props.showMessage("Error:" + err, "error");
                    updateLoading(false);
                });
                
            }
        }
        else {
            props.showMessage(dialogTitle + " Canceled", "info");
            updateLoading(false);
        }    
    };
    return (
    <div style={{ maxWidth: '100%', marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}>
        <MaterialTable
            title="Staff"
            isLoading= {isLoading}
            columns={columns}
            data={data}
            pageSize = {pageSize}
            onChangeRowsPerPage = {updatePageSize}
            options={{
                search: true,
                filtering: true,
                exportButton: true,
                actionsColumnIndex: -1,
                tableLayout: "fixed"
            }}
            actions={[
                {
                  icon: 'list',
                  tooltip: 'Transactions',
                  onClick: (event, rowData) => {
                    props.showMessage("Redirecting to Profile Page");
                    props.history.push(`/profile?id=${rowData.id}`);
                  }
                },
                {
                    icon: 'create',
                    tooltip: 'Edit',
                    onClick: (event, rowData) => {
                        UsersAPI.getSingleUser(rowData.id).then((data)=>{
                            updateLoading(true);
                            //Remove all Null entries in json
                            Object.keys(data).map(key => {data[key] = data[key] ? data[key]: ""; return null;});
                            setInputs(deepCopy(data));
                            const rowSportsJson = JSON.parse(rowData.sportsJson);
                            setSport(rowSportsJson.map(sport => sport.displayName));
                            setDialogOpen(true);
                            setDialogTitle("Edit Staff");
                        });
                    }
                },
                {
                    icon: 'add',
                    tooltip: 'Add',
                    isFreeAction: true,
                    onClick: (event, rowData) => {
                        updateLoading(true);
                        setInputs(deepCopy(initialValues));
                        setSport([]);
                        setDialogOpen(true);
                        setDialogTitle("Add Staff");
                    }   
                  },
            ]}
        />
        <ProfileDialog
            {...props}
            dialogOpen = {dialogOpen} 
            closeDialog = {closeDialog}
            dialogTitle = {dialogTitle}
            inputs = {inputs}
            changeInput = {changeInput}
            sport = {sport}
            sports = {sports}
            handleSportChange = {handleSportChange}
        />
    </div>);
}