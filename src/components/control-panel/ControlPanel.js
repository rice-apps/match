import React, { useEffect } from "react";
import { Select, Tooltip, Input, Checkbox, Button } from "antd";
import { availableOperators } from "../../util/rules";
import { useRecoilState, useRecoilValue } from "recoil";
import { rightDataState, leftDataState, rulesState } from "../../store/atoms";

import "./ControlPanel.css";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import { useLocation } from 'react-router-dom';

const { Option } = Select;

function replaceItemAtIndex(arr, index, newValue) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

let didSetDefault = false;

export default function ControlPanel() {
  const { columns: leftColumns } = useRecoilValue(leftDataState);
  const { columns: rightColumns } = useRecoilValue(rightDataState);
  const [rules, setRules] = useRecoilState(rulesState);
  const route = useLocation().pathname.split("/")[1];

  // Apply default sorts on data load
  useEffect(() => {
    // Only set the default sorts once
    if (!didSetDefault) {
      console.log("Applying default rules");
      if (applyDefaultRules() != -1) {
        didSetDefault = true;
      }
    }
  }, [leftColumns]);

  const handleLeftChange = (value, i) => {
    let newRules;
    if (value === "constant") {
      newRules = replaceItemAtIndex(rules, i, {
        ...rules[i],
        with: {
          type: value,
          value: "",
        },
      });
    } else {
      newRules = replaceItemAtIndex(rules, i, {
        ...rules[i],
        with: {
          type: "column",
          value: value,
        },
      });
    }
    setRules(newRules);
  };

  const handleRightChange = (value, i) => {
    // console.log("value", value);
    const newRules = replaceItemAtIndex(rules, i, {
      ...rules[i],
      by: value,
    });
    setRules(newRules);
  };

  const handleOpChange = (value, i) => {
    // update with by: zip code column, and value: zip code column
    if (value === "distance") {
      // const idxLeft = leftColumns.findIndex(element => element.key.includes("zip") && element.key.includes("code"));
      // const idxRight = rightColumns.findIndex(element => element.key.includes("zip") && element.key.includes("code"));
      const idxLeft = leftColumns.findIndex(element => element.key === ("coordinate"));
      const idxRight = rightColumns.findIndex(element => element.key === ("coordinate"));
      if (idxLeft !== -1 && idxRight !== -1) {
        const newRules = replaceItemAtIndex(rules, i, {
          ...rules[i],
          operator: "distance",
          with: {
            type: "column",
            value: leftColumns[idxLeft].key,
          },
          by: rightColumns[idxRight].key,
        });
        setRules(newRules);
        return;
      }
    }
    const newRules = replaceItemAtIndex(rules, i, {
      ...rules[i],
      operator: value,
    });
    setRules(newRules);
  };

  const handleCheck = (event, i) => {
    let checked = event.target.checked;
    const newRules = replaceItemAtIndex(rules, i, {
      ...rules[i],
      enabled: checked,
    });
    setRules(newRules);
  };

  const handleTextInput = (event, i) => {
    let value = event.target.value;
    const newRules = replaceItemAtIndex(rules, i, {
      ...rules[i],
      with: {
        ...rules[i].with,
        value: value,
      },
    });
    setRules(newRules);
  };

  const newSort = () => {
    let by = rightColumns.length === 0 ? "" : rightColumns[0].key;
    let newRule = {
      type: "sort",
      enabled: false,
      by: by,
      operator: "equals",
      with: {
        type: "constant",
        value: "",
      },
    };
    setRules((oldRules) => [...oldRules, newRule]);
  };

  const newFilter = () => {
    let by = rightColumns.length === 0 ? "" : rightColumns[0].key;
    let newRule = {
      type: "filter",
      enabled: false,
      by: by,
      operator: "equals",
      with: {
        type: "constant",
        value: "",
      },
    };
    setRules((oldRules) => [...oldRules, newRule]);
  };

  const deleteRule = (i) => {
    setRules((oldRules) => {
      let newRules = oldRules.slice();
      newRules.splice(i, 1);
      return newRules;
    });
  };

  const createSortDefaultSetting = (by, value, operator, type='constant') => {
    return {
      type: "sort",
      enabled: true,
      by,
      operator: operator,
      with: {
        type,
        value,
      },
    };
  };

  const applyDefaultRules = () => {
    let defaultSettings = [];
    if (route === "hivesforheroes" && leftColumns && rightColumns) {
      // Search for a "Zip Code" column
      const idxLeft = leftColumns.findIndex(element => element.key === "coordinate");
      const idxRight = rightColumns.findIndex(element => element.key === "coordinate");
      if (idxLeft === -1 || idxRight === -1) {
        return -1;
      }
      defaultSettings = [{
        // DISTANCE SORT
        type: "sort",
        enabled: true,
        operator: "distance",
        with: {
          type: "column",
          value: leftColumns[idxLeft].key,
        },
        by: rightColumns[idxRight].key,
      }];
      setRules(defaultSettings);
    } else {
      return -1;
    }
  };

  return (
    <div className="ControlPanel">
      <h2>Sort</h2>
      <Button onClick={applyDefaultRules}>
        Use Default Sorts/Filters
      </Button>
      {rules.filter((r) => r.type === "sort").length > 0 ? (
        rules.map(
          (rule, i) =>
            rule.type === "sort" && (
              <div className="Rule" key={i}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: 300,
                  }}
                >
                  <Checkbox
                    defaultChecked={rule.enabled}
                    onChange={(event) => handleCheck(event, i)}
                  >
                    Enabled
                  </Checkbox>
                  <Button danger onClick={() => deleteRule(i)} type="text">
                    Delete
                  </Button>
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
                        {rightColumns.map((col, i) => (
                          <Option key={i} value={col.key}>
                            {col.title}
                          </Option>
                        ))}
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
                        {availableOperators.map((operator, i) => {
                          return (
                            <Option value={operator.value} key={i}>
                              {operator.display}
                            </Option>
                          );
                        })}
                      </Select>
                    </Tooltip>
                  </div>
                  <div>
                    {/* SELECT column for LEFT side */}
                    <Tooltip placement="top" title={"Left column or constant"}>
                      <Select
                        value={
                          rule.with.type === "column"
                            ? rule.with.value
                            : "constant"
                        }
                        size={"small"}
                        style={{ width: 200 }}
                        onChange={(value) => handleLeftChange(value, i)}
                      >
                        {leftColumns.map((col, i) => (
                          <Option key={i} value={col.key}>
                            {col.title}
                          </Option>
                        ))}
                        <Option value={"constant"}>Constant</Option>
                      </Select>
                    </Tooltip>
                    {/* TEXT entry for constant comparator */}
                    <Tooltip placement="top" title={"Input for constant"}>
                      <Input
                        disabled={rule.with.type === "column" ? true : false}
                        value={
                          rule.with.type === "column" ? "" : rule.with.value
                        }
                        allowClear
                        style={{ width: 100 }}
                        size={"small"}
                        onChange={(event) => handleTextInput(event, i)}
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            )
        )
      ) : (
        <>
          <p>
            <i>No filters added.</i>
          </p>
          <p>
            Filters are useful to hide data that don't meet certain criteria.
            Click the "+" sign to create one!
          </p>
        </>
      )}

      <Button shape="circle" onClick={newSort}>
        <b>+</b>
      </Button>

      <br />
      <br />

      <h2>Filter</h2>
      {rules.filter((r) => r.type === "filter").length > 0 ? (
        rules.map(
          (rule, i) =>
            rule.type === "filter" && (
              <div className="Rule" key={i}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: 300,
                  }}
                >
                  <Checkbox
                    defaultChecked={rule.enabled}
                    onChange={(event) => handleCheck(event, i)}
                  >
                    Enabled
                  </Checkbox>
                  <Button danger onClick={() => deleteRule(i)} type="text">
                    Delete
                  </Button>
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
                        {rightColumns.map((col, i) => (
                          <Option key={i} value={col.key}>
                            {col.title}
                          </Option>
                        ))}
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
                        {availableOperators.map((operator, i) => {
                          return (
                            <Option value={operator.value} key={i}>
                              {operator.display}
                            </Option>
                          );
                        })}
                      </Select>
                    </Tooltip>
                  </div>
                  <div>
                    {/* SELECT column for LEFT side */}
                    <Tooltip placement="top" title={"Left column or constant"}>
                      <Select
                        value={
                          rule.with.type === "column"
                            ? rule.with.value
                            : "constant"
                        }
                        size={"small"}
                        style={{ width: 200 }}
                        onChange={(value) => handleLeftChange(value, i)}
                      >
                        {leftColumns.map((col, i) => (
                          <Option key={i} value={col.key}>
                            {col.title}
                          </Option>
                        ))}
                        <Option value={"constant"}>Constant</Option>
                      </Select>
                    </Tooltip>
                    {/* TEXT entry for constant comparator */}
                    <Tooltip placement="top" title={"Input for constant"}>
                      <Input
                        disabled={rule.with.type === "column" ? true : false}
                        value={
                          rule.with.type === "column" ? "" : rule.with.value
                        }
                        allowClear
                        style={{ width: 100 }}
                        size={"small"}
                        onChange={(event) => handleTextInput(event, i)}
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            )
        )
      ) : (
        <>
          <p>
            <i>No sorts added.</i>
          </p>
          <p>
            Sorts are useful rank elements by some criteria. Click the "+" sign
            to create one!
          </p>
        </>
      )}

      <Button shape="circle" onClick={newFilter}>
        <b>+</b>
      </Button>
    </div>
  );
}
