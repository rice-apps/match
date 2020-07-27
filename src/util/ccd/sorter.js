import {Externship, Student, MockStudents, MockExternships} from "./objects"

export function sortExternships(externships) {

    /*
        Input: list of Externship objects
        Output: sorted list of Externship objects by ascending order of "hotness"
        Hotness: define hotness to be the demand of the externship, difference between # of applicants and # of slots
    */
    return externships.sort((a,b) => a.getPriority()-b.getPriority())
}
