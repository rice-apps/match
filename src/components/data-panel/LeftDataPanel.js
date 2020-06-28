import React from 'react';
import Loader from '../../components/loader/Loader';
import Table from '../table/Table';
import { Card } from "antd";

import { useRecoilState } from 'recoil';
import { leftDataState } from '../../store/atoms';


export default function LeftDataPanel(props) {
  const [{data, columns, selectedRows}, setLeftData] = useRecoilState(leftDataState);

  function onSelectRow(rows) {
      setLeftData(data => {
          return {
              ...data,
              selectedRows: rows
          }
      })
  }

  return (
    <div className="DataPanel">

        {/* Loader to accept csv input */}
        <Loader 
        onUpload={setLeftData}
        allowManualSort={true}
        />
        <br/>


        {/* The actual table for this panel. Note that it's "radio" selection type.
        This means you can select only one row from this table. */}
        <Table 
          onSelectRow={onSelectRow}
          data={data}
          columns={columns}
          selectType={"radio"}
          />

            {/* This just renders in the selected rows */}
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