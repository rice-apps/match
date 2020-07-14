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

  if (props.columns.length === 0) {
    return <> </>;
  }

  function rowClassNameGetter(row, index) {
    if (index % 2 == 1) {
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