

# Live Chat Fullstack Webapp


## Description: 
Fullstack Webapp for users to be able to have a real time communication using a websocket (GUNjs), a frontend and backend framework.  
Users should be able to:  
- Create/Delete and Login into an account
- Reset the account password
- Create/Delete Groups with other users
- If they are an Admin Delete messages

# How to run:
After cloning:  
To make sure everything is installed :``` npm install ```  
To build the project: ``` npm run build ```  
To run the project: ``` npm start ``` or ``` node /server/app.js ```


## Authentication & Credentials:
### Credential:
Admin credentials:
password:
username:

User credential:
Password:
username:

## Toolkit
### Live Communication:
The live communication will be handled by [GUNjs](https://gun.eco/)

### Backend:
Express for the backend  

### Frontend:
Vue3 as a fronend framework

### Database:
MongoDB for stroign user data and group data
GUNjs for the messages

### Authentication:


## Convention and choices made:
Variables:```PascalCase```
Function: ```PascalCase```

All Functions in their seperate file, imported in the app.js file.  
Automatic tests:   



## How to run the project:
In the /backend folder run ```node app.js```


# file structure:

Livechat/  
├── README.md  
├── package.json  
├── package-lock.json  
├── webpack.config.js  
├── .gitignore  
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
│   └── app.js  
