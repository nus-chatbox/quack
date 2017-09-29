# Quack

## Enabling a highly localised geolocation-based community through chat @ [https://quack.press](https://quack.press)

### Developers
---
#### Ng Si Kai (A0124828B)


#### Lau Shi Jie (A0111614X)
User interface and experince design

#### Curtis Tan (A0129529W)
Front end styling, Login service logic, Server-side API, Server configuration

#### Daphne Won (A0126172M)
Design, Front-end styling, Integrate sharing feature, Documentation

### Contact Us
---
Do get in touch with us if you have suggestions @ [merwinwee@gmail.com](merwinwee@gmail.com)

### Frontend Setup
---

#### Requirements
- NodeJS 8.x and above

#### Instructions
1. Pull the complete repository @ [https://github.com/nus-chatbox/quack](https://github.com/nus-chatbox/quack)
2. Run `npm install`
3. Run the local development server with `npm run dev`

### Backend Setup
---

#### Requirements
- NodeJS 8.x and above
- MySQL

#### Instructions
1. Pull the complete repository @ [https://github.com/nus-chatbox/quack](https://github.com/nus-chatbox/quack)
2. Set up Environment variables (if required) matching environment variable names in './config/api-server.js'
3. Ensure that you are able to connect to your MySQL database
4. Run `npm install`
5. Install the Knex CLI globally with `npm install -g knex`
6. Install the pm2 package globally with `npm install -g pm2`
7. Migrate the database with `knex migrate:latest` from within the './api-server' directory
8. Run the server in the background with `pm2 start server.js`

### Miscellaneous
---

[Privacy Policy](https://www.quack.press/privacy)

[Terms of Service](https://www.quack.press/terms)
