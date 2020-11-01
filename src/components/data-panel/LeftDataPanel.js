import React from 'react';
import SheetsLoader from '../loader/SheetsLoader';
import Table from '../table/Table';
import { FormattedCard } from "../formatted-card/FormattedCard.js";

import { useRecoilState } from 'recoil';
import { leftDataState, rightDataState } from '../../store/atoms';
import {zipcodesToDistance} from '../../util/zipcode/zipcodeLogic.js';

export default function LeftDataPanel(props) {
  const [{ data, columns, selectedRows, matchColumn, nameColumn}, setLeftData] = useRecoilState(leftDataState);
  const [{ data: rightdata, columns: rightcolumns, selectedRows: selectedRightRows,
           matchColumn: rightMatchColumn, nameColumn: rightNameColumn}, setRightData] = useRecoilState(rightDataState);
  const matchingEnabled = props.matchingEnabled;
  
  function distanceBetween2Rows(leftrow, rightrow) {
    const zipcodeleft = leftrow.zip_code;
    const zipcoderight = rightrow.zip_code;
    if (zipcodeleft !== null && zipcoderight !== null) {
        return zipcodesToDistance(zipcodeleft, zipcoderight);
    }
    return Number.MAX_VALUE;
  }

  function left2RightMinDistance(leftrow) {
    if (rightdata !== null) {
      return Math.min.apply(null, 
      rightdata.map(rightrow => 
        {
          return distanceBetween2Rows(leftrow, rightrow) !== null ? distanceBetween2Rows(leftrow, rightrow) : Number.MAX_VALUE;
        })
        
    );
    }
    return Number.MAX_VALUE;
    
  }

  // match the left column with the right column that has the smallest distance
  // and store the matching right column as a new key,value pair inside the leftrow object
  function matchRowsByDistance(oldData) {
    return oldData.map((leftrow) => {
      let minrightrow = left2RightMinDistance(leftrow);
      leftrow = {...leftrow, matchDistanceRow:minrightrow};
      return leftrow;
    });
  }
  
  function sortLeftDataPnl(oldData) {
    let cpy = [...oldData];
    cpy.sort((row1, row2) => row1.matchDistanceRow > row2.matchDistanceRow);
    return cpy;
  }
  
  function onSelectRow(rows) {
    setLeftData(data => {
      return {
        ...data,
        selectedRows: rows
      }
    });
  }
  
  // This determines the CSS class of all rows in this left table
  function leftRowClassNameGetter(row, index) {
    // Right now just if it is not empty string or not empty list, consider it matached
    const selected = selectedRows.map(r => r.key).includes(row.key);
    // console.log("leftrow looks like:", row);
    if (matchingEnabled){
      const matched = row[matchColumn.key] && row[matchColumn.key] !== "[]";
      if (selected && matched) {
        return "selected-matched-row-left"
      }

      if (matched) {
        return "matched-row"
      }
    }

    if (selected) {
      return "selected-row"
    }

    return "unmatched-row"
  }

  return (
    <div className="DataPanel">

      {/* Data Loader */}
      {data.length === 0 && <SheetsLoader
        onUpload={setLeftData}
        allowManualSort={true}
      />}
      <br />


      {/* The actual table for this panel. Note that it's "radio" selection type.
        This means you can select only one row from this table. */}
      <Table
        rowClassNameGetter={leftRowClassNameGetter}
        onSelectRow={onSelectRow}
        data={sortLeftDataPnl(matchRowsByDistance(data))}
        columns={columns}
        selectType={"radio"}
        matchColumn={matchColumn}
      />

      {/* This just renders in the selected rows */}
      <div className="SelectionDisplay">
        {selectedRows.map((row, i) => {
          let name = nameColumn ? row[nameColumn.key] : "Left Card";
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