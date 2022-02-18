//will require and run our main fetch function.

// index.js
const { fetchMyIP, fetchCoordByIP } = require('./iss');
const { myIP } = require("./constants");

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }

//   console.log('It worked! Returned IP:' , ip);
// });



fetchCoordByIP(myIP, (error, data) => {
  if (error) {
    console.log("Something went wrong!", error);
    process.exit();
  }
  console.log("Found it!  Here are your coordinates: ", data);
  //Didn't like data inside a template literal for some reason
});