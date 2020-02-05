// Require Dependencies
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const helmet = require("helmet");
const userRouter = require("./routes/userRouter");
const sportRouter = require("./routes/sportRouter");

// Load .env Enviroment Variables to process.env

require('mandatoryenv').load([
    'DB_HOST',
    'DB_DATABASE',
    'DB_USER',
    'DB_PASSWORD',
    'PORT',
    'API_VER'
]);
const { PORT, API_VER } = process.env;

// Instantiate an Express Application
const app = express();

// Configure Express App Instance
app.use(express.json( { limit: '50mb' } ));
app.use(express.urlencoded( { extended: true, limit: '10mb' } ));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors());
app.use(helmet());

// Setup a friendly greeting for the root route.
app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to the AIMS API',
    });
  });

// Assign Routes
const baseRoute = `/api/v${API_VER}/`;
app.use(baseRoute + 'users', userRouter);
app.use(baseRoute + 'sports', sportRouter);

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
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  
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