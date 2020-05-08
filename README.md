# Athletics Inventory Management System

The goal of the AIMS (Athletics Inventory Management System) project is to develop a more sustainable solution for UNO Athletics. The application itself will be a React / Node web app which will allow for coaches and staff members to maintain an active inventory of equipment. 

Below are the main features this application will support:

## Features

- [X] Check in equipment from users
- [X] Check out equipment to athletes, including a mass check in/out feature for game days
- [X] Add and edit equipment in inventory system
- [X] Track monetary value of inventory
- [X] Custom profiles for athletes, coaches, and staff
- [X] Generate reports for various purposes (i.e. Students with most issued equpment, etc.).
- [X] Supports local storage and offline usage allowing for the application to be used anywhere.
- [X] Record size information for each student athlete
- [X] View all active athletes, staff, and in-stock inventory
- [X] Change roles for users (athlete, staff, employee, admin)



## Install

Requires Node: https://nodejs.org/en/download/

**One and Done**

For simplification a script has been created which will run both the frontend and backend:

In head directory, run *startApp.bat*

If you wish to run them separately follow the instructions below: 

**Frontend**

```bash
> cd .\frontend
> npm install
> npm start
```

Visit http://localhost:3000 in browser.

**Backend**

```bash
> cd .\backend
> npm install 
> npm run dev
```

Visit http://localhost:5000 to get started.

## API Documentation

To view documention of all available backend API endpoints visit: https://stoplight.io/p/docs/gh/alehechka/aims-athletics-inventory-management-system 

