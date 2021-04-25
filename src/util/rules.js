import { removeFileItem } from "antd/lib/upload/utils";
import {coordinatesToDistance } from "./zipcode/zipcodeLogic"; //CHANGE THIS TO COORDINATE TO DISTANCE

const MAX_ZIPCODE_DISTANCE = 50.0; // in miles

/* This is the main entrypoint for applying rules.
All other functions/declarations in this file are helpers
for this 'apply' function. */
export function applyRules(rules, data, leftRow, leftEmailColumn, leftMatchColumn, rightEmailColumn, isLocallyMatched, isGloballyMatched, isHivesForHeroes) {
  // First copy the data b/c its read only
  let copiedData = data.slice();

  // Filter out the disabled rules
  let enabledRules = rules.filter((rule) => rule.enabled === true);

  // Get a list of the 'sort' rules
  let sorts = enabledRules.filter((rule) => rule.type === "sort");
  // Get a list of the 'filter' rules
  let filters = enabledRules.filter((rule) => rule.type === "filter");

  // Filter the data
  let filtered = applyFilters(filters, copiedData, leftRow);
  // Sort the data
  let filtered_and_sorted = applySorts(sorts, filtered, leftRow);

  // Add distance data to right if used in sort/filter
  filtered_and_sorted = showDistanceData(filtered_and_sorted, sorts, filters, leftRow);

  if (leftRow && leftMatchColumn && leftEmailColumn && rightEmailColumn) {
    filtered_and_sorted.sort((r1, r2) => {
      // Matched to selected person on left: sort up
      if (isLocallyMatched(r1, leftRow) && isLocallyMatched(r2, leftRow)) return 0;
      if (isLocallyMatched(r1, leftRow)) return -1;
      if (isLocallyMatched(r2, leftRow)) return 1;

      // If we're on hivesforheroes, stop here. We don't need to sort matched mentors down
      if (isHivesForHeroes) return 0;

      // Already matched to someone else: sort down
      if (isGloballyMatched(r1) == isGloballyMatched(r2)) return 0;
      if (isGloballyMatched(r1)) return 1;
      if (isGloballyMatched(r2)) return -1;
    });
  }
  return filtered_and_sorted;
}

/**
 * Inputs: a string of comma seperated values
 * Output: an array of strings
 */
function commaSeparatedToList(str) {  
  if (typeof str == "string") 
    return str.split(", ");
  return [];
}

export function parseCoordinate(str) {  
    return commaSeparatedToList(str).map(s => parseFloat(s));
}

/**
 * Inputs: two lists of elements
 * Outputs: (intger) number of elements shared in common between A and B
 */
function countOverlaps(listA, listB) {
  return listA
    .map((val) => listB.includes(val)) // Check if each value in B is in A
    .reduce((a, b) => a + b); // Sum up the overlapping elements
}

// There's definitely a much better way to define these comparitors,
// I am just too lazy to write it rn. Ping Johnny if this is too hard to work with.
// // See https://css-tricks.com/level-up-your-sort-game/ for explanation on how sorting is done

/**
 * Inputs: two lists of elements
 * Outputs: -1, 0, or 1 to indicate if A is before, equal to, or after B
 */
const byOverlaps = (value) => (a, b) => {
  //Handle Nulls
  if (!a && !b)
    return 0;
  if (!a)
    return 1;
  if (!b)
    return -1;

  //Create lists from strings
  const leftList = commaSeparatedToList(value);
  const aList = commaSeparatedToList(a);
  const bList = commaSeparatedToList(b);

  //Count overlaps
  const aCount = countOverlaps(leftList, aList);
  const bCount = countOverlaps(leftList, bList);

  //Compare overlap counts
  if (aCount > bCount)
    return -1;
  if (aCount < bCount)
    return 1;
  return 0;
};

