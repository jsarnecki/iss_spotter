const request = require("request");
const { geoAPI } = require("./constants");

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request("https://api.ipify.org/?format=json", (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    const myIP = JSON.parse(body);

    if (myIP === undefined) {
      callback("No IP here...", null);
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status code: ${response.statusCode} when fetching IP.  Response: ${body}`), null);
      return;
    }

    return callback(null, myIP);
  });
};//End of fetchIP

/**
 * Makes a single API request to retrieve the lat/lng for a given IPv4 address.
 * Input:
 *   - The ip (ipv4) address (string)
 *   - A callback (to pass back an error or the lat/lng object)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The lat and lng as an object (null if error). Example:
 *     { latitude: '49.27670', longitude: '-123.13000' }
 */

const fetchCoordByIP = function(IP, callback) {
  request(geoAPI, (error, response, body) => {

    if (error) {
      callback(Error("Woops, something went wrong", null));
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`URL is not valid, returned status code: ${response.statusCode}`), null);
      return;
    }

    const dataMore = JSON.parse(body);
    const data = {latitude: dataMore.latitude, longitude: dataMore.longitude};
    return callback(null, data);
  });
};//End of fetchCoordinates

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    
    if (error) {
      callback(Error("There was an error!"), null);
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`One of your coordinates appears invalid, returned status code: ${response.statusCode}`), null);
      return;
    }

    const data = JSON.parse(body);
    return callback(null, data);
  });
};//End fetchFlyTimes

//--------------------------Let's put 'em together--------------------------//

const nextISSTimesForMyLocation = function(callback) {

  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work!" , error);
      return;
    }
    //console.log('It worked! Returned IP:' , ip);
    const myIP = ip;
    //Now have IP

    fetchCoordByIP(myIP, (error, data) => {
      if (error) {
        console.log("Something went wrong!", error);
        process.exit();
      }
      //console.log("Found it!  Here are your coordinates: ", data);
      //Data === coordinates - Now have coordinates
    
      fetchISSFlyOverTimes(data, (error, data) => {
        if (error) {
          console.log("Hmmm.. seems to be an issue here", error);
          return;
        }
        return callback(null, data.response);
      });
    });
  });
};

module.exports = { fetchMyIP, fetchCoordByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };