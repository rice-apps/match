import { removeFileItem } from "antd/lib/upload/utils";
import { zipcodesToDistance } from "./zipcode/zipcodeLogic";

const MAX_ZIPCODE_DISTANCE = 30.0; // in miles

/* This is the main entrypoint for applying rules.
All other functions/declarations in this file are helpers
for this 'apply' function. */
export function applyRules(
  rules, data, leftRow, leftEmailColumn, rightMatchColumn) {
  // First copy the data b/c its read only
  let copiedData = data.slice();

  // Filter out the disabled rules
  let enabledRules = rules.filter((rule) => rule.enabled === true);

  // Get a list of the 'sort' rules
  let sorts = enabledRules.filter((rule) => rule.type === "sort");
  // Get a list of the 'filter' rules
  let filters = enabledRules.filter((rule) => rule.type === "filter");

  //DEFAULT SORTS
  // Sort matched left rows to the top
  if (rightMatchColumn && leftEmailColumn) { // Handle nulls
    sorts.push({
      type: "sort",
      enabled: true,
      by: rightMatchColumn.key,
      operator: "contains",
      with: {
        type: "column",
        value: leftEmailColumn.key,
      },
    });
  }
  //Sort unmatched people up (to sort matched people to bottom)
  if (rightMatchColumn && leftEmailColumn) { // Handle nulls
    sorts.push({
      type: "sort",
      enabled: true,
      by: rightMatchColumn.key,
      operator: "equals",
      with: {
        type: "constant",
        value: undefined,
      },
    });
  }

  // Filter the data
  let filtered = applyFilters(filters, copiedData, leftRow);
  // Sort the data
  let filtered_and_sorted = applySorts(sorts, filtered, leftRow);
  return filtered_and_sorted;
}

function commaSeparatedToList(str) {
  /* Inputs: a string of comma seperated values
     Output: an array of strings
  */
  if (typeof str == "string") return str.split(", ");
  return [];
}

function countOverlaps(listA, listB) {
  /*  Inputs: two lists of elements
      Outputs: (intger) number of elements shared in common between A and B
  */
  return listA
    .map((val) => listB.includes(val)) // Check if each value in B is in A
    .reduce((a, b) => a + b); // Sum up the overlapping elements
}

// There's definitely a much better way to define these comparitors,
// I am just too lazy to write it rn. Ping Johnny if this is too hard to work with.
// // See https://css-tricks.com/level-up-your-sort-game/ for explanation on how sorting is done

const byOverlaps = (value) => (a, b) => {
  //TODO: Adam Zawierucha implement
  //Handle Nulls
  if (!a && !b) {
    return 0;
  } else if (!a) {
    return 1;
  } else if (!b) {
    return -1;
  }

  //Create lists from strings
  const leftList = commaSeparatedToList(value);
  const aList = commaSeparatedToList(a);
  const bList = commaSeparatedToList(b);

  //Count overlaps
  const aCount = countOverlaps(leftList, aList);
  const bCount = countOverlaps(leftList, bList);

  //Compare overlap counts
  if (aCount > bCount) {
    return -1;
  } else if (aCount < bCount) {
    return 1;
  } else {
    return 0;
  }
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
  if (a === value && b === value) {
    return 0;
  } else if (a === value) {
    return -1;
  } else if (b === value) {
    return 1;
  } else {
    return 0;
  }
};

const byContains = (value) => (a, b) => {
  // Handle nulls.
  if (!a) a = "";
  if (!b) b = "";

  if (a.includes(value) && b.includes(value)) {
    return 0;
  } else if (a.includes(value)) {
    return -1;
  } else if (b.includes(value)) {
    return 1;
  } else {
    return 0;
  }
};
const byGEQ = (value) => (a, b) => {
  if (a >= value && b >= value) {
    return 0;
  } else if (a >= value) {
    return -1;
  } else if (b >= value) {
    return 1;
  } else {
    return 0;
  }
};
const byLEQ = (value) => (a, b) => {
  if (a <= value && b <= value) {
    return 0;
  } else if (a <= value) {
    return -1;
  } else if (b <= value) {
    return 1;
  } else {
    return 0;
  }
};

const byDistance = (value) => (a, b) => {
  let dist2a = zipcodesToDistance(value, a);
  let dist2b = zipcodesToDistance(value, b);
  if (dist2a === dist2b) {
    return 0;
  }
  if (dist2a === null) {
    return 1;
  }
  if (dist2b === null) {
    return -1;
  }
  if (dist2a < dist2b) {
    return -1;
  }
  return 1;
};

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

    // If we are filtering by column, and the left row is not selected, don't sort
    if (rule.with.type === "column" && !leftRow) {
      return data;
    }
    console.log("rule", rule);
    console.log("rule.by", rule.by);
    let left =
      rule.with.type === "column" ? leftRow[rule.with.value] : rule.with.value;
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
        return zipcodesToDistance(left, a[rule.by]) <= MAX_ZIPCODE_DISTANCE;
      });
    }
  }

  return data;
}
