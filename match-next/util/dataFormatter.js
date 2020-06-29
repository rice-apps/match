
export function formatDataNew(data, allowManualSort) {
    let row = data[0];

    // Column objects come from first array in data
    // Key is column name in lower case, where spaces replaced by underscore
    const columnObjects = Object.keys(row).map(columnName => {
        let key = columnName.toLowerCase().replace(/ /g,"_");

        // NOTE: If the column name is "children", antd breaks.
        // They reserve this keyword, so avoid this at all costs.
        // Due to how they render child components lmao.
        if (key === "children") {
            key = "children_"
        }

        // If this is the right side and there are rules, don't allow manual sort
        if (!allowManualSort) {
            return {
            // Right now fixing name column
            fixed: (key === "name") ? "left" : false,
            key: key, 
            width: 100, 
            dataIndex: key,
            title: columnName,
            };
        } else {
            return {
            fixed: (key === "name") ? "left" : false,
            key: key, 
            width: 100, 
            dataIndex: key,
            title: columnName,
            sorter: (a, b) => a[key] > b[key],
            sortDirections: ['descend', 'ascend'],
            };
        }
        });

    // Excluding column header row, map all rows into formatted object
    var formattedData = data.map(
    (row, i) => {
        var rowObject = {key: i.toString()}
        Object.values(row).map(
        (columnValue, ii) => {
            var columnName = columnObjects[ii].key;
            rowObject[columnName] = columnValue;
            return null;
        }
        )
        return rowObject;
    });

    
    return {data: formattedData, columns: columnObjects, selectedRows: []};
}

export function formatData(data, allowManualSort) {
    // Column objects come from first array in data
    // Key is column name in lower case, where spaces replaced by underscore
    const columnObjects = data[0].map(column => {
        let key = column.toLowerCase().replace(/ /g,"_");

        // NOTE: If the column name is "children", antd breaks.
        // They reserve this keyword, so avoid this at all costs.
        // Due to how they render child components lmao.
        if (key === "children") {
            key = "children_"
        }

        // If this is the right side and there are rules, don't allow manual sort
        if (!allowManualSort) {
            return {
            // Right now fixing name column
            fixed: (key === "name") ? "left" : false,
            key: key, 
            width: 100, 
            dataIndex: key,
            title: column,
            };
        } else {
            return {
            fixed: (key === "name") ? "left" : false,
            key: key, 
            width: 100, 
            dataIndex: key,
            title: column,
            sorter: (a, b) => a[key] > b[key],
            sortDirections: ['descend', 'ascend'],
            };
        }
        });

    // Excluding column header row, map all rows into formatted object
    var formattedData = data.slice(1).map(
    (row, i) => {
        var rowObject = {key: i.toString()}
        row.map(
        (columnValue, ii) => {
            var columnName = columnObjects[ii].key;
            rowObject[columnName] = columnValue;
            return null;
        }
        )
        return rowObject;
    });

    
    return {data: formattedData, columns: columnObjects, selectedRows: []};
}