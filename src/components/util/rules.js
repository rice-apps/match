export function applyRules(rules, data, leftRow) {
  let enabledRules = rules.filter(rule => rule.enabled === true);

  let sorts = enabledRules.filter(rule => rule.type === "sort");
  let filters = enabledRules.filter(rule => rule.type === "filter");

  let filtered = applyFilters(filters, data, leftRow);
  let filtered_and_sorted = applySorts(sorts, filtered, leftRow)
  return filtered_and_sorted
}

const sortByMapped = map => compareFn => (a,b) => compareFn(map(a),map(b));
const byMatch = (value) => (a,b) => {
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
const byContains = (value) => (a,b) => {
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

const sortByFlattened = fns => (a,b) => fns.reduce((acc, fn) => acc || fn(a,b), 0);

export const availableOperators = [
  {value: "equals", display: "="}, 
  {value: "geq", display: "≥"}, 
  {value: "leq", display: "≤"}, 
  {value: "contains", display: "contains"}]

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
      data = data.filter((a) => a[rule.by] >= left);
    } else if (rule.operator === "leq") {
      data = data.filter((a) => a[rule.by] <= left);
    }
}
  return data;
}