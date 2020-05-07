import React from "react";
import {
  SportsAPI,
  DashboardAPI,
} from "../../api";
import MaterialTable from 'material-table';
import Grid from "@material-ui/core/Grid";
const numeral = require('numeral');

/**
 * Conatins the dashboard layout and tables displaying relevant data.
 * 
 * @param {Object} props - props passed down from Dashboard
 * @param {Function} props.showMessage - Helper function to display snackbar message.
 * @param {Object} props.context - Context variable containing all relevant user information. 
 */
export default function Home(props) {
  const role = props.context.credentials.role;
  const isAthlete = role === "Athlete";
  /**
   * returns css object for hiding item based on condition
   * 
   * @param {Boolean} condition - condition to be checked
   */
  const hideItem = (condition) => condition? {display: "none"}:{};
  const defaultTableOptions = {
    search: true,
    filtering: true,
    exportButton: true,
    exportAllData: true,
    pageSize: 5,
    pageSizeOptions: [5]
  };
  /**
   * Uses the numeral package to convert string in currency format.
   * 
   * @param {String} stringToConvert - string to be converted to currency format
   */
  const convertStringToCurrency = (stringToConvert) => numeral(stringToConvert).format('($0.00a)');
  
  const [equipmentStatsLoading, setEquipmentStatsLoading] = React.useState(true);
  const [sportLookupOptions, setSportLookupOptions] = React.useState({});

  const sportSpendingColumns = [
    {title: "Sport", field: "sport", lookup: sportLookupOptions},
    {title: "Users", field: "numberOfUsers", type: 'numeric', filtering: false},
    {title: "Spending", field: "spending", type: 'numeric', filtering: false,
      render: rowData => convertStringToCurrency(rowData.spending),
    },
    {title: "Average Spend", field: "averagePricePerUser", type: 'numeric', filtering: false, defaultSort: "desc",
      render: rowData => convertStringToCurrency(rowData.averagePricePerUser)},
  ];
  const [sportSpendingData, setSportSpendingData]= React.useState([]);

  const genderSpendingColumns = [
    {title: "Gender", field: "gender", lookup: {"M": "Male", "F": "Female", "None": "Common"},},
    {title: "Sports", field: "sports", filtering: false},
    {title: "Users", field: "numberOfUsers", type: 'numeric', filtering: false},
    {title: "Spending", field: "spending", type: 'numeric', filtering: false,
      render: rowData => convertStringToCurrency(rowData.spending),
    },
    {title: "Average Spend", field: "averagePricePerUser", type: 'numeric', filtering: false, defaultSort: "desc",
      render: rowData => convertStringToCurrency(rowData.averagePricePerUser)},
  ];
  const [genderSpendingData, setGenderSpendingData]= React.useState([]);
  
  /**
   * Emulates the ComponentDidMount lifecycle function.
   *  
   * Queries the backend for data and formats it to represented in tables.
   */
  React.useEffect(() => {
    if (!isAthlete) {
      SportsAPI.getSports().then((sports) => {
        const selectOptions = sports.reduce((obj, sport) => {
          obj[sport.displayName] = sport.displayName;
          return obj;
        }, {});
        setSportLookupOptions(selectOptions);
      });
      DashboardAPI.getSportEquipmentStats().then(stats=>{
        let newSportSpendingData = stats.map(sportStat=> ({
          sport: sportStat.sport.displayName,
          spending: sportStat.totalCheckedOut,
          averagePricePerUser: sportStat.averagePricePerUser,
          numberOfUsers: sportStat.numberOfUsers,
        }));
        setSportSpendingData(newSportSpendingData);

        let newGenderSpendingData = stats.map(sportStat=> ({
          sport: sportStat.sport.name,
          gender: sportStat.sport.gender,
          spending: sportStat.totalCheckedOut, 
          averagePricePerUser: sportStat.averagePricePerUser,
          numberOfUsers: sportStat.numberOfUsers,
          users: sportStat.users,
        })).reduce((acc, item)=> {
            const group = item.gender || "None";
            acc[group] = acc[group] || [];
            acc[group].push(item);
            return acc;
        },{});
        newGenderSpendingData = Object.entries(newGenderSpendingData).map(([key, arr])=>({
          gender: key,
          sports: arr.map(sport=> sport.sport).join(", "),
          spending: arr.map(sport=> sport.spending).reduce((a,b)=>a+b, 0),
          numberOfUsers: arr.map(sport=> sport.users).reduce((a, b) => [...new Set([...a ,...b])], []).length
        }));
        newGenderSpendingData = newGenderSpendingData.map(genderData=>({
          ...genderData,
          averagePricePerUser: genderData.spending / genderData.numberOfUsers,
        }));
        setGenderSpendingData(newGenderSpendingData);

        setEquipmentStatsLoading(false);
      });
    }
  },[isAthlete]);
  return(
    <React.Fragment>
      <div style={{ maxWidth: "100%", marginLeft: "10px", marginRight: "10px", marginBottom: "10px" }}>
        <Grid container spacing={3}>
          <Grid item xs={6} style={hideItem(isAthlete)}>
            <MaterialTable
              title="Spending by Sport"
              isLoading={equipmentStatsLoading}
              options={defaultTableOptions}
              data={sportSpendingData}
              columns={sportSpendingColumns}
            />
          </Grid>
          <Grid item xs={6} style={hideItem(isAthlete)}>
            <MaterialTable
              title="Spending by Gender"
              isLoading={equipmentStatsLoading}
              options={defaultTableOptions}
              data={genderSpendingData}
              columns={genderSpendingColumns}
            />
          </Grid>
        </Grid>
      </div>
      
    </React.Fragment>
  );
}
