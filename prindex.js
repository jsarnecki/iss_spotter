const { nextISSTimesForMyLocation } = require("./iss_promised");

nextISSTimesForMyLocation()
  .then((passTimes) => {
    console.log("Here are your next ISS fly-over times!");
    console.log("--------------------------------------");
    for (const time of passTimes) {
      const datetime = new Date(0);
      datetime.setUTCSeconds(time.risetime);
      const duration = time.duration;
      console.log(`${datetime} for ${duration} seconds!`);
    }
  })
  .catch((error) => {
    console.log("Something went wrong: ", error.message);
  });