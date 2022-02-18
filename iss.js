const request = require("request");
const { geoAPI } = require("./constants");

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
};

module.exports = { fetchMyIP, fetchCoordByIP, fetchISSFlyOverTimes };