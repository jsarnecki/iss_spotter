const { apiKey } = require("./constants");
const request = require("request-promise-native");
/*
 * Requests user's ip address from https://www.ipify.org/
 * Input: None
 * Returns: Promise of request for ip data, returned as JSON string
 */

const fetchMyIP = function() {
  return request("https://api.ipify.org/?format=json");
};

const fetchCoordsByIP = function(body) {
  const IP = JSON.parse(body).ip;
  return request(`https://api.freegeoip.app/json/${IP}?apikey=${apiKey}`);
};

const fetchISSFlyOverTimes = function(body) {
  const data = JSON.parse(body);
  return request(`https://iss-pass.herokuapp.com/json/?lat=${data.latitude}&lon=${data.longitude}`);
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP) //Parses body inside function
    .then(fetchISSFlyOverTimes)
    .then(body => {
      const { response } = JSON.parse(body);
      return response;
    });
};

module.exports = { nextISSTimesForMyLocation };
