const MAX_COLUMN_TITLE_LENGTH = 30;

export function formatData(data, allowManualSort) {
    // Column objects come from first array in data
    // Key is column name in lower case, where spaces replaced by underscore
    const columnObjects = data[0].map((column, columnIndex) => {
        let key = column.toLowerCase().replace(/ /g, "_");

        // NOTE: If the column name is "children", antd breaks.
        // They reserve this keyword, so avoid this at all costs.
        // Due to how they render child components lmao.
        if (key === "children") {
            key = "children_"
        }

        let columnTitle = column.length > MAX_COLUMN_TITLE_LENGTH ? column.slice(0, MAX_COLUMN_TITLE_LENGTH) + "..." : column

        // If this is the right side and there are rules, don't allow manual sort
        if (!allowManualSort) {
            return {
                index: columnIndex,
                fixed: false,
                key: key,
                width: 150,
                dataIndex: key,
                title: columnTitle,
                fullTitle: column,
                ellipsis: true,
            };
        } else {
            return {
                index: columnIndex,
                fixed: false,
                key: key,
                width: 150,
                dataIndex: key,
                title: columnTitle,
                fullTitle: column,
                ellipsis: true,
                sorter: (a, b) => a[key] > b[key],
                sortDirections: ['descend', 'ascend'],
            };
        }
    });

    // Excluding column header row, map all rows into formatted object
    var formattedData = data.slice(1).map(
        (row, i) => {
            var rowObject = { key: i.toString() }
            row.map(
                (columnValue, ii) => {
                    var columnName = columnObjects[ii].key;
                    rowObject[columnName] = columnValue;
                    return null;
                }
            )
            return rowObject;
        });


    return { data: formattedData, columns: columnObjects };
}