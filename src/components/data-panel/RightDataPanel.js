import React from 'react';
import Loader from '../loader/SheetsLoader';
import Table from '../table/Table';
import { FormattedCard } from "../formatted-card/FormattedCard.js";
import { applyRules } from '../../util/rules';
import {Button, Tooltip} from "antd";

import { useRecoilState, useRecoilValue } from 'recoil';
import { rightDataState, leftDataState, rulesState } from '../../store/atoms';


export default function RightDataPanel(props) {
  const [{ data, columns, selectedRows: selectedRightRows,
    matchColumn: rightMatchColumn, nameColumn: rightNameColumn}, setRightData] = useRecoilState(rightDataState);
  const { selectedRows: selectedLeftRows, matchColumn: leftMatchColumn, nameColumn: leftNameColumn, emailColumn: leftEmailColumn} = useRecoilValue(leftDataState);

  const matchingEnabled = props.matchingEnabled;

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
  const sortedData = applyRules(rules, data, selectedLeftRows[0], leftNameColumn, rightMatchColumn);


  // Takes in the left and right rows and determines if they're matched together

  function getRightMatch(rightRow){
    let rightMatches = rightRow[rightMatchColumn.key];
    // If right matches is null, just return null.
    if (rightMatches) {
      return JSON.parse(rightMatches)[0];
    } else {
      return null;
    }
  }
  function isLocallyMatched(rightRow, leftRow) {
    // Read Right Match
    let rightMatch = getRightMatch(rightRow);
    let leftEmail = leftRow[leftEmailColumn.key];
    return (rightMatch && leftRow) && (rightMatch == leftEmail)
  }
  function isGloballyMatched(rightRow){
    let rightMatch = getRightMatch(rightRow);
    return rightMatch;
  }
  // This determines the CSS class of all rows in this right table
  function rightRowClassNameGetter(row, index) {

    // If the right row matches the selected left row, it is "selected-matched-row"
    // Be careful to make sure selectedLeftRow AND selectedLeftRow[leftMatchColumn.key] are non-NULL
    // Otherwise, this will explode
    const selectedLeftRow = selectedLeftRows[0];

    if (matchingEnabled) {
      if (selectedLeftRow && selectedLeftRow[leftMatchColumn.key] &&
        selectedLeftRow[leftMatchColumn.key].includes(row[rightNameColumn.key])) {
        return "selected-matched-row-right"
      }

      // Right now just if it is not empty string or not empty list, consider it matached
      if (row[rightMatchColumn.key] && row[rightMatchColumn.key] !== "[]") {
        return "matched-row"
      }
    }

    // Check if selected
    if (selectedRightRows.map(r => r.key).includes(row.key)) {
      return "selected-row"
    }

    // Otherwise, just leave unmatched
    return "unmatched-row"

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
        rowClassNameGetter={rightRowClassNameGetter}
        onSelectRow={onSelectRow}
        data={sortedData}
        columns={columns}
        selectType={"checkbox"}
        matchColumn={rightMatchColumn}
      />

      {/* This just renders in the selected rows */}
      <div className="SelectionDisplay">
        {selectedRightRows.map((row, i) => {
          let name = rightNameColumn ? row[rightNameColumn.key] : "Right Card";
          function generateButton() {
            if (matchingEnabled) {
              if (isLocallyMatched(row, selectedLeftRows[0])) {
                //Unmatch
                return <Button onClick = {() => props.unmatch(row)}danger={true}>{"Unmatch!"}</Button>;
              } else if(isGloballyMatched(row)) {
                //Disabled "Already Matched"
                let leftEmail = getRightMatch(row);
                let tooltip = name+" is already matched to "+leftEmail+"!";
                return <Tooltip color = {'red'} title={tooltip}><Button disabled={true}>{"Match!"}</Button></Tooltip>;
              } else {
                //Match
                return <Button onClick = {() => props.match(row)}>{"Match!"}</Button>;
              }
            }
          }
          return (<div key={i}>
            <FormattedCard
              title={name}
              extra={generateButton()}
              key={i}
              style={{ width: 300 }}
              row={row}
            >
            </FormattedCard>
          </div>)
        })}
      </div>

    </div>
  )
}