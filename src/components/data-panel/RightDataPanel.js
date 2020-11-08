import React from 'react';
import Loader from '../loader/SheetsLoader';
import Table from '../table/Table';
import { FormattedCard } from "../formatted-card/FormattedCard.js";
import { applyRules, isAnyEnabledDistanceRule } from '../../util/rules';
import {Button, Tooltip} from "antd";

import { useRecoilState, useRecoilValue } from 'recoil';
import { rightDataState, leftDataState, rulesState } from '../../store/atoms';
import { useLocation } from 'react-router-dom';


export default function RightDataPanel(props) {
  const [{ data, columns, selectedRows: selectedRightRows, nameColumn: rightNameColumn, emailColumn: rightEmailColumn}, setRightData] = useRecoilState(rightDataState);
  const { data: leftData, selectedRows: selectedLeftRows, matchColumn: leftMatchColumn, nameColumn: leftNameColumn, emailColumn: leftEmailColumn} = useRecoilValue(leftDataState);

  const matchingEnabled = props.matchingEnabled;

  const rules = useRecoilValue(rulesState);

  const route = useLocation().pathname.split("/")[1];

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
  const sortedData = applyRules(rules, data, selectedLeftRows[0], leftEmailColumn);

  /**
   * Finds the email of the person that a right person is matched to (or returns null if none found)
   * @param rightRow the row of the person on the right
   */
  function getRightMatch(rightRow){
    // let rightMatches = rightRow[rightMatchColumn.key];
    let rightMatches = leftData
      .filter(row => {
        console.log("LEFT ROW", row);
        console.log("MATCH COLOMN", leftMatchColumn);
        let leftMatch = row[leftMatchColumn.key];
        if (!leftMatch) return false;
        return leftMatch.includes(rightRow[rightEmailColumn.key])
      }).map(row => row[leftEmailColumn.key]);
    // If right matches is null, just return null.
    if (rightMatches) {
      return JSON.parse(rightMatches)[0];
    } else {
      return null;
    }
  }

   /**
   * Checks who the person on the right is matched to
   * @param leftRow 
   */
  function getLeftMatch(leftRow){
    let leftMatches = leftRow[leftMatchColumn.key];
    // If right matches is null, just return null.
    if (leftMatches) {
      return JSON.parse(leftMatches)[0];
    } else {
      return null;
    }
  }

  /**
   * Checks if two rows are matched to each other
   * @param rightRow the right row
   * @param leftRow the left row
   */
  function isLocallyMatched(rightRow, leftRow) {
    // Read Right Match
    let rightMatch = getRightMatch(rightRow);
    let leftEmail = leftRow[leftEmailColumn.key];
    return (rightMatch && leftRow) && (rightMatch == leftEmail)
  }

  /**
   * Checks if a person on the right is matched to anyone on the left
   * @param rightRow the row on the right to check
   */
  function isGloballyMatched(rightRow){
    let rightMatch = getRightMatch(rightRow);
    return rightMatch;
  }

    /**
   * Checks if a person on the left is matched to anyone on the right
   * @param leftRow the row on the right to check
   */
  function isGloballyMatchedLeft(leftRow){
    let leftMatch = getLeftMatch(leftRow);
    return leftMatch;
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
      if (isGloballyMatched(row)) {
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

  function addDistanceColumnIfNecessary(columns) {
    if (selectedLeftRows.length == 0) return columns; // no one is selected
    if (!isAnyEnabledDistanceRule(rules)) return columns; // no enabled distance rule

    const distanceColumn = {
      dataIndex: "__estimated_distance__",
      ellipsis: true,
      fixed: "right",
      fullTitle: "Distance Approx.",
      index: columns.length,
      key: "__estimated_distance__",
      title: "Distance Approx.",
      width: 150
    }

    return columns.concat([distanceColumn]);
  }

  function isHivesForHeroes() {
    return route == "hivesforheroes";
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
        columns={addDistanceColumnIfNecessary(columns)}
        selectType={"checkbox"}
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
              }
              // HivesForHeroes (newbees (left) can be matched to multiple people on right)
              if (isHivesForHeroes()) {
                if (isGloballyMatchedLeft(selectedLeftRows[0])) {
                  //Disabled "Already Matched"
                  let rightEmail = getLeftMatch(selectedLeftRows[0]);
                  let tooltip = "NewBEE already matched to "+rightEmail+"!";
                  return <Tooltip color = {'red'} title={tooltip}><Button disabled={true}>{"Match!"}</Button></Tooltip>;
                }
              } else {
                // CovidSitters/others
                if(isGloballyMatched(row)) {
                  //Disabled "Already Matched"
                  let leftEmail = getRightMatch(row);
                  let tooltip = name+" is already matched to "+leftEmail+"!";
                  return <Tooltip color = {'red'} title={tooltip}><Button disabled={true}>{"Match!"}</Button></Tooltip>;
                }
              }
              //Match
              return <Button onClick = {() => props.match(row)}>{"Match!"}</Button>;
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