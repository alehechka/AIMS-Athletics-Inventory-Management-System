// Require Dependencies
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const helmet = require("helmet");
const userRouter = require("./routes/user.route");
const sportRouter = require("./routes/sport.route");
const credentialRouter = require("./routes/credential.route");
const inventoryRouter = require("./routes/inventory.route");
const url = require('url');

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

// Load .env Enviroment Variables to process.env
const { PORT, API_VER } = process.env;

// Instantiate an Express Application
const app = express();

// Configure Express App Instance
var whitelist = ['http://localhost:3000', 'https://stoplight.io']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: "GET,PUT,POST,DELETE",
  allowedHeaders: ['x-access-token', 'authorization', 'Content-Type', 'Accept', 'Origin', 'X-Request-With'],
  credentials: true
}
app.use(cors(corsOptions));

app.use(express.json( { limit: '50mb' } ));
app.use(express.urlencoded( { extended: true, limit: '10mb' } ));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(helmet());
app.use((req, res, next) => {
  req.query = url.parse(req.url, true).query;
  next();
})

// Setup a friendly greeting for the root route.
app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to the AIMS API',
    });
  });

// Assign Routes
const baseRoute = `/api/v${API_VER}/`;
app.use(baseRoute + 'credentials', credentialRouter);
app.use(baseRoute + 'users', userRouter);
app.use(baseRoute + 'sports', sportRouter);
app.use(baseRoute + 'inventory', inventoryRouter);


// This middleware adds the json header to every response
app.use('*', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
})

// Send 404 if no other route matched.
app.use((req, res) => {
    res.status(404).json({
      message: 'Route Not Found',
    });
  });

// Setup a global error handler.
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }
    res.status(500).json({
      message: err.message,
      error: process.env.NODE_ENV === 'production' ? {} : err,
    });
  });

// Open Server on configurated Port
app.set('port', PORT || 5000);

const server = app.listen( app.get('port'), () => { 
    console.info(`Server listening on localhost:${PORT}`);
});