import React from 'react';
import { Table } from 'antd';
import './Table.css'

export default function MyTable(props) {
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      props.onSelectRow(selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };

  // If no columns, no table
  if (props.columns.length === 0) {
    return <> </>;
  }

  function rowClassNameGetter(row, index) {
    // Right now just if it is not empty string or not empty list, consider it matached
    if (row[props.matchColumn.key] && row[props.matchColumn.key] !== "[]") {
      return "matched-row"
    } else {
      return "unmatched-row"
    }
  }

  return (
    <div>
      <Table 
      rowSelection={{
        type: props.selectType,
        ...rowSelection,
      }}
      rowClassName={rowClassNameGetter}
      dataSource={props.data} 
      columns={props.columns}
      bordered 
      size="small" 
      scroll={{ y: 500 }}
      />
    </div>
  );
}