import React from 'react';
import { Select, Input, Checkbox } from "antd";
import './ControlPanel.css'; // or 'antd/dist/antd.less'
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

const { Option } = Select;

export default function ControlPanel({setRules, rules, leftColumns, rightColumns}) {

    if (leftColumns.length === 0 && rightColumns.length === 0) {
        return (
            <div className="ControlPanel">
                Upload the csv's silly!
            </div>
        )
    }

    const handleLeftChange = (value, i) => {
        console.log(`selected ${value}`);
    }

    const handleRightChange = (value, i) => {
        console.log(`selected ${value}`);
    }

    const handleOpChange = (value, i) => {
        console.log(`selected ${value}`);
    }

    const handleCheck = (event, i) => {
        let checked = event.target.checked;
        setRules(oldRules => {
            oldRules[i].enabled = false;
            return [...oldRules]; 
        });
    }

    const handleTextInput = (event, i) => {
        let value = event.target.value;
        console.log(value);
    }

    return (
    <div className="ControlPanel">
      <h2>Sorts</h2>
      {rules.map((rule, i) => (
      <div className="Rule" key={i}>
        <Checkbox defaultChecked={rule.enabled} onChange={(event) => handleCheck(event, i)}>Enabled</Checkbox>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
            <Select
            defaultValue={rule.by}
            size={"small"}
            style={{ width: 200 }}
            onChange={(event) => handleLeftChange(event, i)}
            >
              {leftColumns.map(col => <Option value={col.key}>{col.title}</Option>)}
            </Select>

            <Select
              defaultValue="="
              size={"small"}
              style={{ width: 50 }}
              onChange={(value) => handleOpChange(value, i)}
            >
              <Option value="≠">≠</Option>
            </Select>
          </div>
          <div>
            <Select
            defaultValue={rule.with.type === "column" ? rule.with.value : "constant"}
            size={"small"}
            style={{ width: 150 }}
            onChange={(value) => handleRightChange(value, i)}
            >
              {rightColumns.map(col => <Option value={col.key}>{col.title}</Option>)}
            </Select>
            <Input
              disabled={rule.with.type === "column" ? true : false}
              defaultValue={rule.with.value}
              allowClear
              style={{ width: 100 }}
              size={"small"}
              onChange={(event) => handleTextInput(event, i)}
            />
          </div>
        </div>
      </div>))}
    </div>
    )
}