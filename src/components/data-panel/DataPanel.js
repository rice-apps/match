import React, {useState} from 'react';
import Loader from '../../components/loader/Loader';
import Table from '../../components/table/Table';

export default function DataPanel(props) {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [selectedRow, setSelectedRow] = useState();


  function onUpload(data) {
    
    // Column objects come from first array in data
    // Key is column name in lower case, where spaces replaced by underscore
    const columnObjects = data[0].map(column => {return {key: column.toLowerCase().replace(/ /g,"_"), width: 100, title: column}});
    
    // Excluding column header row, map all rows into formatted object
    var formattedData = data.slice(1).map(
      row => {
        var rowObject = {}
        row.map(
          (columnValue, i) => {
            var columnName = columnObjects[i].key;
            rowObject[columnName] = columnValue;
            return null;
          }
        )
        return rowObject;
      }
    );

    setData(formattedData);
    setColumns(columnObjects);
  }

  function onSelectRow(row) {
    setSelectedRow(row);
  }
 
    return (
        <div className="Half">
        <Loader onUpload={onUpload}/>
        <Table 
          onSelectRow={onSelectRow}
          data={data}
          columns={columns}
          />
        <p>{JSON.stringify(selectedRow)}</p>
      </div>
    )
}