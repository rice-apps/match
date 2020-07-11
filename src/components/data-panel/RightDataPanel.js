import React from 'react';
import Loader from '../../components/loader/Loader';
import Table from '../table/Table';
import { Card } from "antd";
import { applyRules } from '../../util/rules';

import { useRecoilState, useRecoilValue } from 'recoil';
import { rightDataState, leftDataState, rulesState } from '../../store/atoms';


export default function RightDataPanel() {
  const [{data, columns, selectedRows}, setRightData] = useRecoilState(rightDataState);
  const {selectedRows: selectedLeftRows} = useRecoilValue(leftDataState);
  const rules = useRecoilValue(rulesState);

  function onSelectRow(rows) {
      setRightData(data => {
          return {
              ...data,
              selectedRows: rows
          }
      })
  }

  // Here's where the sorting/filtering happens!!
  // Note selectedLeftRows[0]. Should only ever have one in the list anyways 
  // as the left panel is "radio" select type.
  const sortedData = applyRules(rules, data, selectedLeftRows[0]);

  return (
    <div className="DataPanel">

        {/* Loader to accept csv input */}
        {data.length === 0 && <Loader 
        onUpload={setRightData}
        allowManualSort={true}
        />}
        <br/>


        {/* The actual table for this panel. Note that it's "checkbox" selection type.
          This means you can select multiple rows from this table. */}
        <Table 
          onSelectRow={onSelectRow}
          data={sortedData}
          columns={columns}
          selectType={"checkbox"}
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