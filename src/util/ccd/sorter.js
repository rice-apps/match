import {Externship, Student, MockStudents, MockExternships} from "./objects"

export function sortExternships(externships) {

    /*
        Input: list of Externship objects
        Output: sorted list of Externship objects by ascending order of "hotness"
        Hotness: define hotness to be the demand of the externship, difference between # of applicants and # of slots
    */

    var priority_array = []
    var sorted_externships = [];
    var priority_list = {};

    // mapping Externship --> hotness
    for (var i = 0; i < externships.length; i++) {
        priority_list[externships[i]] = externships[i].getPriority();
    }

    // sort externships by ascending hotness value
    function sort_priority(priority_list) {

        // converts mapping to array i.e [Externship: priority]
        priority_array = Object.entries(priority_list);
        sorted_externships = priority_array.sort((a,b) => a[1]-b[1]);
    }

    // returns the keys, Externship objects, in ascending order of hotness
    sorted_externships = Object.keys(sorted_externships)
    return sorted_externships;
}
