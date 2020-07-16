import React from 'react';
import { Select, Collapse, Checkbox } from 'antd';

const { Option } = Select;
const { Panel } = Collapse;


export default function ColumnSettingsPanel({data, setData, title}) {
    
    function changeColumn(value, columnType, data, setDataStateFunction) {
        let column = data.columns[value];
        setDataStateFunction(oldLeftDataState => {
            return {
                ...oldLeftDataState,
                [columnType]: column
            }
        })
    }

    function setColumnFixed(column, setDataStateFunction, direction) {
        let newColumn = {
            ...column,
            fixed: (column.fixed === direction) ? "" : direction
        };
        setDataStateFunction(
            oldDataState => {
                return {
                    ...oldDataState,
                    columns: Object.assign([], oldDataState.columns, { [column.index]: newColumn }),
                }
            }
        )
    }


    return (
        <div style={{ width: "30%", paddingTop: 20 }}>
            <div>
                Match column: &nbsp;
                <Select value={data.matchColumn ? data.matchColumn.title : null} style={{ width: 250 }}
                    onChange={(value) => changeColumn(value, 'matchColumn', data, setData)}>
                    {data.columns.map((column, i) => {
                        return (
                            <Option key={i}>{column.title}</Option>
                        )
                    })}
                </Select>
            </div>

            <br />

            <div>
                Name column: &nbsp;
                <Select value={data.nameColumn ? data.nameColumn.title : null} style={{ width: 250 }}
                    onChange={(value) => changeColumn(value, 'nameColumn', data, setData)}>
                    {data.columns.map((column, i) => {
                        return (
                            <Option key={i}>{column.title}</Option>
                        )
                    })}
                </Select>
            </div>

            <br />

            <Collapse accordion>
                <Panel header={title} key="1">
                    <h6>Left Columns:</h6>
                    {data.columns.map((column, i) => {
                        return (
                            <div key={i} style={{ display: "flex", flexDirection: "row" }}>
                                <p style={{ width: 300 }}>{column.fullTitle}</p> &nbsp;
                                <Checkbox checked={column.fixed === "left"} onChange={() => setColumnFixed(column, setData, "left")}>FL</Checkbox>
                                <Checkbox checked={column.fixed === "right"} onChange={() => setColumnFixed(column, setData, "right")}>FR</Checkbox>
                            </div>
                        )
                    })}
                </Panel>
            </Collapse>
        </div>
    )
}