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
  const sortedData = applyRules(rules, data, selectedLeftRows[0], leftEmailColumn, leftMatchColumn, 
                                rightEmailColumn, props.rightMatchedToSpecificLeft, props.rightMatchedToAnyLeft,
                                route.includes("hivesforheroes"));


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
      if (props.rightMatchedToAnyLeft(row)) {
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
            console.log("BUTTON GENERATE? ::",matchingEnabled)
            if (matchingEnabled) {
              if (props.rightMatchedToSpecificLeft(row, selectedLeftRows[0])) {
                //Unmatch
                return <Button onClick = {() => props.unmatch(row)}danger={true}>{"Unmatch!"}</Button>;
              }

              // HivesForHeroes (newbees (left) can be matched to multiple people on right)
              if (isHivesForHeroes()) {
                const rightRows = props.getEachRightMatchedByLeft(selectedLeftRows[0]);
                const leftRows = props.getEachLeftMatchedByRight(row);
                // NewBEE can only match to a single mentor
                if (rightRows && rightRows.length > 0) {
                  let tooltip = "NewBEE already matched to: "+ rightRows.join(', ')+"!";
                  return <Tooltip color = {'red'} title={tooltip}><Button disabled={true}>{"Match!"}</Button></Tooltip>;
                }

                if (leftRows && leftRows.length > 0) {
                  // mentor matched to (< 3 newbees, still allow further matching)
                  if (leftRows.length < 3) {
                    let tooltip = "Mentor already matched to " + leftRows.length + " mentors: " + leftRows.join(', ');
                    return <Tooltip color = {'gold'} title={tooltip}><Button onClick = {() => props.match(row)}>{"Match!"}</Button></Tooltip>;
                  } else {
                    // mentor matched to (>= 3 newbees, no more matching allowed)
                    let tooltip = "Mentor already matched to " + leftRows.length + " mentors: " + leftRows.join(', ');
                    return <Tooltip color = {'red'} title={tooltip}><Button disabled = {true} onClick = {() => props.match(row)}>{"Match!"}</Button></Tooltip>;
                  }  
                }
              } else {
                // CovidSitters/others
                if(props.rightMatchedToAnyLeft(row)) {
                  //Disabled "Already Matched"
                  let leftEmail = props.getRightMatch(row);
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
