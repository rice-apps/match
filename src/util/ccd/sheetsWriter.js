import { modifySpreadsheetData, addSpreadsheetTab} from "../../util/gapi.js"

export function writeToTab(spreadsheetId, tabName, values){
    console.log("Creating new tab... "+tabName)
    addSpreadsheetTab(spreadsheetId,tabName).then(()=>{
        console.log("Writing to tab... "+tabName)
        let range = `'${tabName}'!1:1000` // 'RyanRules'!1:1000
        modifySpreadsheetData(spreadsheetId, range, values, () => console.log("hello") )
    })
   console.log("writeToTab complete!")
}