import React from "react";
import {
  UsersAPI,
  SportsAPI,
  CredentialAPI,
  DashboardAPI,
  InventoryAPI,
  changeFavicon,
  EquipmentAPI,
  TransactionAPI
} from "../../api";
import MaterialTable from 'material-table';
import Grid from "@material-ui/core/Grid";
const numeral = require('numeral');

/**
 * TODO: Remove Function
 * @param {} props 
 */
function DevButtons(props) {
  const user = {
    id: 1,
    firstName: "Adam"
  }
  const inventories = {
    id: 1,
    name: "T-Shirt",
    inventorySizes: [
      {
        id: 1,
        size: "XL",
        price: 20.00,
        quantity: 10
      }
    ]
  }
  const selectedInventorySize = {
    id: 3,
    size: "M",
    price: 25.00,
    quantity: 20
  }
  const transactions = [
    {
      user: user,
      items: [
        {
          checked:true,
          inventorySize: inventories.inventorySizes[0],
          amount: 2
        },
        {
          checked:true,
          inventorySize: selectedInventorySize,
          amount: 1
        }
      ]
    }
  ];
  const transactions2 = [
    {
      user: user,
      items: [
        {
          equipment: {id: 1},
          amount: 2,
          checked: true
        },
      ]
    }
  ];
  const [hideButtons, setHideButtons] = React.useState(true);
  return(
  <div>
      <button onClick={() => setHideButtons(!hideButtons)}>Dev Buttons</button>
      <div style={hideButtons?{display:"none"}:{}}>
      <button onClick={() => UsersAPI.getUsers(null, null, {withDetails:["UserSize","Equipment"]})}>Get Users</button>
      <button onClick={() => UsersAPI.getSingleUser(7)}>Get Single User</button>
      <button onClick={() => UsersAPI.getCurrentUser()}>Get Current</button>
      <button onClick={() => UsersAPI.createUser("test8@test.com", null, "password", false, false, false, true, { sports: [2, { id: 3 }], phone: 1234567891 })}>
        Create User
      </button>
      <button
        onClick={() =>
          UsersAPI.updateCurrentUser({ address: "Admin City", userSizes: [{ size: "L", sportSizeId: 2 }] })
        }
      >
        Update Current
      </button>
      <button onClick={() => UsersAPI.updateUser({ id: 3, address: "Athlete Town" })}>Update User</button>
      <br />
      <br />
      <button onClick={() => SportsAPI.getSports()}>Get Sports</button>
      <button onClick={() => SportsAPI.getSport(1)}>Get Sport</button>
      <button onClick={() => SportsAPI.createSport({ name: "Football", gender: "M" })}>Create Sport</button>
      <button onClick={() => SportsAPI.updateSport({ id: 1, name: "Administration", gender: "M" })}>
        Update Sport
      </button>
      <br />
      <br />
      <button onClick={() => SportsAPI.updateUserSports(4, [3, { id: 2 }])}>Update User Sports</button>
      <br />
      <br />
      <button onClick={() => CredentialAPI.changePassword("test", "admin")}>Change Password</button>
      <br />
      <br />
      <button onClick={() => InventoryAPI.getInventory(null, null, {})}>Get Inventory</button>
      <button onClick={async () => console.log(await InventoryAPI.getSingleInventory(1))}>Get Single Inventory</button>
      <button
        onClick={() =>
          InventoryAPI.createInventory({
            name: "Game Jersey",
            description: "Home Game Jersey",
            surplus: false,
            taxable: false,
            expendable: false,
            sportSize: 1,
            inventorySizes: [{ size: "M", price: 40.35, quantity: 25 }]
          })
        }
      >
        Create Inventory
      </button>
      <button
        onClick={() =>
          InventoryAPI.updateInventory({
            id: 2,
            name: "Game Jersey",
            description: "Away Game Jersey",
            surplus: true,
            taxable: true,
            expendable: true,
            sportSize: 2,
            inventorySizes: [{ id: 3, size: "XL", price: 50.25, quantity: 10 }]
          })
        }
      >
        Update Inventory
      </button>
      <br />
      <br />
      <button onClick={() => EquipmentAPI.getEquipment({ sports: [1, { id: 2 }] })}>Get Equipment</button>
      <button onClick={() => EquipmentAPI.getCurrentEquipment({ count: 0 })}>Get Current Equipment</button>
      <br />
      <br />
      <button onClick={() => TransactionAPI.getTransactions({})}>Get Transactions</button>
      <button onClick={() => TransactionAPI.checkOut(transactions, "comment")}>Check out</button>
      <button onClick={() => TransactionAPI.checkIn(transactions2, "comment")}>Check in</button>
      <br />
      <br />
      <button onClick={() => DashboardAPI.getSportEquipmentStats()}>Get Equipment Stats</button>
      <br />
      <br />
      <button onClick={() => changeFavicon("https://www.google.com/favicon.ico")}>Change Favicon</button>
    </div>
    </div>
  );
}
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
  },[]);
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
          <Grid item xs={12}>
            <DevButtons/>
          </Grid>
        </Grid>
      </div>
      
    </React.Fragment>
  );
}
