import React, {useState} from 'react';
import Loader from '../../components/loader/Loader';
import Table from '../../components/table/Table';

export default function DataPanel(props) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedRow, setSelectedRow] = useState();


  function onFileUpload(data) {
    
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
  
    // Set the state with new data/columns
    setData(formattedData);
    setColumns(columnObjects);
  
    // If file upload callback is passed down, pass upwards the data 
    if (props.onFileUpload) {
      props.onFileUpload(formattedData);
    }

  }

  function onSelectRow(row) {
    setSelectedRow(row);

    // If row select callback is passed down, pass upwards the row
    if (props.onSelectRow) {
      props.onSelectRow(row);
    }
  }
 
    return (
        <div className="DataPanel">
        <Loader onUpload={onFileUpload}/>
        <br/>
        <Table 
          onSelectRow={onSelectRow}
          data={data}
          columns={columns}
          />
        <p>{JSON.stringify(selectedRow)}</p>
      </div>
    )
}