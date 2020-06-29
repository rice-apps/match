import React from 'react';
import { Table } from 'antd';

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

  return (
    <div>
      <Table 
      rowSelection={{
        type: props.selectType,
        ...rowSelection,
      }}
      dataSource={props.data} 
      columns={props.columns}
      bordered 
      size="small" 
      scroll={{ y: 500 }}
      />
    </div>
  );
}