const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    console.log("Something didn't work!", error);
    return;
  }

  console.log("Here are your next ISS fly-over times!");
  console.log("--------------------------------------");

  for (const time of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(time.risetime);
    const duration = time.duration;
    console.log(`${datetime} for ${duration} seconds!`);
  }
});
