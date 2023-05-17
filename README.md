
# Sneakers Shop
Sneakers-shop is an app I wrote while learning new to me technologies. The application has a separately created server and client with different branch on github.

I connected the server with przelewy24 for payments. The application is deployed on Heroku using dyno-eco. For this reason, it may take a while to get to the site for the first time (server may be in sleep mode).

## Tech Stack

**Client:** React, bootstrap 

**Server:** Node, Express, mongoDB, Jest


## Screenshots

<div style="display: flex;">
<img src="https://raw.githubusercontent.com/blackydev/sneakers-shop/server/readme/1.png" alt="Home" height="175"/>
<img src="https://raw.githubusercontent.com/blackydev/sneakers-shop/server/readme/2.png" alt="Home2" height="175"/>
<img src="https://raw.githubusercontent.com/blackydev/sneakers-shop/server/readme/3.png" alt="Product" height="175"/>
<img src="https://raw.githubusercontent.com/blackydev/sneakers-shop/server/readme/4.png" alt="Order" height="175"/>
</div>

## Running Tests
You need to complete the config "p24" to pass all tests. Otherwise one of tests will not pass.
To run tests, run the following command.

```bash
  cd sneakers-shop
  npm install
  npm run test
```

## Demo
To test the application I recommend visit [the website](https://client-sneakers-app.herokuapp.com) instead of installing it by yourself. Otherwise, you have to correctly configurate the project.
