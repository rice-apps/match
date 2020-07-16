import React from 'react';
import Loader from '../../components/loader/Loader';
import Table from '../table/Table';
import { FormattedCard } from "../formatted-card/FormattedCard.js";
import { applyRules } from '../../util/rules';

import { useRecoilState, useRecoilValue } from 'recoil';
import { rightDataState, leftDataState, rulesState } from '../../store/atoms';


export default function RightDataPanel(props) {
  const [{ data, columns, selectedRows, matchColumn: rightMatchColumn, nameColumn }, setRightData] = useRecoilState(rightDataState);
  const { selectedRows: selectedLeftRows, matchColumn: leftMatchColumn } = useRecoilValue(leftDataState);

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

  
  // Takes in the left and right rows and determines if they're matched together
  function isMatched(rightRow, leftRow) {
    let rightMatches = rightRow[rightMatchColumn.key]
    // Right should only have one match, so just check first one
    let rightMatch = JSON.parse(rightMatches)[0];

    // Remember, the cell values are list of [index, name]
    if (rightMatch[0] == parseInt(leftRow.key) + 2) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <div className="DataPanel">

      {/* Loader to accept csv input */}
      {data.length === 0 && <Loader
        onUpload={setRightData}
        allowManualSort={false}
      />}
      <br />


      {/* The actual table for this panel. Note that it's "checkbox" selection type.
          This means you can select multiple rows from this table. */}
      <Table
        onSelectRow={onSelectRow}
        data={sortedData}
        columns={columns}
        selectType={"checkbox"}
        matchColumn={rightMatchColumn}
      />

      {/* This just renders in the selected rows */}
      <div className="SelectionDisplay">
        {selectedRows.map((row, i) =>
          {
            let matched = isMatched(row, selectedLeftRows[0]);
            let name = row[nameColumn.key];
            return(<div key={i}>
            <FormattedCard
              title={name}
              extra={<button onClick={() => props.makeMatchOrUnmatch(row)}>{matched ? "Unmatch!" : "Match!"}</button>}
              key={i}
              style={{ width: 300 }}
              row={row}
            >
            </FormattedCard>
          </div>)})}
      </div>

    </div>
  )
}