// Sanitize values input by users
const sanitizeInput = (input) => {
  // Check type
  // (typeof val==='string')
  let sanitizedInput = input;
  if (typeof input === "string" || input instanceof String) {
    // Convert to lowercase if string
    sanitizedInput = input.toLowerCase();
  }
  return sanitizedInput;
};

// Sanitize and apply map
const sortByMapped = (map) => (compareFn) => (a, b) => {
  const sanitizedA = sanitizeInput(map(a));
  const sanitizedB = sanitizeInput(map(b));
  return compareFn(sanitizedA, sanitizedB);
};

const byMatch = (value) => (a, b) => {
  if (a === value && b === value)
    return 0;
  if (a === value)
    return -1;
  if (b === value)
    return 1;
  return 0;
};

const byContains = (value) => (a, b) => {
  // Handle nulls.
  if (!a) a = "";
  if (!b) b = "";

  if (a.includes(value) && b.includes(value))
    return 0;
  if (a.includes(value))
    return -1;
  if (b.includes(value)) 
    return 1;
  return 0;
};
const byGEQ = (value) => (a, b) => {
  if (a >= value && b >= value) 
    return 0;
  if (a >= value)
    return -1;
  if (b >= value)
    return 1;
  return 0;
};

const byLEQ = (value) => (a, b) => {
  if (a <= value && b <= value)
    return 0;
  if (a <= value)
    return -1;
  if (b <= value)
    return 1;
  return 0;
};

const byDistance = (value) => (a, b) => {
  //console.log('Comparing', value[0], 'with', a[0], 'and', b[0]); 
  /* Parse coordinates */
  //a b and value are wrapped in an array
  let vCoord = parseCoordinate(value[0]);  
  let aCoord = parseCoordinate(a[0]);
  let bCoord = parseCoordinate(b[0]);

  /* Compute distance */
  let dist2a = coordinatesToDistance(vCoord, aCoord);
  let dist2b = coordinatesToDistance(vCoord, bCoord);

  if (dist2a === dist2b)
    return 0;
  if (dist2a === null)
    return 1;
  if (dist2b === null)
    return -1;
  if (dist2a < dist2b)
    return -1;
  return 1;
}

const sortByFlattened = (fns) => (a, b) =>
  fns.reduce((acc, fn) => acc || fn(a, b), 0);

function isNumeric(num) {
  return !isNaN(num);
}

function convertIfNumeric(s) {
  return isNumeric(s) ? parseInt(s) : s;
}

export const availableOperators = [
  { value: "equals", display: "=" },
  { value: "geq", display: "≥" },
  { value: "leq", display: "≤" },
  { value: "contains", display: "contains" },
  { value: "overlap", display: "intersects" },
  { value: "distance", display: "distance" },
];

function applySorts(rules, data, leftRow) {
  let comparators = [];
  for (var i = 0; i < rules.length; i++) {
    let rule = rules[i];
    console.log(`Rule ${i}: ${rule.operator}`);
    // If we are filtering by column, and the left row is not selected, don't sort
    if (rule.with.type === "column" && !leftRow) {
      return data;
    }
    let left = sanitizeInput(
      rule.with.type === "column" ? leftRow[rule.with.value] : rule.with.value
    );
    if (rule.operator === "equals") {
      let newComparator = sortByMapped((e) => e[rule.by])(byMatch(left));
      comparators.push(newComparator);
    } else if (rule.operator === "contains") {
      let newComparator = sortByMapped((e) => e[rule.by])(byContains(left));
      comparators.push(newComparator);
    } else if (rule.operator === "geq") {
      let newComparator = sortByMapped((e) => e[rule.by])(byGEQ(left));
      comparators.push(newComparator);
    } else if (rule.operator === "leq") {
      let newComparator = sortByMapped((e) => e[rule.by])(byLEQ(left));
      comparators.push(newComparator);
    } else if (rule.operator === "overlap") {
      let newComparator = sortByMapped((e) => e[rule.by])(byOverlaps(left));
      comparators.push(newComparator);
    } else if (rule.operator === "distance") {
      //TODO:
      //sort by distance
      let newComparator = sortByMapped((e) => e[rule.by])(byDistance(left));
      comparators.push(newComparator);
    }
  }
  let chainedComparators = sortByFlattened(comparators);
  data.sort(chainedComparators);
  return data;
}

