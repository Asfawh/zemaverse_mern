#Express
##Node - is an open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside of a web browser. Node. js is a popular, lightweight web framework for beginners, and it is used by many big companies like Netflix and Uber.

##Express. js, or simply Express, is a back end web application framework for building RESTful APIs with Node.js, released as free and open-source software under the MIT License. It is
designed for building web applications and APIs. It has been called the de facto standard server framework for Node.js.
##Note

- Imports must end with js file extension

  #Server Creation

- create project folder
- create folder called server and step in
- create folders config, controllers, models, routes at root level
- •env with PORT = 8004, with mongodb connection string
  ❯ mkdir {Project folder}
  ❯ cd {Project folder}
  ❯ mkdir server && cd server && touch server.js
  ❯ touch .env && echo "PORT = 8004" > .env
  ❯ mkdir controllers routes models config
  ❯ npm init -y
  ❯ npm i express mongoose dotenv cors
  ❯ npm i --save-dev nodemon
  //❯ npm i -D nodemon
- "type": "module" <-. add as last thing in package json
- "dev": "npx nodemon" <... add to scripts in package. json

- Login / Reg and additional server dep
  ❯ npm i bcrypt jsonwebtoken <- a third-party package called jsonwebtoken that use to create and sign these tokens.
  ❯ npm i mongoose-unique-validator validator is-empty

- run server to test
  ❯ npm run dev

* - create person.controller with people list to replicate real controller
* put person list in person.model. js

- Postman
  use Postman to complete alt queries

#Create Your React App
❯ npm create vite@latest client
✔ Select a framework: › React
✔ Select a variant: › JavaScript + SWC

❯ cd client && npm i
❯ npm i react-router-dom bootstrap@5.3.3 axios

- create project folder
  ❯ mkdir components services views

- Client additional dep
  ❯ npm i react-router-bootstrap react-bootstrap

- start with react service, main, app jsx and index for starter config update
