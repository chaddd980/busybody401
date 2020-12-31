# CS50 Final Project - Caregiving Staff Agency Scheduler

This project is an hybrid mobile application that allows a staffing agency schedule its employees for shifts and allows those employees to clock in and clock out from their shifts. I wanted to create this project to improve my understanding of authentication and realtime database use within mobile and web applications. This application has real world applications as this app will be used by my mother's business and it solves a real pain point for the business involving organizing employees and collecting information about shift duration.

Technologies used:
* Angular
* Ionic
* Firebase
* Cloud Firestore
* Material angular
* Other small libraries and packages

## How The App Works
The app basically has 2 views. A manager view and an employee view. Manager accounts are created through Goolge's Cloud Firestore dashboard. Employees can signup frough the app. The manager accounts are created through the Cloud Firestore dashboard to prevent employees from accessing the managers dashboard by signing up as a manager.

During registration you need to enter these fields:

* First name
* Last name
* Email
* Phone number
* Password (must be 8 characters and Firestore handles hashing)

The employee homepage shows info about the logged in employee's next shift along with past shifts that have not been completed (they have not clocked out of the shift but the end time has passed). from the dashboard employees can clock in/clock out. The calendar page shows a calendar view of all shifts for this employee. Employees are also able to view their profile on the profile page, enter their payroll and tax info on the payroll page and view all passed shifts on the shift history page.

The manager homepage has a list view of all shifts broken down into assigned (to an employee), unassigned or completed. These shifts can be edited. Managers can also create client profiles and new shifts from this page. There is also a calendar page showing all shifts and an employee page with a list view of all employees and their info.

## Routing
Each route checks if the user is authenticated. This prevents non authenticated users from accessing any route other than signin and signup and prevents employees from accessing the manager routes and vice versa.

## Database
Cloud Firestore is a document based database for mobile development. Documents are organized in collections, does not require servers and offers real time updates. Documents and collections allows easy querying without using SQL. Collections are created for Users, Shifts, and Clients

# Possible Improvements
There are some improvements that can be made and plan to be done in the future. These are:

* Create an administrator account that confirms user identity. to allow managers to signup through the app while also preventing employees from signing up as a manager.
* Let employees request a time change for shifts and allow managers to accept or deny these changes.
* allow managers to view payroll and tax data submitted by employees and directly send to accountant through app.
* prevent users from clocking in or clocking out unless within a certain proximity to the client address using geofencing.

# How to Launch Application

* Install the Ionic CLI: npm install -g @ionic/cli
* Clone this repository: git clone https://github.com/chaddd980/busybody401.git
* Navigate to repo in a terminal: cd busybody401
* Install dependencies: npm i
* Run locally in a browser: ionic serve
