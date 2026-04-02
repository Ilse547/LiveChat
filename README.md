

# Live Chat Fullstack Webapp


## Description: 
Fullstack Webapp for users to be able to have a real time communication using a websocket (GUNjs), a frontend and backend framework.  

Users should be able to:   
- Create/Delete and Login into an account  
- Reset the account password  
- Create/Delete Groups with other users  
- Users should be able to Edit the group name  
- If they are an Admin Delete messages  
- Users should be able to edit their messages  



# How to run:
After cloning:  
To make sure everything is installed :``` npm install ```  
To build the project: ``` npm run build ```  
To run the project: ``` npm start ``` or ``` node /server/app.js ```  
To run the tests: `````npm test ```


# Environmental variables:
In the .env file you should have:  
- ``` PORT = ...``` -> The Port the server is running on  
- ``` MONGO_URI = ...``` -> The URI to connect the server to the mongodb database
- ``` JWT_KEY = ...``` -> The JsonWebToken key to create a token  



## Authentication & Credentials:
### Credential:
Admin credentials:    
password:  Admin  
username:  Admin123	

User credential:   
Password:  testtest  
username:  test  

## Toolkit
### Live Communication:
The live communication will be handled by [GUNjs](https://gun.eco/)

### Backend:
Express for the backend  
Backend Routing and handling of the credentials, database conections

### Frontend:
Vue3 as a frontend framework

### Database:
MongoDB for stroign user data and group data
GUNjs for the messages

### Authentication:
This project uses JWT to ...

## Convention and choices made:
Variables:```PascalCase```
Function: ```PascalCase```

All Functions in their seperate file, imported in the app.js file.  
Automatic tests:   

### Testing:
The project uses the jest and supertest libraries to run tests  


## How to run the project:
In the /backend folder run ```node app.js```


# file structure:

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
│   ├── styles/  
│   │   ├── icon.png  
│   │   └── *.png files   
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