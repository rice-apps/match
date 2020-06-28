import React, { useState, useEffect } from 'react';
import Loader from '../loader/Loader';
import Table from '../table/Table';
import { applyRules } from '../../util/rules';
import { Card } from "antd";
import { useRecoilState } from 'recoil';
import { rightDataState } from '../../store/atoms';
import { formatData } from '../../util/dataFormatter';

export default function RightDataPanel(props) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [sortedData, setSortedData] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);

  const [rightData, setRightData] = useRecoilState(rightDataState);

  useEffect(() => {
    if (props.rules && data) {
      let sorted = applyRules(props.rules, data, props.selectedLeftRow);
      setSortedData([...sorted]);
    } else {
      setSortedData(data);
    }
  }, [props.selectedLeftRow, props.rules, data]);

  useEffect(() => {
    console.log("recoil changed", rightData);
    if (rightData.length > 0) {
      onFileUpload(rightData);
    }
  }, [rightData]);

  function onFileUpload(data) {
    // Format the data, the false means do not allow manual sort
    var {formattedData, columnObjects} = formatData(data, false);
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
        <Loader 
        onUpload={setRightData}
        allowManualSort={false}
        />
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