import React from 'react';
import Loader from '../../components/loader/Loader';
import Table from '../table/Table';
import { FormattedCard } from "../formatted-card/FormattedCard.js";

import { useRecoilState } from 'recoil';
import { leftDataState } from '../../store/atoms';


export default function LeftDataPanel(props) {
  const [{ data, columns, selectedRows, matchColumn, nameColumn }, setLeftData] = useRecoilState(leftDataState);

  function onSelectRow(rows) {
    setLeftData(data => {
      return {
        ...data,
        selectedRows: rows
      }
    })
  }

  // This determines the CSS class of all rows in this left table
  function leftRowClassNameGetter(row, index) {

    // Right now just if it is not empty string or not empty list, consider it matached
    const matched = row[matchColumn.key] && row[matchColumn.key] !== "[]";
    
    if (selectedRows.includes(row) && matched) {
      return "selected-matched-row-left"
    }
    
    if (matched) {
      return "matched-row"
    }
    
    return "unmatched-row"
  }

  return (
    <div className="DataPanel">

      {/* Loader to accept csv input */}
      {data.length === 0 && <Loader
        onUpload={setLeftData}
        allowManualSort={true}
      />}
      <br />


      {/* The actual table for this panel. Note that it's "radio" selection type.
        This means you can select only one row from this table. */}
      <Table
        rowClassNameGetter={leftRowClassNameGetter}
        onSelectRow={onSelectRow}
        data={data}
        columns={columns}
        selectType={"radio"}
        matchColumn={matchColumn}
      />

      {/* This just renders in the selected rows */}
      <div className="SelectionDisplay">
        {selectedRows.map((row, i) => {
          let name = row[nameColumn.key];
          return (<FormattedCard
            title={name}
            key={i}
            style={{ width: "100%" }}
            row={row}
          >
          </FormattedCard>)
        })}
      </div>

    </div>
  )
}
