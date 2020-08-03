import { removeFileItem } from "antd/lib/upload/utils";

/* This is the main entrypoint for applying rules.
All other functions/declarations in this file are helpers
for this 'apply' function. */
export function applyRules(rules, data, leftRow) {
  // First copy the data b/c its read only
  let copiedData = data.slice();

  // Filter out the disabled rules
  let enabledRules = rules.filter(rule => rule.enabled === true);

  // Get a list of the 'sort' rules
  let sorts = enabledRules.filter(rule => rule.type === "sort");
  // Get a list of the 'filter' rules
  let filters = enabledRules.filter(rule => rule.type === "filter");

  // Filter the data
  let filtered = applyFilters(filters, copiedData, leftRow);
  // Sort the data
  let filtered_and_sorted = applySorts(sorts, filtered, leftRow)
  return filtered_and_sorted
}

function comaSeperatedToList(str) {
  /* Inputs: str
     Output: an array
     TODO: Ryan Knightly implement
  */
  return null
}

function countOverlaps (listA,listB) {
  /*  Inputs: two lists
      Outputs: (intger) number of elements B has in A. (A is HCW, B is student)
      TODO: Ryan Knightly implement
  */
  return null
}

// There's definitely a much better way to define these comparitors,
// I am just too lazy to write it rn. Ping Johnny if this is too hard to work with.

const byOverlaps = (value) => (a,b) => {
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
  const leftList = comaSeperatedToList(value);
  const aList = comaSeperatedToList(a);
  const bList = comaSeperatedToList(b);

  //Count overlaps
  const aCount = countOverlaps(leftList,aList);
  const bCount = countOverlaps(leftList,bList);

  //Compare overlap counts
  if (aCount > bCount) {
    return -1
  } else if (aCount < bCount ) {
    return 1
  } else {
    return 0
  }
}

const sortByMapped = map => compareFn => (a, b) => compareFn(map(a), map(b));

const byMatch = (value) => (a, b) => {
  if (a === value && b === value) {
    return 0
  } else if (a === value) {
    return -1;
  } else if (b === value) {
    return 1;
  } else {
    return 0;
  }
};
const byContains = (value) => (a, b) => {

  // Handle nulls. There should be much cleaner way to handle this, too lazy rn.
  if (!a && !b) {
    return 0;
  } else if (!a) {
    return 1;
  } else if (!b) {
    return -1;
  }

  if (a.includes(value) && b.includes(value)) {
    return 0
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
    return 0
  } else if (a >= value) {
    return -1;
  } else if (b >= value) {
    return 1;
  } else {
    return 0;
  }
}
const byLEQ = (value) => (a, b) => {
  if (a <= value && b <= value) {
    return 0
  } else if (a <= value) {
    return -1;
  } else if (b <= value) {
    return 1;
  } else {
    return 0;
  }
}

const sortByFlattened = fns => (a, b) => fns.reduce((acc, fn) => acc || fn(a, b), 0);

function isNumeric(num) {
  return !isNaN(num)
}

function convertIfNumeric(s) {
  return isNumeric(s) ? parseInt(s) : s;
}

export const availableOperators = [
  { value: "equals", display: "=" },
  { value: "geq", display: "≥" },
  { value: "leq", display: "≤" },
  { value: "contains", display: "contains" },
  { value: "overlap", display: "overlap" },
];

function applySorts(rules, data, leftRow) {
  let comparators = [];
  for (var i = 0; i < rules.length; i++) {
    let rule = rules[i];

    // If we are filtering by column, and the left row is not selected, don't sort
    if (rule.with.type === "column" && !leftRow) {
      return data;
    }

    let left = rule.with.type === "column" ? leftRow[rule.with.value] : rule.with.value;
    if (rule.operator === "equals") {
      let newComparator = sortByMapped(e => e[rule.by])(byMatch(left));
      comparators.push(newComparator);
    } else if (rule.operator === "contains") {
      let newComparator = sortByMapped(e => e[rule.by])(byContains(left));
      comparators.push(newComparator);
    } else if (rule.operator === "geq") {
      let newComparator = sortByMapped(e => e[rule.by])(byGEQ(left));
      comparators.push(newComparator);
    } else if (rule.operator === "leq") {
      let newComparator = sortByMapped(e => e[rule.by])(byLEQ(left));
      comparators.push(newComparator);
    } else if (rule.operator === "overlap") {
      let newComparator = sortByMapped(e => e[rule.by])(byOverlaps(left));
      comparators.push(newComparator);
    }
  }
  let chainedComparators = sortByFlattened(comparators);
  data.sort(chainedComparators);
  return data
}

function applyFilters(rules, data, leftRow) {
  for (var i = 0; i < rules.length; i++) {
    let rule = rules[i];

    // If we are filtering by column, and the left row is not selected, don't filter
    if (rule.with.type === "column" && !leftRow) {
      return data;
    }

    let left = rule.with.type === "column" ? leftRow[rule.with.value] : rule.with.value;

    if (rule.operator === "equals") {
      data = data.filter((a) => a[rule.by] === left);
    } else if (rule.operator === "contains") {
      data = data.filter((a) => a[rule.by].includes(left));
    } else if (rule.operator === "geq") {
      data = data.filter((a) => {
        return convertIfNumeric(a[rule.by]) >= convertIfNumeric(left)
      });
    } else if (rule.operator === "leq") {
      data = data.filter((a) => {
        return convertIfNumeric(a[rule.by]) <= convertIfNumeric(left)
      });
    } else if (rule.operator == "overlap") {
      data = data.filter((a) => {
        const leftList = comaSeperatedToList(left);
        const aList  = comaSeperatedToList(a);
        return countOverlaps(leftList,aList) > 0;
      });
    }
  }

  return data;
}