function applyFilters(rules, data, leftRow) {
  for (var i = 0; i < rules.length; i++) {
    let rule = rules[i];

    // If we are filtering by column, and the left row is not selected, don't filter
    if (rule.with.type === "column" && !leftRow) {
      return data;
    }

    let left =
      rule.with.type === "column" ? leftRow[rule.with.value] : rule.with.value;

    if (rule.operator === "equals") {
      data = data.filter((a) => a[rule.by] === left);
    } else if (rule.operator === "contains") {
      data = data.filter((a) => a[rule.by].includes(left));
    } else if (rule.operator === "geq") {
      data = data.filter((a) => {
        return convertIfNumeric(a[rule.by]) >= convertIfNumeric(left);
      });
    } else if (rule.operator === "leq") {
      data = data.filter((a) => {
        return convertIfNumeric(a[rule.by]) <= convertIfNumeric(left);
      });
    } else if (rule.operator === "overlap") {
      data = data.filter((a) => {
        const leftList = commaSeparatedToList(left);
        const aList = commaSeparatedToList(a[rule.by]);
        return countOverlaps(leftList, aList) > 0;
      });
    } else if (rule.operator === "distance") {
      //filter by distance
      data = data.filter((a) => {
        // let dist = 0;
        let dist = coordinatesToDistance(parseCoordinate(left), parseCoordinate(a[rule.by]));
        // let dist = zipcodesToDistance(left, a[rule.by])
        // Check for null and make sure it is within range
        return (dist) && (dist <= MAX_ZIPCODE_DISTANCE);
      });
    }
  }

  return data;
}

// Add distance data to right if used in sort/filter
function showDistanceData(filtered_and_sorted, sorts, filters, leftRow) {
  // Check for sort/distanc filter
  const zipCodeSortIndex = sorts.findIndex(sort => sort.operator === "distance");
  const zipCodeFilterIndex = filters.findIndex(filter => filter.operator === "distance");

  // No zip code sort or filter: just return the input
  if (zipCodeSortIndex == -1 && zipCodeFilterIndex == -1) {
    return filtered_and_sorted;
  }

  // No selected column
  if (leftRow == null) {
    return filtered_and_sorted;
  }

  const zipCodeRule = zipCodeSortIndex > -1 ? sorts[zipCodeSortIndex] : filters[zipCodeFilterIndex];
 
  const leftCoords = leftRow.coordinate[0];
  return filtered_and_sorted.map(row => {
    const rightCoords = row.coordinate[0];
    let distance = coordinatesToDistance(parseCoordinate(leftCoords), parseCoordinate(rightCoords));
    console.log("Aprox", leftRow, row, " -> ", distance);
    //let zipDistance = zipcodesToDistance(leftZip, row[zipCodeRule.by]);
    if (distance != null) {
      distance = distance.toFixed(2) // round distance
    } else {
      // Zip Code distance couldn't be calculated (invalid zip)
      return {
        ...row,
        __estimated_distance__: "N/A",
      }
    }

    // Add lower bound
    if (distance < 5) {
      distance = "< 5";
    } else if (distance > 150) {
      // Upper bound
      distance = "> 150";
    }

    // Add suffix
    distance = distance + " mi";

    return {
      ...row,
      __estimated_distance__: distance,
    }
  });
}

export function isAnyEnabledDistanceRule(rules) {
  // Check for enabled sort/distance filter
  return rules.findIndex(rule => (rule.operator === "distance" && rule.enabled)) > -1;
}
