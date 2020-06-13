import React, { useState, useEffect } from 'react';
import Loader from '../../components/loader/Loader';
import Table from '../table/Table';
import { applyRules } from '../util/rules';
import { Card } from "antd";

export default function DataPanel(props) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const [selectedRow, setSelectedRow] = useState();
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    if (props.selectedLeftRow && props.rules && data) {
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
      return {
        key: key, 
        width: 100, 
        dataIndex: key,
        title: column
      };
    });
    // Excluding column header row, map all rows into formatted object
    var formattedData = data.slice(1).map(
      (row, i) => {
        var rowObject = {key: i}
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

  function onSelectRow(row) {
    setSelectedRow(row);
    // If row select callback is passed down, pass upwards the row
    if (props.onSelectRow) {
      props.onSelectRow(row);
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
          />
      {selectedRow && <Card style={{ width: 300 }}>
          {Object.entries(selectedRow).map((attribute, i) => {
            let [key, value] = attribute;
            return (<p key={key}>{key} : {value}</p>)
          })}
        </Card>}
      </div>
    )
}