import React from 'react';
import { Html5Table } from 'window-table';
import './Table.css'


export default function ShinobiTable(props) {

    console.log(props);

    const CustomRow = ({index, row, ...rest}) => {
        return (
            <tr
            // Here we call the stored state handler
            onClick={() => props.onSelectRow(row)}
            
            // It's important that we pass all the remaining props here
            {...rest}
            />
        );
    };

  return (
    <Html5Table
    // Here we pass our customized Row component
    Row={CustomRow}
    // data and columns come from an internal helper
    // More props can be passed for styling and customizing
    data={props.data}
    columns={props.columns}
    />
  );
}