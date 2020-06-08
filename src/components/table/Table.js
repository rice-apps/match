import React, { useState } from 'react';
import { Html5Table } from 'window-table';
import './Table.css'

export default function ShinobiTable(props) {

    const [selectedRow, setSelectedRow] = useState();

    const CustomRow = ({index, row, ...rest}) => {
        return (
            <tr
            onClick={() => props.onSelectRow(row)}
            onMouseEnter={console.log("enter")}
            onMouseLeave={console.log("leave")}
            style={{backgroundColor: 'white'}}
            {...rest}
            />
        );
    };

  return (
    <Html5Table
    Row={CustomRow}
    data={props.data}
    columns={props.columns}
    />
  );
}