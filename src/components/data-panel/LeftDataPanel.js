import React from 'react';
import Table from '../table/Table';
import { FormattedCard } from "../formatted-card/FormattedCard.js";
import { useRecoilState } from 'recoil';
import { leftDataState, rightDataState } from '../../store/atoms';
import {zipcodesToDistance} from '../../util/zipcode/zipcodeLogic.js';

export default function LeftDataPanel(props) {
  const [{ data, columns, selectedRows, matchColumn, nameColumn, shouldSortLeft}, setLeftData] = useRecoilState(leftDataState);
  const [{ data: rightdata}] = useRecoilState(rightDataState);
  const matchingEnabled = props.matchingEnabled;
  const salesforceEnabled = props.salesforceEnabled;

  const sortedData = sortLeftDataPnl(calcEachMinDistance(data));
  
  /**
   * Sort the rows in this left data panel (if they should be sorted)
   * @param oldData the data to sort
   */
  function sortLeftDataPnl(oldData) {
    // If we aren't sorting the left data, return it unchanged
    if (!shouldSortLeft || !rightdata) return oldData;

    let cpy = [...oldData];

    // Sort by distance
    cpy.sort((row1, row2) => row1.matchDistanceRow - row2.matchDistanceRow);

    // Sort by unmatched first
    cpy.sort((row1, row2) => {
      let val1 = row1[matchColumn.key] ? 1 : 0;
      let val2 = row2[matchColumn.key] ? 1 : 0;
      return val1 - val2;
    })

    return cpy;
  }

  /**
   * Find the distance between two people represented by two different row
   * @param leftrow the row from the left side of the first person
   * @param rightrow the row from the right side of the second person
   */
  function distanceBetween2Rows(leftrow, rightrow) {
    const zipcodeleft = leftrow.zip_code;
    const zipcoderight = rightrow.zip_code;
    if (zipcodeleft !== null && zipcoderight !== null) {
        return zipcodesToDistance(zipcodeleft, zipcoderight);
    }
    return Number.MAX_VALUE;
  }

  /**
   * Get the minimum distance between a row on the left and any row on the right
   * @param leftrow the row on the left to check against all right rows
   */
  function left2RightMinDistance(leftrow) {
    return Math.min.apply(null, 
      rightdata.map((rightrow) => {
        let dist = distanceBetween2Rows(leftrow, rightrow);
        return dist ? dist : Number.MAX_VALUE
      }) 
    );
  }

  /**
   * Find the right row that has the smallest distance, for each left row
   * and store that distance as a new key,value pair inside the leftrow object
   * @param leftData the leftData
   */
  function calcEachMinDistance(leftData) {
    return leftData.map((leftrow) => {
      return {
        ...leftrow, 
        matchDistanceRow: left2RightMinDistance(leftrow)};
    });
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

  // if(data.length === 0)
  //   setLeftData(getNewbees())

  return (
    <div className="DataPanel">
      <h5>NewBees</h5>
      {/* Data Loader */}

      {/* The actual table for this panel. Note that it's "radio" selection type.
        This means you can select only one row from this table. */}
      <Table
        rowClassNameGetter={leftRowClassNameGetter}
        onSelectRow={onSelectRow}
        data={sortedData}
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