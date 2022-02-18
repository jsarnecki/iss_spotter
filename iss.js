const request = require("request");
const { geoAPI, myIP } = require("./constants");

//will contain most of the logic for fetching the data from each API endpoint.

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
};


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
};

module.exports = { fetchMyIP, fetchCoordByIP };