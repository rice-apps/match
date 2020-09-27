/**
 * Data structure:
 * data.json {zipcode (integer) : [longitude (float), lattitude (float)]}
 */
const data = require("./data.json");

/**
 * Takes in a zipcode and returns the distance in miles from
 * those two zipcodes. 
 * 
 * @param zipcode1, a string
 * @param zipcode1, a string
 * @return distance in miles (float)
 */
export function zipcodesToDistance(zipcode1,zipcode2){
    return coordinatesToDistance(data[zipcode1], data[zipcode2]);
}

/**
 * Takes in a coordinate pair and returns the distance.
 * Search up stack overflow or somethin' on how to do this.
 * Implementation taken from: 
 * https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
 * 
 * @param coordinates, an array[Longitude{float},Lattitude(float)]
 * @return distance (float) in miles
 */
function coordinatesToDistance(coordinate1,coordinate2){
    // TODO: Implement
    let lat1, lon1;
    [lon1, lat1] = coordinate1;
    let lat2, lon2; 
    [lon2, lat2] = coordinate2;
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2-lat1);  // deg2rad below
    let dLon = deg2rad(lon2-lon1); 
    let a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = R * c * 0.621371; // Distance in miles
    return d;
}

/**
 * Convert degree to radius.
 * 
 * @param deg, degree
 * @return radius
 */
function deg2rad(deg) {
    return deg * (Math.PI/180)
}
