import React, { useState } from 'react';
import { Html5Table } from 'window-table';
import './Table.css'

export default function Table(props) {
  const [selectedRowIndex, setSelectedRowIndex] = useState();

  const CustomRow = ({index, row, ...rest}) => {
      return (
          <tr
          onClick={() => {
            if (selectedRowIndex === index) {
              setSelectedRowIndex(null);
              props.onSelectRow(null);
            } else {
              setSelectedRowIndex(index);
              props.onSelectRow(row);
            }
          }}
          {...rest}
          />
      );
  };

  console.log("Rendering table", props);

  return (
    <Html5Table
    Row={CustomRow}
    data={props.data}
    columns={props.columns}
    style={{height: "60vh"}}
    rowClassName={index => index === selectedRowIndex ? "table-row-selected" : "table-row-even"}
    />
  );
}