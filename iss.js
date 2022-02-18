const request = require("request");

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
      process.exit();
    }

    const myIP = JSON.parse(body);

    if (myIP === undefined) {
      return callback("No IP here...", null);
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status code: ${response.statusCode} when fetching IP.  Response: ${body}`), null);
      process.exit();
    }

    return callback(null, myIP);
  });
};

module.exports = { fetchMyIP };