function zipToCoordinates(zipcode) {
    /**
     * Takes in a Zipcode (int) and returns a coordinate {Longitude:(float), Lattitude(float)}
     * by reading from a JSON file
     * 
     * Input: (int) zipcode
     * Output: {Longitude:(float),Lattitude:(float)}
     */
    return {Longitude:0, Lattitude:0};
}

function coordinatesToDistance(coordinates){
    /**
     * Takes in a coordinate pair and returns the distance.
     * Search up stack overflow or somethin' on how to do this.
     * 
     * Input: coordinates: {Longitude{float},Lattitude(float)}
     * Output: distance (float) in miles
     */
    return 0.0;
}

function zipcodeToDistance(zipcode){
    /**
     * Takes in a zipcode and returns the distance in miles from
     * those two zipcodes.
     * 
     * Input: zipcode (int)
     * Output: distance (float) in miles
     */
    return coordinatesToDistance(zipToCoordinates(zipcode));
}