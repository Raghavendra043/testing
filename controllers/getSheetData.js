const axios = require('axios')
const { google } = require("googleapis");

const getSheetData = async (sheetId, auth)=>{

    try{
        console.log("Fetching data ..")
        const sheets = google.sheets({version: 'v4', auth});

        const sheetList = await getSheets(sheetId, auth);

        console.log(sheetList)
        
        const data = {}

        for(const Sheet of sheetList){
            const result =  await sheets.spreadsheets.values.get({
                    spreadsheetId: sheetId,
                    range: Sheet,
                })
            let Data = []
            
            for(let row of result.data.values){
                let Row = {}
                let i= 0;
                for(let values of row){
                    Row[i] = values
                    i+=1
                }
                Data.push(Row)
            }
            data[Sheet] = Data
            
        }
        return data;

    } catch(error){
        console.log(error)
        return error
    }

}

const getSheets = async (sheetId, auth)=>{
    try {
        const sheets = google.sheets({version: 'v4', auth});

        const metaData = await sheets.spreadsheets.get({
            spreadsheetId: sheetId
          });
        
        const properties = metaData.data.sheets;
        let sheetList = []

        for(const Sheet of properties) {
            sheetList.push(Sheet.properties.title)
        }
        return sheetList
    } catch(error){
        console.log(error)
    }

}

module.exports ={
    getSheetData
}