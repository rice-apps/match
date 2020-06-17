import React, { useState, useEffect } from 'react';
import Loader from '../../components/loader/Loader';
import Table from '../table/Table';
import { applyRules } from '../util/rules';
import { Card } from "antd";

export default function DataPanel(props) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [sortedData, setSortedData] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    if (props.rules && data) {
      let sorted = applyRules(props.rules, data, props.selectedLeftRow);
      setSortedData([...sorted]);
    } else {
      setSortedData(data);
    }
  }, [props.selectedLeftRow, props.rules, data]);

  function onFileUpload(data) {
    // Column objects come from first array in data
    // Key is column name in lower case, where spaces replaced by underscore
    const columnObjects = data[0].map(column => {
      let key = column.toLowerCase().replace(/ /g,"_");

      // NOTE!! If the column name is "children", antd breaks. 
      // Due to how they render child components lmao
      if (key === "children") {
        key = "children_"
      }

      // IF this is the right side and there are rules, don't allow manual sort
      if (props.rules) {
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
      }
    );
    // Set the state with new data/columns
    setData(formattedData);
    setColumns(columnObjects);
    // If file upload callback is passed down, pass upwards the data 
    if (props.onFileUpload) {
      props.onFileUpload(columnObjects);
    }
  }

  function onSelectRow(rows) {
    setSelectedRows(rows);
    // If row select callback is passed down, pass upwards the row
    if (props.onSelectRow) {
      props.onSelectRow(rows[0]);
    }
  }

  return (
      <div className="DataPanel">
        <Loader onUpload={onFileUpload}/>
        <br/>
        <Table 
          onSelectRow={onSelectRow}
          data={sortedData}
          columns={columns}
          selectType={props.rules ? "checkbox" : "radio"}
          />

          <div className="SelectionDisplay">
            {selectedRows.map((row, i) => 
              <Card key={i} style={{ width: 300 }}>
                {Object.entries(row).map((attribute, i) => {
                  let [key, value] = attribute;
                  return (<p key={key}>{key} : {value}</p>)
                })}
              </Card>)}
          </div>
      </div>
    )
}