import React from 'react';
import { Table } from 'antd';
import './Table.css'

export default function MyTable(props) {

  // This handles actions that should occur when rows of the table are selected.
  // DOCUMENTATION: https://ant.design/components/table/#rowSelection
  const rowSelection = {
    fixed: true,
    onChange: (selectedRowKeys, selectedRows) => {
      props.onSelectRow(selectedRows);
    },
    getCheckboxProps: record => ({
      // Eventually, we can disable/enable certain rows.
      // Think: If someone reports as COVID symptoms, we can mark a column as "COVID symptomatic",
      // and disable their row selection (cannot match them to a hcw anymore).
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

  // If no columns, do not render the table. It looks weird.
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
      rowClassName={props.rowClassNameGetter}
      dataSource={props.data}
      columns={props.columns.filter(column => column.hidden ? false : true)}
      bordered
      size="small"
      scroll={{ y: 500 }}
      />
    </div>
  );
}
