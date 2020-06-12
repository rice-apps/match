export function applyRules(rules, data, leftRow) {
    let filtered = applyFilters(rules, data, leftRow);
    let filtered_and_sorted = applySorts(rules, filtered, leftRow)
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
  const sortByFlattened = fns => (a,b) => fns.reduce((acc, fn) => acc || fn(a,b), 0);

function applySorts(rules, data, leftRow) {
    let comparators = []
    for (var i = 0; i < 2; i++) {
        let rule = rules[i];
        if (rule.type === "sort") {
            if (rule.operator === "equals") {
                let left = rule.with.type === "column" ? leftRow[rule.with.value] : rule.with.value;
                let newComparator = sortByMapped(e => e[rule.by])(byMatch(left));
                comparators.push(newComparator);
            }
        } else if (rule.type === "filter") {
        }
    }
    let chainedComparators = sortByFlattened(comparators);
    data.sort(chainedComparators);
    return data
}

function applyFilters(rules, data, leftRow) {
    return data;
}