/**
 * https://github.com/kevinroberts/city-timezones
 */

const cityMapping = require("./cityMap.json");

function lookupViaCity(city) {
  const cityLookup = cityMapping.filter(o => {
    return o.city.toUpperCase() === city.toUpperCase();
  });
  if (cityLookup && cityLookup.length > 0) {
    return cityLookup;
  } else {
    return [];
  }
}

module.exports = {
  lookupViaCity
};
