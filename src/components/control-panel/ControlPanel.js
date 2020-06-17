import React from 'react';
import { Select, Tooltip, Input, Checkbox, Button, Card } from "antd";
import { availableOperators } from '../util/rules';
import './ControlPanel.css'; // or 'antd/dist/antd.less'
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

const { Option } = Select;

export default function ControlPanel({setRules, rules, leftColumns, rightColumns}) {
    // // If the csv's are not uploaded, don't load panel
    // if (leftColumns.length === 0 && rightColumns.length === 0) {
    //     return (
    //         <div className="ControlPanel">
    //             Upload the csv's silly!
    //         </div>
    //     )
    // }

    const handleLeftChange = (value, i) => {
        setRules(oldRules => {
          let newRules = [...oldRules];
          if (value === "constant") {
            newRules[i].with.type = value;
            newRules[i].with.value = "";
          } else {
            newRules[i].with.type = "column";
            newRules[i].with.value = value;
          }
          return newRules
        })
    }

    const handleRightChange = (value, i) => {
        setRules(oldRules => {
          oldRules[i].by = value;
          return [...oldRules]; 
        });
    }

    const handleOpChange = (value, i) => {
      setRules(oldRules => {
        oldRules[i].operator = value;
        return [...oldRules]; 
      });
    }

    const handleCheck = (event, i) => {
        let checked = event.target.checked;
        setRules(oldRules => {
            oldRules[i].enabled = checked;
            return [...oldRules]; 
        });
    }

    const newSort = () => {
      let by = rightColumns.length === 0 ? "" : rightColumns[0].key;
      let newRule = {
        "type": "sort",
        "enabled": false,
        "by": by,
        "operator": "equals",
        "with": {
          type: "constant",
          value: "",
        }
      }
      setRules(oldRules => [...oldRules, newRule]);
    }

    const newFilter = () => {
      let by = rightColumns.length === 0 ? "" : rightColumns[0].key;
      let newRule = {
        "type": "filter",
        "enabled": false,
        "by": by,
        "operator": "equals",
        "with": {
          type: "constant",
          value: "",
        }
      }
      setRules(oldRules => [...oldRules, newRule])
    }

    const deleteRule = (i) => {
      setRules(oldRules => {
        let newRules = [...oldRules];
        newRules.splice(i, 1);
        return newRules;
      });
    }

    const handleTextInput = (event, i) => {
        let value = event.target.value;
        setRules(oldRules => {
          oldRules[i].with.value = value;
          return [...oldRules]; 
        });

    }

    return (
    <div className="ControlPanel">
      <h2>Sort</h2>
      {rules.map((rule, i) => (
        rule.type === "sort" &&
      <div className="Rule" key={i}>
        <div style={{ display: "flex", justifyContent:"space-between", width: 300}}>
          <Checkbox defaultChecked={rule.enabled} onChange={(event) => handleCheck(event, i)}>Enabled</Checkbox>
          <Button danger onClick={() => deleteRule(i)} type="text">Delete</Button>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
            {/* SELECT column for RIGHT side */}
            <Tooltip placement="top" title={"Right column"}>
              <Select
              value={rule.by}
              size={"small"}
              style={{ width: 200 }}
              onChange={(event) => handleRightChange(event, i)}
              >
                {rightColumns.map((col, i) => <Option key={i} value={col.key}>{col.title}</Option>)}
              </Select>
            </Tooltip>

            {/* SELECT operator */}

            <Tooltip placement="top" title={"Operator"}>
              <Select
                value={rule.operator}
                size={"small"}
                style={{ width: 100 }}
                onChange={(value) => handleOpChange(value, i)}
              >
                {availableOperators.map(operator => {
                  return <Option value={operator.value}>{operator.display}</Option> 
                })}
              </Select>
            </Tooltip>

          </div>
          <div>
            {/* SELECT column for LEFT side */}
            <Tooltip placement="top" title={"Left column or constant"}>
              <Select
              value={rule.with.type === "column" ? rule.with.value : "constant"}
              size={"small"}
              style={{ width: 200 }}
              onChange={(value) => handleLeftChange(value, i)}
              >
                {leftColumns.map((col, i) => <Option key={i} value={col.key}>{col.title}</Option>)}
                <Option value={"constant"}>Constant</Option>
              </Select>
            </Tooltip>
            {/* TEXT entry for constant comparator */}
            <Tooltip placement="top" title={"Input for constant"}>
              <Input
                disabled={rule.with.type === "column" ? true : false}
                value={rule.with.type === "column" ? "" : rule.with.value}
                allowClear
                style={{ width: 100 }}
                size={"small"}
                onChange={(event) => handleTextInput(event, i)}
              />
            </Tooltip>
          </div>
        </div>
      </div>))}

      <button onClick={newSort}>+</button>

      <br/>
      <br/>

      <h2>Filter</h2>

      {rules.map((rule, i) => (
        rule.type === "filter" &&
      <div className="Rule" key={i}>
        <div style={{ display: "flex", justifyContent:"space-between", width: 300}}>
          <Checkbox defaultChecked={rule.enabled} onChange={(event) => handleCheck(event, i)}>Enabled</Checkbox>
          <Button danger onClick={() => deleteRule(i)} type="text">Delete</Button>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div>
            {/* SELECT column for RIGHT side */}
            <Tooltip placement="top" title={"Right column"}>
              <Select
              value={rule.by}
              size={"small"}
              style={{ width: 200 }}
              onChange={(event) => handleRightChange(event, i)}
              >
                {rightColumns.map((col, i) => <Option key={i} value={col.key}>{col.title}</Option>)}
              </Select>
            </Tooltip>

            {/* SELECT operator */}

            <Tooltip placement="top" title={"Operator"}>
              <Select
                value={rule.operator}
                size={"small"}
                style={{ width: 100 }}
                onChange={(value) => handleOpChange(value, i)}
              >
                {availableOperators.map(operator => {
                  return <Option value={operator.value}>{operator.display}</Option> 
                })}
              </Select>
            </Tooltip>

          </div>
          <div>
            {/* SELECT column for LEFT side */}
            <Tooltip placement="top" title={"Left column or constant"}>
              <Select
              value={rule.with.type === "column" ? rule.with.value : "constant"}
              size={"small"}
              style={{ width: 200 }}
              onChange={(value) => handleLeftChange(value, i)}
              >
                {leftColumns.map((col, i) => <Option key={i} value={col.key}>{col.title}</Option>)}
                <Option value={"constant"}>Constant</Option>
              </Select>
            </Tooltip>
            {/* TEXT entry for constant comparator */}
            <Tooltip placement="top" title={"Input for constant"}>
              <Input
                disabled={rule.with.type === "column" ? true : false}
                value={rule.with.type === "column" ? "" : rule.with.value}
                allowClear
                style={{ width: 100 }}
                size={"small"}
                onChange={(event) => handleTextInput(event, i)}
              />
            </Tooltip>
          </div>
        </div>
      </div>))}

      <button onClick={newFilter}>+</button>

    </div>
    )
}