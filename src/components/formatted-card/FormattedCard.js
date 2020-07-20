import React from 'react';
import { Card } from "antd";
export { FormattedCard }

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}
const replaceUnderscoreWithSpace = (s) => {
  return s.replace(/_/g, " ")
}
function formatText(txt){
  return replaceUnderscoreWithSpace(capitalize(txt))
}
function FormattedCard(props){
  return (
    <Card title={props.title || "Card"} extra={props.extra} style={props.style}>
      {Object.entries(props.row).map((attribute, ii) => {
        let [key, value] = attribute;
        return (<p key={key}><strong>{formatText(key)}:</strong><br/>{value ? value : <em>Nothing</em> }</p>)
      })}
    </Card>
  )
}
