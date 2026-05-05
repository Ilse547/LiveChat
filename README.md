

# Live Chat Fullstack Webapp
## Deployment:
this project is deployed at https://livechat-qx1k.onrender.com/  
it uses [render](https://render.com/)  

## Description: 
Fullstack Webapp for users to be able to have a real time communication using a websocket (GUNjs), a frontend and backend framework.  

Users should be able to:   
- Create/Delete and Login into an account  
- Reset the account password  
- Create/Delete Groups with other users  
- Users should be able to Edit the group name  
- If they are an Admin Delete messages  
- Users should be able to edit their messages  

# Environmental variables:
In the .env file you should have:  
- ``` PORT = ...``` -> The Port the server is running on  
- ``` MONGO_URI = ...``` -> The URI to connect the server to the mongodb database
- ``` JWT_KEY = ...``` -> The JsonWebToken key to create a token
- ``` EMAIL_PASS = ...``` -> The password for th email
- ``` EMAIL_USER = ...``` -> The email adress

# How to run:
After cloning:
1. To make sure everything is installed :``` npm install ```  
2. Set the environmental variables  
3. Build the project using: ``` npm run build ```  
4. Start the server using : ``` npm start ``` or ``` node /server/app.js ```  


## Important commands:
To build the project: ``` npm run build ```  
To run the project: ``` npm start ``` or ``` node /server/app.js ```  
To run the tests: ```npm test ```
To run the E2E tests: ```npm run test:e2e ``` while already running a server


## Authentication & Credentials:
The app requires an email for the verification codes:



## Toolkit
### Live Communication:
The live communication will be handled by [GUNjs](https://gun.eco/)

### Backend:
Express for the backend  
Backend Routing and handling of the credentials, database conections

### Frontend:
Vue3 as a frontend framework

### Database:
MongoDB for storing user data and group data
GUNjs for the messages
![Db](pictures/DB.png)

### Authentication:
This project uses JWT to allow Users to access certain pages and verify their identity  

## Convention and choices made:
Variables:```PascalCase```
Function: ```PascalCase```

All Functions in their seperate file, imported in the app.js file.  
Automatic tests:   

### Testing:
The project uses the jest and supertest libraries to run tests  

## Architecture diagram:
![Architecture](pictures/diagram.png)

# Dynamic Routes:
## authentication Routes:
``` /login ``` -> To submit credentials   
``` /login/verify ``` -> Verify OTP  
``` /register ``` -> Register a new account  
``` /confirm ``` -> Confirm a new account with OTP  
``` /verify ``` -> Verify the JWT token  
``` /reset-password ``` -> Reset the password   
``` /reset-password/verify ``` -> Verify the OTP and write new password  
``` /me ``` -> To get user account information  

## Group routes:
``` /creategroup ``` -> To create a group  
``` /groups ``` -> To fetch the groups a user is part of  		
``` /groupinfo/:groupname ``` -> To check if a user is part of the group  

# file structure:
```
Livechat/  
├── README.md  
├── package.json  
├── package-lock.json  
├── webpack.config.js  
├── .gitignore  
├── .env  
├── src/  
│   ├── components/  
│   │   ├── Home.vue  
│   │   └── *.vue  
│   ├── pages/  
│   │   ├── home.js  
│   │   └── *.js files  
│   ├── styles/  
│   │   ├── style.css  
│   │   └── *.css files   
├── public/  
│   ├── index.html  
│   └── *.html  
├── dist/  
│   └── Build output  
├── server/  
│   ├── app.js  
│   ├── middleware  
│   │   ├── logger.js  
│   │   └── *.js files    
│   ├── models  
│   │   ├── user.js  
│   │   └── *.js files  
│   ├──tests  
│   │   ├── login.test.js  
│   │   └── *.test.js files
│   ├──routes  
│   │   ├── auth.js  
│   │   └── *.js files
│   ├──service  
│   │   ├── email.js  
│   │   └── *.js files  
```

---
# Modules:
## SE_06(No SQL Databases):
Project uses 2 NoSQL Databases:  
1. GUNjs -> messages
2. MongoDB -> User data and Group Data

---
## SE_08: Clean Code

---
## SE_09(Cyber security):
### Threat model analysis:
Using the `STRIDE` threat model:  
1. Spoofing Identity  
An attacker could Spoof someone Identity login in as another User   
They could Brute Force into soemone's account  
Could make up a fake JWT token  

2. Tampering With Data  
Could Delete another Users Data  
Modify Group particiants  
NOSQL Injections  

3. Repudiation  
Attacker Could deny doing anything(NEEDS IMPROVEMENT)  


4. Information Disclosure  
Attacker could try to get passwords in the DB  
Could expose the JWT Key  
Could try to access to users email  
Could see messages in groups even if not a participant  
Can see error messages sent to Client (NEEDS IMPROVEMENT)  


5. Denial Of Service  
Attacker could use bots to spam the /login and /register endpoints  
If logged in they could spam messages to saturate the connection  

6. Elevation Of Privilege  
An Attacker could access messages in other users group  
Modify JWT token to gain admin status  
Access protected routes without a token 

## Mitigations:
1. JWT protected endpoints  
2. 2FA by default with a OTP sent to the email inbox ( expires after 10 min.)  
3. Rate limiting on all authentication routes  
4. Security headers (HelmetJS)  
5. Input validation (express-mongo-validation) 
6. Request body size limit 
7. Logs

---
## SE_10: Automated Software Testing
This project has several tests:
Integration tests:  
1. Login tests
2. Registration tests
3. Group creation tests
Unit tests:  
1. VerifyToken tests

End-to-End tests:
1. A Login test


